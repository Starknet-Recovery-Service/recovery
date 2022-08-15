// To deploy: npx hardhat run --network goerli scripts/deploy_l1.ts
// To verify: npx hardhat verify --network goerli 0xC6362C14E0F09DD077Be0683B24cb225845f35CA "0xde29d060D45901Fb19ED6C6e959EB22d8626708e"

// Deployment address: 0xC6362C14E0F09DD077Be0683B24cb225845f35CA

import { ethers } from "hardhat"

async function main() {
    const [deployer] = await ethers.getSigners()
    console.log("Deploying contracts with the account:", deployer.address)
    console.log("Account balance:", (await deployer.getBalance()).toString())

    const starknetCoreContractAddress = "0xde29d060D45901Fb19ED6C6e959EB22d8626708e"
    const gatewayContract = await ethers.getContractFactory("GatewayContract")
    const gateway = await gatewayContract.deploy(starknetCoreContractAddress)

    console.log("TestGatewayContract address:", gateway.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
