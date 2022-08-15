// To deploy: npx hardhat run --network alpha scripts/deploy_l2.ts
// To verify: npx hardhat starknet-verify --starknet-network alpha --path contracts/starknet/StorageProver.cairo --compiler-version 0.9.1 --address 0x01842fdb2938386ee745ea5d77cea68736d46665f510fea7ed45cd8110e39937

// Deployment address: 0x01842fdb2938386ee745ea5d77cea68736d46665f510fea7ed45cd8110e39937

import { starknet } from "hardhat"

async function main() {
    const factRegistryAddressFelt = 945446405930356733034975194720402002914171111673876520981451176768939208501n
    const L1HeadersStoreAddress = 837485042664063856828332244883203579059038878551051469326645034621781373797n
    const L1GatewayAddress = 429955882159492657148005544722965770209018004439n

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
