// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @notice PaymentRouter 读取 PlatformConfig 所需的最小接口
interface IPlatformConfig {
    struct ConfigItem {
        string key;
        string value;
        string valueType;
        string description;
        uint8 status;
        uint256 updatedAt;
        address updatedBy;
    }

    function getConfig(string calldata key) external view returns (ConfigItem memory);

    function getConfigUintValue(string calldata key) external view returns (uint256);
}
