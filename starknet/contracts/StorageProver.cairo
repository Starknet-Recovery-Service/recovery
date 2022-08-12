%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin, BitwiseBuiltin
from contracts.starknet.lib.general_address import Address
from starkware.cairo.common.math import assert_lt_felt
from starkware.starknet.common.messages import send_message_to_l1

## INTERFACES

# Fossil FactsRegistry contract
@contract_interface
namespace IFactsRegistry:
    func get_verified_account_nonce(account_160 : felt, block : felt) -> (res : felt):
    end
end

# Fossil L1HeadersStore contract
@contract_interface
namespace IL1HeadersStore:
    func get_latest_l1_block() -> (number : felt):
    end
end


## STATE

# Deployed address of FactsRegistry contract on StarkNet - immutable value set on contract deployment
@storage_var
func fact_registry_address() -> (res : felt):
end

# Deployed address of StarkNet contract on L1HeadersStore - immutable value set on contract deployment
@storage_var
func L1_headers_store_address() -> (res : felt):
end

# Deployed address of L1 gateway contract - immutable value set on contract deployment
@storage_var
func L1_gateway_address() -> (res : felt):
end


## FUNCTIONS

@constructor
func constructor{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    _fact_registry_address : felt, 
    _L1_headers_store_address : felt
):
    fact_registry_address.write(_fact_registry_address)
    L1_headers_store_address.write(_L1_headers_store_address)
    return ()
end


# Checks if account balance is unchanged, and if so, notifies L1 recovery contract
@external
func prove_balance_unchanged{
    syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr
}(user_address : felt) -> (bool : felt):
    const BLOCK_HISTORY = 40  # Number of blocks to look back - currently hard-coded but can be updated to be user input

    let (block_end) = get_latest_eth_block()
    let block_start = block_end - 40
    let (nonce_start) = get_nonce(address=user_address, block=block_start)
    let (nonce_end) = get_nonce(address=user_address, block=block_end)

    let (equals) = compare(a=nonce_start, b=nonce_end)

    let (L1_gateway_address) = L1_gateway_address.read()

    if equals == 1:
        notify_L1_recovery_contract(L1_gateway_address)
        return (1)
    end

    return (0)
end


# Retrieves latest L1 block. 
func get_latest_eth_block{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (number: felt):
    let (L1_headers_store_address) = L1_headers_store_address.read()
    let (number) = IL1HeadersStore.get_latest_l1_block(l1_headers_store_address)
    return (number)
end


# Retrieves nonce of L1 account at a particular block.
func get_nonce{
    syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr, bitwise_ptr : BitwiseBuiltin*
}(address : felt, block : felt) -> (nonce : felt):
    alloc_locals

    assert_lt_felt(address, 2 ** 160)
    let (fact_registry_address) = fact_registry_address.read()

    let (nonce) = IFactsRegistry.get_verified_account_nonce(fact_registry_address, address, block)

    return (nonce)
end


# Compares two nonces for equality
func compare(a : felt, b : felt) -> (bool : felt):
    if a == b:
        return (1)
    else:
        return (0)
end


# Notify Ethereum recovery contract
func notify_L1_recovery_contract{
    syscall_ptr : felt*,
    pedersen_ptr : HashBuiltin*,
    range_check_ptr,
}(address: felt, l1_recovery_address: felt):
    const MESSAGE_APPROVE = 1

    let (message_payload : felt*) = alloc()
    assert message_payload[0] = MESSAGE_APPROVE
    assert message_payload[1] = address

    send_message_to_l1(
        to_address=l1_recovery_address,
        payload_size=2,
        payload=message_payload,
    )

    return ()
end
