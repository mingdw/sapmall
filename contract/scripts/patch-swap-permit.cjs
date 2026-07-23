const fs = require('fs');

const routerPath = 'd:/sapmallworkspace/sapmall/contract/contracts/swap/SAPSwapRouter.sol';
let router = fs.readFileSync(routerPath, 'utf8');
if (!router.includes('IERC20Permit')) {
  router = router.replace(
    'import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";',
    'import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";\nimport {IERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";'
  );
}
if (!router.includes('function swapWithPermit(')) {
  const insert = `
    /// @notice 带 EIP-2612 Permit 的兑换（减少单独 approve 签名）
    /// @dev 若 tokenIn 不支持 permit，调用将 revert，前端应回退到 approve+swap
    function swapWithPermit(
        address tokenIn,
        uint256 amountIn,
        uint256 minAmountOut,
        SwapDirection direction,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external whenNotPaused nonReentrant returns (uint256 amountOut) {
        if (amountIn == 0) revert ZeroAmount();
        if (amountIn < MIN_SWAP_AMOUNT) revert AmountBelowMinimum();
        if (direction != SwapDirection.STABLE_TO_SAP) {
            revert("SAP_TO_STABLE not supported yet");
        }

        IERC20Permit(tokenIn).permit(msg.sender, address(this), amountIn, deadline, v, r, s);
        amountOut = _swapStableToSAP(tokenIn, amountIn, minAmountOut);

        emit SwapExecuted(
            msg.sender,
            direction,
            tokenIn,
            amountIn,
            amountOut,
            _calculateFee(amountIn),
            block.timestamp
        );
    }

`;
  const marker = '    function swap(';
  const idx = router.indexOf(marker);
  if (idx < 0) throw new Error('swap not found');
  router = router.slice(0, idx) + insert + router.slice(idx);
}
fs.writeFileSync(routerPath, router, 'utf8');
console.log('SAPSwapRouter.sol ok');

const ifacePath = 'd:/sapmallworkspace/sapmall/contract/contracts/swap/ISAPSwapRouter.sol';
let iface = fs.readFileSync(ifacePath, 'utf8');
if (!iface.includes('function swapWithPermit(')) {
  iface = iface.replace(
    `function swap(
        address tokenIn,
        uint256 amountIn,
        uint256 minAmountOut,
        SwapDirection direction
    ) external returns (uint256 amountOut);`,
    `function swap(
        address tokenIn,
        uint256 amountIn,
        uint256 minAmountOut,
        SwapDirection direction
    ) external returns (uint256 amountOut);

    /// @notice 带 EIP-2612 Permit 的兑换
    function swapWithPermit(
        address tokenIn,
        uint256 amountIn,
        uint256 minAmountOut,
        SwapDirection direction,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (uint256 amountOut);`
  );
  fs.writeFileSync(ifacePath, iface, 'utf8');
}
console.log('ISAPSwapRouter.sol ok');
