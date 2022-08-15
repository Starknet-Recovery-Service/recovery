// To deploy: npx hardhat run --network goerli scripts/deploy_l1.ts
// To verify: npx hardhat verify --network goerli 0x4b4fE3787407A999f41703e340F8D33B143443d7 "0xde29d060D45901Fb19ED6C6e959EB22d8626708e"

// Deployment address: 0x4b4fE3787407A999f41703e340F8D33B143443d7

import { ethers } from "hardhat"

async function main() {
    const [deployer] = await ethers.getSigners()
    console.log("Deploying contracts with the account:", deployer.address)
    console.log("Account balance:", (await deployer.getBalance()).toString())

    const starknetCoreContractAddress = "0xde29d060D45901Fb19ED6C6e959EB22d8626708e"
    const gatewayContract = await ethers.getContractFactory("GatewayContract")
    const gateway = await gatewayContract.deploy(starknetCoreContractAddress)

    console.log("GatewayContract address:", gateway.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
