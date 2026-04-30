// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {ERC20PermitUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import {ERC20BurnableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

interface IPlatformConfig {
    function getConfigUintValue(string calldata key) external view returns (uint256);
}

/// @title SAPToken
/// @notice Sapphire Mall 平台治理与实用代币（桶分配 + 线性释放）
/// @dev ERC20 + Permit + Burnable + AccessControl + Pausable + UUPS
contract SAPToken is
    Initializable,
    ERC20Upgradeable,
    ERC20PermitUpgradeable,
    ERC20BurnableUpgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable
{
    /// @notice 代币总供应上限：10亿 SAP（18 decimals）
    uint256 public constant MAX_SUPPLY = 1_000_000_000 ether;
    /// @notice 社区激励桶总上限：50%（5亿）
    uint256 public constant COMMUNITY_INCENTIVE_CAP = 500_000_000 ether; // 50%
    /// @notice 兑换通道可使用的社区激励额度上限：2.5亿
    uint256 public constant EXCHANGE_COMMUNITY_CAP = 250_000_000 ether; // 社区激励中的50%
    /// @dev 基点分母，10000 = 100%
    uint256 private constant BPS_DENOMINATOR = 10_000;
    /// @dev 简化月周期（按30天计）
    uint64 private constant MONTH = 30 days;

    /// @notice 铸造角色：可调用桶铸造接口（mintFromBucket / batchMintFromBucket）
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    /// @notice 暂停角色：可暂停/恢复转账与铸造相关状态更新
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    /// @notice 销毁角色：可执行 burnFrom（需 allowance）
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    /// @notice 升级角色：控制 UUPS 升级授权
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    /// @notice 兑换角色：仅可走兑换专用铸造入口 mintForExchange
    bytes32 public constant EXCHANGE_ROLE = keccak256("EXCHANGE_ROLE");

    /// @notice 社区激励桶（用于激励与兑换出币来源）
    bytes32 public constant BUCKET_COMMUNITY_INCENTIVE = keccak256("community_incentive");
    /// @notice 生态基金桶
    bytes32 public constant BUCKET_ECOSYSTEM_FUND = keccak256("ecosystem_fund");
    /// @notice 团队桶
    bytes32 public constant BUCKET_TEAM = keccak256("team");
    /// @notice 投资者桶
    bytes32 public constant BUCKET_INVESTORS = keccak256("investors");
    /// @notice 金库桶
    bytes32 public constant BUCKET_TREASURY = keccak256("treasury");

    /// @notice PlatformConfig 中“社区激励桶 cap”配置键
    string public constant CFG_BUCKET_COMMUNITY_CAP = "sap.token.bucket.community.cap";
    /// @notice PlatformConfig 中“生态基金桶 cap”配置键
    string public constant CFG_BUCKET_ECOSYSTEM_CAP = "sap.token.bucket.ecosystem.cap";
    /// @notice PlatformConfig 中“团队桶 cap”配置键
    string public constant CFG_BUCKET_TEAM_CAP = "sap.token.bucket.team.cap";
    /// @notice PlatformConfig 中“投资者桶 cap”配置键
    string public constant CFG_BUCKET_INVESTORS_CAP = "sap.token.bucket.investors.cap";
    /// @notice PlatformConfig 中“金库桶 cap”配置键
    string public constant CFG_BUCKET_TREASURY_CAP = "sap.token.bucket.treasury.cap";

    /// @notice 单个分配桶的释放参数与铸造进度
    struct BucketConfig {
        uint256 cap; // 桶总上限
        uint256 minted; // 桶已铸造数量
        uint16 tgeBps; // TGE 立即释放比例（bps）
        uint64 startTime; // 释放起始时间
        uint64 cliffDuration; // cliff 锁仓时长
        uint64 linearDuration; // cliff 后线性释放时长
        bool exists; // 桶是否已初始化
    }

    mapping(bytes32 => BucketConfig) private _bucketConfigs;

    uint256 public totalMinted; // 全局累计铸造
    uint256 public totalBurned; // 全局累计销毁
    uint256 public exchangeMinted; // 通过兑换入口累计铸造
    address public platformConfig; // 全局配置合约地址

    event BucketConfigured(
        bytes32 indexed bucket,
        uint256 cap,
        uint16 tgeBps,
        uint64 startTime,
        uint64 cliffDuration,
        uint64 linearDuration
    );
    event TokensMinted(bytes32 indexed bucket, address indexed to, uint256 amount);
    event BatchMintCompleted(bytes32 indexed bucket, uint256 recipientCount, uint256 totalAmount);
    event TokensBurned(address indexed from, uint256 amount);
    event ExchangeMinted(address indexed to, uint256 amount);
    event PlatformConfigUpdated(address indexed oldConfig, address indexed newConfig);
    event BucketsReinitializedFromConfig(address indexed config, uint64 startTime);

    error ZeroAddress();
    error ZeroAmount();
    error BucketNotFound();
    error InvalidBps();
    error InvalidArrayLength();
    error InvalidBatchSize();
    error ExceedsMaxSupply();
    error ExceedsBucketCap();
    error ExceedsBucketMintable();
    error ExceedsExchangeCap();
    error ConfigAddressNotSet();
    error InvalidAllocationSum(uint256 totalCap);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        string memory name_,
        string memory symbol_,
        address admin
    ) external initializer {
        if (admin == address(0)) revert ZeroAddress();

        __ERC20_init(name_, symbol_);
        __ERC20Permit_init(name_);
        __ERC20Burnable_init();
        __AccessControl_init();
        __Pausable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(BURNER_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);
        _grantRole(EXCHANGE_ROLE, admin);

        uint64 start = uint64(block.timestamp);

        // 50% 社区激励: 48个月线性释放
        _configureBucket(BUCKET_COMMUNITY_INCENTIVE, COMMUNITY_INCENTIVE_CAP, 0, start, 0, 48 * MONTH);
        // 20% 生态基金: TGE 10%, 24个月线性释放
        _configureBucket(BUCKET_ECOSYSTEM_FUND, 200_000_000 ether, 1000, start, 0, 24 * MONTH);
        // 15% 团队: 锁仓12个月, 36个月线性释放
        _configureBucket(BUCKET_TEAM, 150_000_000 ether, 0, start, 12 * MONTH, 36 * MONTH);
        // 15% 投资者: 锁仓6个月, 24个月线性释放
        _configureBucket(BUCKET_INVESTORS, 150_000_000 ether, 0, start, 6 * MONTH, 24 * MONTH);
        // 0% 社区金库: 当前版本先不分配，后续可治理调整
        _configureBucket(BUCKET_TREASURY, 0, 0, start, 0, 0);
    }

    /// @notice 设置全局配置合约地址（后台配置中心）
    function setPlatformConfig(address config) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (config == address(0)) revert ZeroAddress();
        address old = platformConfig;
        platformConfig = config;
        emit PlatformConfigUpdated(old, config);
    }

    /// @notice 从 PlatformConfig 读取桶 cap 并重新初始化桶参数
    /// @dev 不会重置 minted；如果新 cap 小于已铸造数量会回滚
    function reinitializeAllocationsFromConfig(uint64 startTime) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (platformConfig == address(0)) revert ConfigAddressNotSet();
        IPlatformConfig cfg = IPlatformConfig(platformConfig);

        uint256 communityCap = cfg.getConfigUintValue(CFG_BUCKET_COMMUNITY_CAP);
        uint256 ecosystemCap = cfg.getConfigUintValue(CFG_BUCKET_ECOSYSTEM_CAP);
        uint256 teamCap = cfg.getConfigUintValue(CFG_BUCKET_TEAM_CAP);
        uint256 investorsCap = cfg.getConfigUintValue(CFG_BUCKET_INVESTORS_CAP);
        uint256 treasuryCap = cfg.getConfigUintValue(CFG_BUCKET_TREASURY_CAP);

        uint256 totalCap = communityCap + ecosystemCap + teamCap + investorsCap + treasuryCap;
        if (totalCap != MAX_SUPPLY) revert InvalidAllocationSum(totalCap);

        _reconfigureBucket(BUCKET_COMMUNITY_INCENTIVE, communityCap, 0, startTime, 0, 48 * MONTH);
        _reconfigureBucket(BUCKET_ECOSYSTEM_FUND, ecosystemCap, 1000, startTime, 0, 24 * MONTH);
        _reconfigureBucket(BUCKET_TEAM, teamCap, 0, startTime, 12 * MONTH, 36 * MONTH);
        _reconfigureBucket(BUCKET_INVESTORS, investorsCap, 0, startTime, 6 * MONTH, 24 * MONTH);
        _reconfigureBucket(BUCKET_TREASURY, treasuryCap, 0, startTime, 0, 0);

        emit BucketsReinitializedFromConfig(platformConfig, startTime);
    }

    /// @notice 治理调整某个桶的释放配置
    /// @dev 仅管理员可调用；新 cap 不得低于已铸造数量
    function configureBucket(
        bytes32 bucket,
        uint256 cap,
        uint16 tgeBps,
        uint64 startTime,
        uint64 cliffDuration,
        uint64 linearDuration
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        BucketConfig storage cfg = _getBucketConfig(bucket);
        if (cap < cfg.minted) revert ExceedsBucketCap();
        _validateBps(tgeBps);
        cfg.cap = cap;
        cfg.tgeBps = tgeBps;
        cfg.startTime = startTime;
        cfg.cliffDuration = cliffDuration;
        cfg.linearDuration = linearDuration;

        emit BucketConfigured(bucket, cap, tgeBps, startTime, cliffDuration, linearDuration);
    }

    /// @notice 从指定桶按当前可释放额度铸造
    /// @dev 需要 MINTER_ROLE，且 amount 不能超过当下可铸造值
    function mintFromBucket(bytes32 bucket, address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();

        BucketConfig storage cfg = _getBucketConfig(bucket);
        uint256 mintableNow = getBucketMintableNow(bucket);
        if (amount > mintableNow) revert ExceedsBucketMintable();
        _mintWithChecks(cfg, to, amount, bucket);
    }

    /// @notice 批量铸造，适用于月度发放/空投等场景
    /// @dev 单次最多200条，避免超大批次导致交易失败
    function batchMintFromBucket(
        bytes32 bucket,
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external onlyRole(MINTER_ROLE) {
        uint256 len = recipients.length;
        if (len != amounts.length) revert InvalidArrayLength();
        if (len == 0 || len > 200) revert InvalidBatchSize();

        BucketConfig storage cfg = _getBucketConfig(bucket);
        uint256 totalAmount = 0;

        for (uint256 i = 0; i < len; i++) {
            if (recipients[i] == address(0)) revert ZeroAddress();
            totalAmount += amounts[i];
        }
        if (totalAmount == 0) revert ZeroAmount();
        if (totalAmount > getBucketMintableNow(bucket)) revert ExceedsBucketMintable();

        if (totalMinted + totalAmount > MAX_SUPPLY) revert ExceedsMaxSupply();
        if (cfg.minted + totalAmount > cfg.cap) revert ExceedsBucketCap();

        cfg.minted += totalAmount;
        totalMinted += totalAmount;
        for (uint256 i = 0; i < len; i++) {
            _mint(recipients[i], amounts[i]);
        }

        emit BatchMintCompleted(bucket, len, totalAmount);
    }

    /// @notice 兑换专用入口：仅从社区激励桶出币，且总兑换额度上限2.5亿
    /// @dev 同时受“兑换额度上限”和“社区桶当前可释放额度”双重约束
    function mintForExchange(address to, uint256 amount) external onlyRole(EXCHANGE_ROLE) {
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();

        if (exchangeMinted + amount > EXCHANGE_COMMUNITY_CAP) revert ExceedsExchangeCap();

        BucketConfig storage cfg = _getBucketConfig(BUCKET_COMMUNITY_INCENTIVE);
        uint256 mintableNow = getBucketMintableNow(BUCKET_COMMUNITY_INCENTIVE);
        if (amount > mintableNow) revert ExceedsBucketMintable();

        exchangeMinted += amount;
        _mintWithChecks(cfg, to, amount, BUCKET_COMMUNITY_INCENTIVE);
        emit ExchangeMinted(to, amount);
    }

    /// @notice 紧急暂停转账与铸造相关状态更新（通过 _update 生效）
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /// @notice 恢复合约可转账状态
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /// @notice 持币人自销毁
    function burn(uint256 amount) public override {
        super.burn(amount);
        totalBurned += amount;
        emit TokensBurned(_msgSender(), amount);
    }

    /// @notice 受权角色代扣销毁（需满足 allowance）
    function burnFrom(address account, uint256 amount) public override onlyRole(BURNER_ROLE) {
        super.burnFrom(account, amount);
        totalBurned += amount;
        emit TokensBurned(account, amount);
    }

    /// @notice 获取某桶完整配置
    function getBucketConfig(bytes32 bucket) external view returns (BucketConfig memory) {
        return _getBucketConfig(bucket);
    }

    /// @notice 获取某桶剩余额度（cap - minted）
    function getBucketRemaining(bytes32 bucket) external view returns (uint256) {
        BucketConfig storage cfg = _getBucketConfig(bucket);
        return cfg.cap - cfg.minted;
    }

    /// @notice 获取某桶当前时刻可铸造额度
    /// @dev 计算公式：unlocked(now) - minted
    function getBucketMintableNow(bytes32 bucket) public view returns (uint256) {
        BucketConfig storage cfg = _getBucketConfig(bucket);
        uint256 unlocked = _unlockedAmount(cfg, uint64(block.timestamp));
        if (unlocked <= cfg.minted) {
            return 0;
        }
        return unlocked - cfg.minted;
    }

    /// @notice 当前流通量（本实现中等于 totalSupply）
    function circulatingSupply() external view returns (uint256) {
        return totalSupply();
    }

    /// @notice 兑换额度剩余可用值（2.5亿 - exchangeMinted）
    function getExchangeRemaining() external view returns (uint256) {
        return EXCHANGE_COMMUNITY_CAP - exchangeMinted;
    }

    function getAllAllocations()
        external
        pure
        returns (bytes32[] memory names, uint256[] memory caps)
    {
        names = new bytes32[](5);
        names[0] = BUCKET_COMMUNITY_INCENTIVE;
        names[1] = BUCKET_ECOSYSTEM_FUND;
        names[2] = BUCKET_TEAM;
        names[3] = BUCKET_INVESTORS;
        names[4] = BUCKET_TREASURY;

        caps = new uint256[](5);
        caps[0] = COMMUNITY_INCENTIVE_CAP;
        caps[1] = 200_000_000 ether;
        caps[2] = 150_000_000 ether;
        caps[3] = 150_000_000 ether;
        caps[4] = 0;
    }

    function _configureBucket(
        bytes32 bucket,
        uint256 cap,
        uint16 tgeBps,
        uint64 startTime,
        uint64 cliffDuration,
        uint64 linearDuration
    ) internal {
        _validateBps(tgeBps);
        _bucketConfigs[bucket] = BucketConfig({
            cap: cap,
            minted: 0,
            tgeBps: tgeBps,
            startTime: startTime,
            cliffDuration: cliffDuration,
            linearDuration: linearDuration,
            exists: true
        });
        emit BucketConfigured(bucket, cap, tgeBps, startTime, cliffDuration, linearDuration);
    }

    function _reconfigureBucket(
        bytes32 bucket,
        uint256 cap,
        uint16 tgeBps,
        uint64 startTime,
        uint64 cliffDuration,
        uint64 linearDuration
    ) internal {
        BucketConfig storage cfg = _getBucketConfig(bucket);
        if (cap < cfg.minted) revert ExceedsBucketCap();
        _validateBps(tgeBps);
        cfg.cap = cap;
        cfg.tgeBps = tgeBps;
        cfg.startTime = startTime;
        cfg.cliffDuration = cliffDuration;
        cfg.linearDuration = linearDuration;
        emit BucketConfigured(bucket, cap, tgeBps, startTime, cliffDuration, linearDuration);
    }

    /// @dev 全局供应与桶上限双重校验后执行铸造
    function _mintWithChecks(
        BucketConfig storage cfg,
        address to,
        uint256 amount,
        bytes32 bucket
    ) internal {
        if (totalMinted + amount > MAX_SUPPLY) revert ExceedsMaxSupply();
        if (cfg.minted + amount > cfg.cap) revert ExceedsBucketCap();

        cfg.minted += amount;
        totalMinted += amount;
        _mint(to, amount);

        emit TokensMinted(bucket, to, amount);
    }

    /// @dev 计算某桶在指定时间的累计可解锁数量（TGE + cliff后线性）
    function _unlockedAmount(BucketConfig storage cfg, uint64 nowTs) internal view returns (uint256) {
        uint256 tgeUnlocked = (cfg.cap * cfg.tgeBps) / BPS_DENOMINATOR;
        if (cfg.linearDuration == 0) {
            return tgeUnlocked;
        }
        uint64 linearStart = cfg.startTime + cfg.cliffDuration;
        if (nowTs <= linearStart) {
            return tgeUnlocked;
        }

        uint256 linearCap = cfg.cap - tgeUnlocked;
        uint64 elapsed = nowTs - linearStart;
        if (elapsed >= cfg.linearDuration) {
            return cfg.cap;
        }
        return tgeUnlocked + (linearCap * elapsed) / cfg.linearDuration;
    }

    /// @dev 读取桶配置并校验存在性
    function _getBucketConfig(bytes32 bucket) internal view returns (BucketConfig storage cfg) {
        cfg = _bucketConfigs[bucket];
        if (!cfg.exists) revert BucketNotFound();
    }

    /// @dev 校验 bps 合法区间 [0, 10000]
    function _validateBps(uint16 tgeBps) internal pure {
        if (tgeBps > BPS_DENOMINATOR) revert InvalidBps();
    }

    /// @dev 所有转账入口都会走 _update，暂停时统一阻断
    function _update(address from, address to, uint256 value) internal override whenNotPaused {
        super._update(from, to, value);
    }

    /// @dev UUPS 升级权限控制：仅 UPGRADER_ROLE
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {}

    uint256[45] private __gap;
}
