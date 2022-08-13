// To deploy: npx hardhat run --network goerli scripts/deploy_l1.ts
// To verify: npx hardhat verify --network goerli <address> "0xde29d060D45901Fb19ED6C6e959EB22d8626708e"

// Deployment address: 0xDC20B3816E7ca8e6978325e980B4911F8A097883

import { ethers } from "hardhat"

async function main() {
    const [deployer] = await ethers.getSigners()
    console.log("Deploying contracts with the account:", deployer.address)
    console.log("Account balance:", (await deployer.getBalance()).toString())

    const starknetCoreContractAddress = "0xde29d060D45901Fb19ED6C6e959EB22d8626708e"
    const gatewayContract = await ethers.getContractFactory("TestGatewayContract")
    const gateway = await gatewayContract.deploy(starknetCoreContractAddress)

    console.log("TestGatewayContract address:", gateway.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
