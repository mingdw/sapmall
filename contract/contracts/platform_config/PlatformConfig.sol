// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/// @title PlatformConfig
/// @notice 全局配置中心（可升级）：支持后台管理系统执行增删改查
/// @dev 使用 struct + mapping 存储；数值型配置存于 value（十进制字符串），链上读 uint 走 getConfigUintValue
contract PlatformConfig is Initializable, UUPSUpgradeable, AccessControlUpgradeable, PausableUpgradeable {
    bytes32 public constant CONFIG_ADMIN_ROLE = keccak256("CONFIG_ADMIN_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    uint8 private constant STATUS_ENABLED = 0;
    uint8 private constant STATUS_DISABLED = 1;

    // SAPToken 依赖的桶配置键（与 SAPToken.sol 中常量保持一致）
    string private constant CFG_BUCKET_COMMUNITY_CAP = "sap.token.bucket.community.cap";
    string private constant CFG_BUCKET_ECOSYSTEM_CAP = "sap.token.bucket.ecosystem.cap";
    string private constant CFG_BUCKET_TEAM_CAP = "sap.token.bucket.team.cap";
    string private constant CFG_BUCKET_INVESTORS_CAP = "sap.token.bucket.investors.cap";
    string private constant CFG_BUCKET_TREASURY_CAP = "sap.token.bucket.treasury.cap";

    struct ConfigItem {
        string key;
        string value;
        string valueType; // string/number/bool/json/address 等
        string description;
        uint8 status; // 0启用 1禁用
        uint256 updatedAt;
        address updatedBy;
    }

    // keyHash => config
    mapping(bytes32 => ConfigItem) private _configs;
    // keyHash => key 索引，用于 O(1) 删除
    mapping(bytes32 => uint256) private _keyIndex;
    // 全量 key 列表，用于分页查询
    string[] private _allKeys;

    event ConfigCreated(string indexed key, string value, string valueType, uint8 status);
    event ConfigUpdated(string indexed key, string oldValue, string newValue, uint8 status);
    event ConfigDeleted(string indexed key);
    event ConfigStatusChanged(string indexed key, uint8 oldStatus, uint8 newStatus);
    event ConfigUintValueUpdated(string indexed key, uint256 oldValue, uint256 newValue);

    error ZeroAddress();
    error EmptyKey();
    error ConfigAlreadyExists(string key);
    error ConfigNotFound(string key);
    error InvalidStatus(uint8 status);
    error InvalidRange(uint256 offset, uint256 limit);
    error ValueTypeNotNumber();
    error InvalidNumberValue(string value);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address admin) external initializer {
        if (admin == address(0)) revert ZeroAddress();

        __AccessControl_init();
        __Pausable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(CONFIG_ADMIN_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);

        // 预置 SAPToken 默认桶配置，便于 SAPToken 初始化后直接读取并重载
        _createDefaultNumberConfig(
            CFG_BUCKET_COMMUNITY_CAP,
            "500000000000000000000000000", // 500,000,000 * 1e18
            unicode"SAP 社区激励桶上限（50%）"
        );
        _createDefaultNumberConfig(
            CFG_BUCKET_ECOSYSTEM_CAP,
            "200000000000000000000000000", // 200,000,000 * 1e18
            unicode"SAP 生态基金桶上限（20%）"
        );
        _createDefaultNumberConfig(
            CFG_BUCKET_TEAM_CAP,
            "150000000000000000000000000", // 150,000,000 * 1e18
            unicode"SAP 团队桶上限（15%）"
        );
        _createDefaultNumberConfig(
            CFG_BUCKET_INVESTORS_CAP,
            "150000000000000000000000000", // 150,000,000 * 1e18
            unicode"SAP 投资者桶上限（15%）"
        );
        _createDefaultNumberConfig(CFG_BUCKET_TREASURY_CAP, "0", unicode"SAP 金库桶上限（当前默认0）");
    }

    /// @notice 新增配置项（key 不可重复）
    function createConfig(
        string calldata key,
        string calldata value,
        string calldata valueType,
        string calldata description,
        uint8 status
    ) external onlyRole(CONFIG_ADMIN_ROLE) whenNotPaused {
        _validateKeyAndStatus(key, status);
        bytes32 keyHash = _hashKey(key);
        if (_configExists(keyHash)) revert ConfigAlreadyExists(key);

        _allKeys.push(key);
        _keyIndex[keyHash] = _allKeys.length - 1;

        _configs[keyHash] = ConfigItem({
            key: key,
            value: value,
            valueType: valueType,
            description: description,
            status: status,
            updatedAt: block.timestamp,
            updatedBy: _msgSender()
        });

        emit ConfigCreated(key, value, valueType, status);
    }

    /// @notice 更新配置项（value、类型、描述、状态）
    function updateConfig(
        string calldata key,
        string calldata value,
        string calldata valueType,
        string calldata description,
        uint8 status
    ) external onlyRole(CONFIG_ADMIN_ROLE) whenNotPaused {
        _validateKeyAndStatus(key, status);
        bytes32 keyHash = _hashKey(key);
        ConfigItem storage item = _configs[keyHash];
        if (!_configExists(keyHash)) revert ConfigNotFound(key);

        string memory oldValue = item.value;
        item.value = value;
        item.valueType = valueType;
        item.description = description;
        item.status = status;
        item.updatedAt = block.timestamp;
        item.updatedBy = _msgSender();

        emit ConfigUpdated(key, oldValue, value, status);
    }

    /// @notice 删除配置项
    function deleteConfig(string calldata key) external onlyRole(CONFIG_ADMIN_ROLE) whenNotPaused {
        _validateKey(key);
        bytes32 keyHash = _hashKey(key);
        if (!_configExists(keyHash)) revert ConfigNotFound(key);

        uint256 index = _keyIndex[keyHash];
        uint256 lastIndex = _allKeys.length - 1;

        if (index != lastIndex) {
            string memory lastKey = _allKeys[lastIndex];
            _allKeys[index] = lastKey;
            _keyIndex[_hashKey(lastKey)] = index;
        }

        _allKeys.pop();
        delete _keyIndex[keyHash];
        delete _configs[keyHash];

        emit ConfigDeleted(key);
    }

    /// @notice 更新配置启用状态
    function setConfigStatus(string calldata key, uint8 newStatus) external onlyRole(CONFIG_ADMIN_ROLE) whenNotPaused {
        _validateKeyAndStatus(key, newStatus);
        bytes32 keyHash = _hashKey(key);
        ConfigItem storage item = _configs[keyHash];
        if (!_configExists(keyHash)) revert ConfigNotFound(key);

        uint8 oldStatus = item.status;
        item.status = newStatus;
        item.updatedAt = block.timestamp;
        item.updatedBy = _msgSender();
        emit ConfigStatusChanged(key, oldStatus, newStatus);
    }

    /// @notice 将数值写入 value（十进制字符串），需 valueType 为 number；供链上其它合约经 getConfigUintValue 读取
    function setConfigUintValue(string calldata key, uint256 newUintValue) external onlyRole(CONFIG_ADMIN_ROLE) whenNotPaused {
        _validateKey(key);
        bytes32 keyHash = _hashKey(key);
        ConfigItem storage item = _configs[keyHash];
        if (!_configExists(keyHash)) revert ConfigNotFound(key);
        if (!_isNumberType(item.valueType)) revert ValueTypeNotNumber();

        uint256 oldValue = _parseUintString(item.value);
        string memory newStr = Strings.toString(newUintValue);
        item.value = newStr;
        item.updatedAt = block.timestamp;
        item.updatedBy = _msgSender();
        emit ConfigUintValueUpdated(key, oldValue, newUintValue);
    }

    /// @notice 查询单条配置（后台按 key 读取）
    function getConfig(string calldata key) external view returns (ConfigItem memory) {
        _validateKey(key);
        bytes32 keyHash = _hashKey(key);
        if (!_configExists(keyHash)) revert ConfigNotFound(key);
        return _configs[keyHash];
    }

    /// @notice 解析 value（十进制无小数）为 uint256；要求 valueType 为 number
    function getConfigUintValue(string calldata key) external view returns (uint256) {
        _validateKey(key);
        bytes32 keyHash = _hashKey(key);
        ConfigItem memory item = _configs[keyHash];
        if (!_configExists(keyHash)) revert ConfigNotFound(key);
        if (!_isNumberType(item.valueType)) revert ValueTypeNotNumber();
        return _parseUintString(item.value);
    }

    /// @notice 查询 key 是否存在
    function exists(string calldata key) external view returns (bool) {
        if (bytes(key).length == 0) return false;
        return _configExists(_hashKey(key));
    }

    /// @notice 分页查询配置列表
    function listConfigs(uint256 offset, uint256 limit) external view returns (ConfigItem[] memory items, uint256 total) {
        total = _allKeys.length;
        if (limit == 0) revert InvalidRange(offset, limit);
        if (offset > total) revert InvalidRange(offset, limit);

        uint256 end = offset + limit;
        if (end > total) end = total;
        uint256 size = end - offset;

        items = new ConfigItem[](size);
        for (uint256 i = 0; i < size; i++) {
            string memory k = _allKeys[offset + i];
            items[i] = _configs[_hashKey(k)];
        }
        return (items, total);
    }

    /// @notice 查询全部 key（轻量索引接口）
    function getAllKeys() external view returns (string[] memory) {
        return _allKeys;
    }

    function totalConfigs() external view returns (uint256) {
        return _allKeys.length;
    }

    function pause() external onlyRole(CONFIG_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(CONFIG_ADMIN_ROLE) {
        _unpause();
    }

    function _configExists(bytes32 keyHash) internal view returns (bool) {
        return bytes(_configs[keyHash].key).length != 0;
    }

    function _validateKeyAndStatus(string calldata key, uint8 status) internal pure {
        _validateKey(key);
        if (status != STATUS_ENABLED && status != STATUS_DISABLED) revert InvalidStatus(status);
    }

    function _validateKey(string calldata key) internal pure {
        if (bytes(key).length == 0) revert EmptyKey();
    }

    function _hashKey(string memory key) internal pure returns (bytes32) {
        return keccak256(bytes(key));
    }

    function _isNumberType(string memory valueType) internal pure returns (bool) {
        return keccak256(bytes(valueType)) == keccak256("number");
    }

    /// @dev 仅允许十进制数字字符，否则 revert（与链下 big.Int 十进制一致）
    function _parseUintString(string memory s) internal pure returns (uint256) {
        bytes memory b = bytes(s);
        if (b.length == 0) revert InvalidNumberValue(s);
        uint256 result = 0;
        for (uint256 i = 0; i < b.length; i++) {
            uint8 c = uint8(b[i]);
            if (c < 48 || c > 57) revert InvalidNumberValue(s);
            result = result * 10 + (c - 48);
        }
        return result;
    }

    /// @dev 初始化默认数值配置（仅 initialize 流程内部使用）
    function _createDefaultNumberConfig(string memory key, string memory value, string memory description) internal {
        bytes32 keyHash = _hashKey(key);
        _allKeys.push(key);
        _keyIndex[keyHash] = _allKeys.length - 1;

        _configs[keyHash] = ConfigItem({
            key: key,
            value: value,
            valueType: "number",
            description: description,
            status: STATUS_ENABLED,
            updatedAt: block.timestamp,
            updatedBy: _msgSender()
        });

        emit ConfigCreated(key, value, "number", STATUS_ENABLED);
        uint256 v = _parseUintString(value);
        emit ConfigUintValueUpdated(key, 0, v);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {}

    uint256[50] private __gap;
}
