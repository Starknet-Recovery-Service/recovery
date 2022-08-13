// SPDX-License-Identifier: MIT.

pragma solidity ^0.8.9;

interface IStarknetCore {
    // Consumes a message that was sent from an L2 contract. Returns the hash of the message
    function consumeMessageFromL2(
        uint256 fromAddress,
        uint256[] calldata payload
    ) external returns (bytes32);
}

contract RecoveryContract {
    // The StarkNet core contract
    IStarknetCore starknetCore;

    // Address of StorageProver contract deployed on L2
    uint256 L2StorageProverAddress;

    mapping(uint256 => bool) public withdrawAllowances;

    uint256 constant MESSAGE_APPROVE = 1;

    constructor(IStarknetCore _starknetCore, uint256 _L2StorageProverAddress) {
        starknetCore = _starknetCore;
        L2StorageProverAddress = _L2StorageProverAddress;
    }

    function receiveFromStorageProver(uint256 userAddress) external {
        // Construct the withdrawal message's payload.
        uint256[] memory payload = new uint256[](2);
        payload[0] = MESSAGE_APPROVE;
        payload[1] = userAddress;

        starknetCore.consumeMessageFromL2(L2StorageProverAddress, payload);

        withdrawAllowances[userAddress] = true;
    }
}
