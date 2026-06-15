import "dotenv/config";
import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { configVariable, defineConfig } from "hardhat/config";

const sharedPrivateKey = configVariable("CONTRACT_PRIVATE_KEY");
const arcTestnetRpcUrl = process.env.ARC_TESTNET_RPC_URL ?? "https://rpc.testnet.arc.network";

export default defineConfig({
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          viaIR: true,
        },
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          viaIR: true,
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      chainId: 11155111,
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [sharedPrivateKey],
    },
    /** Linea Sepolia：与 Infura `linea-sepolia` 等 RPC 对齐，勿与以太坊 Sepolia 混用 */
    lineaSepolia: {
      type: "http",
      chainType: "generic",
      chainId: 59141,
      url: configVariable("LINEA_SEPOLIA_RPC_URL"),
      accounts: [sharedPrivateKey],
    },
    /** Arc Testnet — Phase 1 订单支付联调链 */
    arcTestnet: {
      type: "http",
      chainType: "generic",
      chainId: 5042002,
      url: configVariable("ARC_TESTNET_RPC_URL"),
      accounts: [sharedPrivateKey],
    },
  },
});
