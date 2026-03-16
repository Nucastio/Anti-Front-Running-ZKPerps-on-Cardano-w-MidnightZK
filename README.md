# Anti-Front-Running ZK Perpetuals on Cardano using Midnight

A privacy-preserving perpetual derivatives trading protocol built using Cardano and the Midnight network. 

## Overview

This system introduces private order flow and verifiable settlement using zero-knowledge proofs. By keeping order parameters confidential until execution, the protocol mathematically prevents front-running and MEV (Maximal Extractable Value) exploitation in decentralized derivatives markets.

## Modules

The architecture is divided into five core modules:

* **`zk-circuits/`**: Cryptographic proofs written in Midnight Compact (`.compact`) to validate orders, matches, and settlements without revealing private data.
* **`matching/`**: A confidential price-time priority matching engine for shielded orders.
* **`settlement/`**: On-chain execution engine managing margin, positions, and liquidations via Cardano.
* **`privacy/`**: Data protection layer handling Midnight network integration, order encryption, and selective disclosure for compliance.
* **`common/`**: Shared protocol definitions, cryptographic utilities, and system configurations.

Each module contains its own `API.md` file detailing its specific interfaces and responsibilities.

## License

MIT License