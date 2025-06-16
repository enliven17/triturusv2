module {{address}}::donation {
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;
    use sui::transfer;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;

    struct DonationEvent has copy, drop, store {
        donor: address,
        recipient: address,
        amount: u64,
        timestamp: u64,
    }

    public fun donate(
        recipient: address,
        coin: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let amount = coin::value(&coin);
        transfer::transfer(coin, recipient);
        let event = DonationEvent {
            donor: tx_context::sender(ctx),
            recipient,
            amount,
            timestamp: tx_context::timestamp_ms(ctx),
        };
        event::emit(event);
    }
} 