import { expect } from "chai"
import { ethers } from "hardhat"

describe("Deployment", function () {
    it("Should deploy the contract", async function () {
        const [owner] = await ethers.getSigners()

        const TestGatewayContract = await ethers.getContractFactory("TestGatewayContract")

        const starknetCore = "0xde29d060D45901Fb19ED6C6e959EB22d8626708e"

        const gatewayContract = await TestGatewayContract.deploy()

        const ownerBalance = await hardhatToken.balanceOf(owner.address)
        expect(await hardhatToken.totalSupply()).to.equal(ownerBalance)
    })
})
