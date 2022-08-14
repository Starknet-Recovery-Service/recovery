// SPDX-License-Identifier: MIT.

pragma solidity ^0.8.9;

import "./IERC20.sol";

interface IStarknetCore {
    // Consumes a message that was sent from an L2 contract. Returns the hash of the message
    function consumeMessageFromL2(
        uint256 fromAddress,
        uint256[] calldata payload
    ) external returns (bytes32);
}

contract RecoveryContract {
    address public recipient;
    address public gatewayContract;
    uint256 public minBlocks;
    bool public isActive;

    constructor(address _recipient, uint256 _minBlocks, address _gatewayContract) {
        recipient = _recipient;
        minBlocks = _minBlocks;
        gatewayContract = _gatewayContract;
        isActive = false;
    }

    function claimAssets(address[] calldata erc20contracts, address to) external {
        require(msg.sender == recipient, "Only recipient");
        require(isActive == true, "Not active");
        for (uint256 i = 0 ; i < erc20contracts.length; i++) {
            uint256 balance = IERC20(erc20contracts[i]).balanceOf(address(this));
            IERC20(erc20contracts[i]).transfer(to, balance);
        }
    }

    function activateRecovery(uint256 blocks) external {
        require(msg.sender == gatewayContract, "Not gateway");
        require(!isActive, "Already active");
        require(blocks >= minBlocks, "Inactivity too short");
        isActive = true;
        emit ActiveRecovery(address(this), recipient, block.timestamp);
    }

    event ActiveRecovery(address contractAddress, address recipient, uint256 activationTime);
}

contract GatewayContract {
    // The StarkNet core contract
    IStarknetCore starknetCore;
    mapping(address => address) public eoaToRecoveryContract;
    uint256 constant MESSAGE_APPROVE = 1;

    constructor(IStarknetCore _starknetCore) {
        starknetCore = _starknetCore;
    }

    function receiveFromStorageProver(
        uint256 userAddress,
        uint256 blocks,
        uint256 L2StorageProverAddress
    ) external {
        // Construct the withdrawal message's payload.
        uint256[] memory payload = new uint256[](2);
        payload[0] = MESSAGE_APPROVE;
        payload[1] = userAddress;
        payload[2] = blocks;

        // L2StorageProverAddress is passed in as an input but we should eventually hardcode it into the contract
        starknetCore.consumeMessageFromL2(L2StorageProverAddress, payload);

        address _recoveryContractAddress = eoaToRecoveryContract[address(uint160(uint256(userAddress)))];
        RecoveryContract(_recoveryContractAddress).activateRecovery(blocks);
    }

    function deployRecoveryContract(address recipient, uint256 minBlocks) external {
        require(eoaToRecoveryContract[msg.sender] == address(0x0), "Recovery contract exists");
        address _recoveryContractAddress = address(new RecoveryContract(recipient, minBlocks, address(this)));
        eoaToRecoveryContract[msg.sender] = _recoveryContractAddress;
        emit NewRecoveryContract(msg.sender, _recoveryContractAddress, block.timestamp, minBlocks);
    }

    event NewRecoveryContract(address EOA, address recoveryContract, uint256 creationDate, uint256 minBlocks);
}
