// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/// @title SAP — Sapphire Mall Token
/// @notice 固定总量 1 亿枚，18 decimals；支持 EIP-2612 Permit 与投票权快照（OpenZeppelin Governor 生态）。
/// @dev 全部代币在部署时一次性铸造给 `initialHolder`（通常为金库/多签），合约内不再增发。
contract SAPToken is ERC20, ERC20Permit, ERC20Votes {
    /// @dev 与代币经济文档一致：100,000,000 SAP，18 位小数。
    uint256 public constant MAX_SUPPLY = 100_000_000 ether;

    error SAPTokenZeroAddress();

    constructor(address initialHolder)
        ERC20("Sapphire Mall Token", "SAP")
        ERC20Permit("Sapphire Mall Token")
    {
        if (initialHolder == address(0)) revert SAPTokenZeroAddress();
        _mint(initialHolder, MAX_SUPPLY);
    }

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }
}
