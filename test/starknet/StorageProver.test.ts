import { expect } from "chai"
import { starknet } from "hardhat"

describe("Deployment", function () {
    it("Should load the deployed contract", async function () {
        const contractFactory = await starknet.getContractFactory("StorageProver")
        const contract = contractFactory.getContractAt("0x123...")
    })
})
