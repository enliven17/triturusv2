module tri_name_service::tri_name {
    use sui::object::{Self, UID};
    use sui::dynamic_field;
    use sui::event;
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use std::string::{Self, String};

    /// The NFT that represents a @tri name. It is owned by the user.
    struct TriName has key, store {
        id: UID,
        /// The name itself, e.g., "satoshi".
        name: String,
    }

    /// Event for when a new name is registered.
    struct NameRegistered has copy, drop {
        owner: address,
        name: String,
    }
    
    /// The shared registry object. We will add names as dynamic fields to it
    /// to enforce uniqueness.
    struct Registry has key {
        id: UID,
    }

    /// This function is called once when the module is published.
    fun init(ctx: &mut TxContext) {
        // Create the registry and share it so anyone can interact with it.
        transfer::share_object(Registry {
            id: object::new(ctx),
        });
    }

    /// Public entry function to register a new name.
    public entry fun register_name(
        registry: &mut Registry,
        name: vector<u8>, // The name to register, as bytes.
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);

        // Create the TriName NFT.
        let tri_name_nft = TriName {
            id: object::new(ctx),
            name: string::utf8(name) // Store the readable string in the NFT.
        };
        
        // Add a dynamic field to the registry. The field's name is the
        // @tri name (as bytes), which enforces uniqueness. The value stored
        // is the address of the owner.
        // This transaction will fail if a dynamic field with the same `name`
        // already exists, thus preventing duplicate registrations.
        dynamic_field::add(&mut registry.id, name, sender);

        // Emit an event to notify off-chain indexers.
        event::emit(NameRegistered {
            owner: sender,
            name: tri_name_nft.name
        });

        // Transfer the NFT to the sender, making them the owner.
        transfer::transfer(tri_name_nft, sender);
    }
} 