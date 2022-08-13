import { HardhatUserConfig } from "hardhat/config"
// import "@nomicfoundation/hardhat-toolbox"
import "@shardlabs/starknet-hardhat-plugin"
import "@nomiclabs/hardhat-ethers"
import "dotenv/config"

const config: HardhatUserConfig = {
    solidity: "0.8.9",
    // starknet: {
    //     venv: "cairo_venv",
    //     network: "integrated-devnet",
    //     wallets: {
    //         OpenZeppelin: {
    //             accountName: "OpenZeppelin",
    //             modulePath: "starkware.starknet.wallets.open_zeppelin.OpenZeppelinAccount",
    //             accountPath: "~/.starknet_accounts",
    //         },
    //     },
    // },
    networks: {
        goerli: {
            url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
            chainId: 5,
            accounts: [process.env.DEPLOYER_PRIVATE_KEY || ""],
        },
        // integratedDevnet: {
        //     url: "http://127.0.0.1:5050",

        //     // venv: "active" <- for the active virtual environment with installed starknet-devnet
        //     // venv: "path/to/venv" <- for env with installed starknet-devnet (created with e.g. `python -m venv path/to/venv`)
        //     venv: "cairo_venv",

        //     // optional devnet CLI arguments
        //     args: ["--lite-mode", "--gas-price", "2000000000"],
        // },
    },
}

export default config
