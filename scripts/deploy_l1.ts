// To deploy: npx hardhat run scripts/deploy_l1.ts --network goerli
import { ethers } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import fs from "fs"

async function main() {
    const [deployer] = await ethers.getSigners()
    console.log("Deploying contracts with the account:", deployer.address)
    console.log("Account balance:", (await deployer.getBalance()).toString())

    const provider = ethers.getDefaultProvider()
    const abi = JSON.parse(
        fs
            .readFileSync("./artifacts/contracts/ethereum/TestContracts/TestGatewayContract.sol/IStarknetCore.json")
            .toString("ascii")
    ).abi
    const starknetCoreContractAddress = "0xde29d060D45901Fb19ED6C6e959EB22d8626708e"
    const starknetCoreContract = new ethers.Contract(starknetCoreContractAddress, abi, provider)

    const gatewayContract = await ethers.getContractFactory("TestGatewayContract")
    const gateway = await gatewayContract.deploy(starknetCoreContract)

    console.log("TestGatewayContract address:", gateway.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
