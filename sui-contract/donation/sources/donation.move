/*
/// Module: donation
module donation::donation;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions

module donation::donation {
    use sui::object;
    use sui::tx_context;
    use sui::event;
    use sui::table;
    use sui::coin;
    use sui::sui;
    use sui::transfer;

    /// Bağış event'i
    public struct DonationEvent has copy, drop, store {
        donor: address,
        recipient: address,
        amount: u64,
    }

    /// İsim kaydı event'i
    public struct NameRegisteredEvent has copy, drop, store {
        owner: address,
        name: vector<u8>,
    }

    /// Registry objesi: adres-isim eşleşmelerini tutar
    public struct Registry has key {
        id: object::UID,
        names: table::Table<address, vector<u8>>,
    }

    /// Registry oluşturucu (ilk deployda çağrılır)
    public fun init_registry(ctx: &mut tx_context::TxContext): Registry {
        Registry {
            id: object::new(ctx),
            names: table::new<address, vector<u8>>(ctx),
        }
    }

    /// Kullanıcı ismini kaydeder
    public fun register_name(registry: &mut Registry, name: vector<u8>, ctx: &mut tx_context::TxContext) {
        let sender = tx_context::sender(ctx);
        table::add(&mut registry.names, sender, name);
        event::emit(NameRegisteredEvent { owner: sender, name });
    }

    /// Bağış fonksiyonu
    public fun donate(
        recipient: address,
        amount: u64,
        mut coin: coin::Coin<sui::SUI>,
        ctx: &mut tx_context::TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let send_coin = coin::split(&mut coin, amount, ctx);
        transfer::public_transfer(send_coin, recipient);
        transfer::public_transfer(coin, sender);
        event::emit(DonationEvent { donor: sender, recipient, amount });
    }
}


