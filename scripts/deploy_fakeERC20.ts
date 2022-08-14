// To deploy: npx hardhat run --network goerli scripts/deploy_l1.ts
// To verify: npx hardhat verify --network goerli <address> "0xde29d060D45901Fb19ED6C6e959EB22d8626708e"

// Deployment address: 0xDC20B3816E7ca8e6978325e980B4911F8A097883

import { ethers } from "hardhat"

async function main() {
    const [deployer] = await ethers.getSigners()
    console.log("Deploying contracts with the account:", deployer.address)
    console.log("Account balance:", (await deployer.getBalance()).toString())

    const erc20FakeContract = await ethers.getContractFactory("ERC20Fake")
    const erc20Fake1 = await erc20FakeContract.deploy("USDC", "USDC")
    const erc20Fake2 = await erc20FakeContract.deploy("UNI", "UNI")
    const erc20Fake3 = await erc20FakeContract.deploy("WETH", "WETH")

    console.log("USDC address:", erc20Fake1.address)
    console.log("UNI address:", erc20Fake2.address)
    console.log("WETH address:", erc20Fake3.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
