import { HardhatUserConfig } from "hardhat/config"
import "@shardlabs/starknet-hardhat-plugin"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-ethers"
import "dotenv/config"

const config: HardhatUserConfig = {
    solidity: "0.8.9",
    starknet: {
        venv: "cairo_venv",
        network: "alpha-goerli",
        wallets: {
            OpenZeppelin: {
                accountName: "OpenZeppelin",
                modulePath: "starkware.starknet.wallets.open_zeppelin.OpenZeppelinAccount",
                accountPath: "~/.starknet_accounts",
            },
        },
    },
    networks: {
        goerli: {
            url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
            chainId: 5,
            accounts: [process.env.DEPLOYER_PRIVATE_KEY || ""],
        },
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
}

export default config
