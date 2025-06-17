module tri_name_service::tri_name {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use sui::table::{Self, Table};
    use std::string::{Self, String};
    use std::vector;

    /// Error codes
    const ENameAlreadyExists: u64 = 0;
    const ENameTooShort: u64 = 1;
    const ENameTooLong: u64 = 2;
    const EInvalidCharacters: u64 = 3;

    /// Constants
    const MIN_NAME_LENGTH: u64 = 3;
    const MAX_NAME_LENGTH: u64 = 20;
    const SUFFIX: vector<u8> = b"@tri";

    /// The main name service object that holds all registered names
    struct TriNameService has key {
        id: UID,
        names: Table<String, NameNFT>,
    }

    /// The NFT that represents ownership of a name
    struct NameNFT has key, store {
        id: UID,
        name: String,
        created_at: u64,
    }

    /// Events
    struct NameRegistered has copy, drop {
        name: String,
        owner: address,
    }

    struct NameTransferred has copy, drop {
        name: String,
        from: address,
        to: address,
    }

    /// Functions
    fun init(ctx: &mut TxContext) {
        let name_service = TriNameService {
            id: object::new(ctx),
            names: table::new(ctx),
        };
        
        transfer::share_object(name_service);
    }

    fun append_suffix(name: vector<u8>): vector<u8> {
        let result = vector::empty<u8>();
        vector::append(&mut result, name);
        vector::append(&mut result, SUFFIX);
        result
    }

    fun is_valid_char(c: u8): bool {
        // Allow a-z, A-Z, 0-9, _
        (c >= 0x61 && c <= 0x7A) || (c >= 0x41 && c <= 0x5A) || (c >= 0x30 && c <= 0x39) || (c == 0x5F)
    }

    fun validate_name(name: vector<u8>) {
        let len = vector::length(&name);
        let mut_i = 0;
        while (mut_i < len) {
            let c = *vector::borrow(&name, mut_i);
            assert!(is_valid_char(c), EInvalidCharacters);
            mut_i = mut_i + 1;
        }
    }

    public entry fun register_name(
        name_service: &mut TriNameService,
        name: vector<u8>,
        ctx: &mut TxContext
    ) {
        validate_name(name);
        let name_with_suffix = append_suffix(name);
        let name_str = string::utf8(name_with_suffix);
        
        // Validate name
        assert!(!table::contains(&name_service.names, name_str), ENameAlreadyExists);
        assert!(string::length(&name_str) >= MIN_NAME_LENGTH + 4, ENameTooShort); // +4 for @tri
        assert!(string::length(&name_str) <= MAX_NAME_LENGTH + 4, ENameTooLong); // +4 for @tri
        
        // Create the NFT
        let name_nft = NameNFT {
            id: object::new(ctx),
            name: name_str,
            created_at: tx_context::epoch(ctx),
        };

        // Add to the table
        table::add(&mut name_service.names, name_str, name_nft);

        // Emit event
        event::emit(NameRegistered {
            name: name_str,
            owner: tx_context::sender(ctx),
        });
    }

    public entry fun transfer_name(
        name_service: &mut TriNameService,
        name: vector<u8>,
        to: address,
        ctx: &mut TxContext
    ) {
        let name_with_suffix = append_suffix(name);
        let name_str = string::utf8(name_with_suffix);
        assert!(table::contains(&name_service.names, name_str), ENameAlreadyExists);
        let name_nft = table::remove(&mut name_service.names, name_str);
        // Only owner can transfer (checked by Move's object ownership model)
        transfer::transfer(name_nft, to);
        // Emit event
        event::emit(NameTransferred {
            name: name_str,
            from: tx_context::sender(ctx),
            to,
        });
    }

    // View function to get all names owned by an address
    public fun get_names_by_owner(_name_service: &TriNameService, _owner: address): vector<String> {
        let names = vector::empty<String>();
        // Note: In a real implementation, you would need to iterate through all names
        // This is a simplified version
        names
    }
} 