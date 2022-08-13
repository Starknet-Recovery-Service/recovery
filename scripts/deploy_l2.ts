// To deploy: npx hardhat run --network alpha-goerli scripts/deploy_l2.ts
// To verify: npx hardhat starknet-verify --starknet-network alpha-goerli --path contracts/starknet/StorageProver.cairo --compiler-version 0.9.1 --address 0x012a9048fc3ad5814f25599165974a538a5a27c43f68e45a122baae83610ec26

// Deployment address: 0x012a9048fc3ad5814f25599165974a538a5a27c43f68e45a122baae83610ec26

import { starknet } from "hardhat"

async function main() {
    const factRegistryAddressFelt = 1020069748073116514563902554166007537926868582181n
    const L1HeadersStoreAddress = 1020069748073116514563902554166007537926868582181n
    const L1GatewayAddress = 1020069748073116514563902554166007537926868582181n

    const storageProverFactory = await starknet.getContractFactory("StorageProver")
    const storageProver = await storageProverFactory.deploy({
        _fact_registry_address: factRegistryAddressFelt,
        _L1_headers_store_address: L1HeadersStoreAddress,
        _L1_gateway_address: L1GatewayAddress,
    })

    console.log("StorageProver address:", storageProver.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
