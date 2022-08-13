// To deploy: npx hardhat run --network alpha-goerli scripts/deploy_l2.ts
// To verify: npx hardhat starknet-verify --starknet-network alpha-goerli --path contracts/starknet/StorageProver.cairo --compiler-version 0.9.1 --address 0x0358fa86a803e16901367550765ecbfee5c7e8c3e5efd6043e42aab947ddccba

// Deployment address: 0x0358fa86a803e16901367550765ecbfee5c7e8c3e5efd6043e42aab947ddccba

import { starknet } from "hardhat"

async function main() {
    const factRegistryAddressFelt = 945446405930356733034975194720402002914171111673876520981451176768939208501n
    const L1HeadersStoreAddress = 837485042664063856828332244883203579059038878551051469326645034621781373797n
    const L1GatewayAddress = 1256707230570067143218012969760719261706450729091n

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
