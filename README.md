# Anti-Front-Running ZK Perpetuals on Cardano with Midnight ZK

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Release: v0.1.0](https://img.shields.io/badge/Release-v0.1.0-blue.svg)](https://github.com/Nucastio/Anti-Front-Running-ZKPerps-on-Cardano-w-MidnightZK/releases/tag/v0.1.0)
[![Status: Stub Implementation](https://img.shields.io/badge/Status-Stub%20Implementation-orange.svg)]()

> **⚠️ THIS REPOSITORY CONTAINS STUB CODE** — All module files provide interface definitions, type signatures, and placeholder logic only. Full implementations will follow in subsequent milestones.

---

## Problem Statement

Front-running is a critical issue in decentralized perpetual futures markets. Malicious actors (including validators and MEV bots) can observe pending orders in the mempool and place their own orders ahead, profiting at the expense of honest traders. This results in:

- **Worse execution prices** for retail traders
- **Erosion of trust** in decentralized exchanges
- **Unfair value extraction** by privileged participants

Traditional solutions such as commit-reveal schemes add latency and complexity. A more robust approach uses **Zero-Knowledge Proofs (ZKPs)** to keep order details private until execution, making front-running mathematically impossible.

---

## Solution Overview

This project implements a **privacy-preserving perpetual futures protocol on Cardano** using **Midnight's ZK capabilities**. The system ensures:

1. **Order Privacy** — Orders are committed as ZK proofs, hiding price, size, and direction from all observers.
2. **Anti-Front-Running** — Cryptographic timelock proofs guarantee that orders were committed before a reference timestamp, preventing reordering attacks.
3. **Verifiable Matching** — The matching engine operates on committed orders, producing ZK proofs that matching was performed correctly.
4. **On-Chain Settlement** — Matched trades settle on Cardano with full verifiability and margin management.
5. **Selective Disclosure** — Traders can selectively reveal trade details for regulatory compliance without compromising overall privacy.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Trader / Client                       │
│  (Creates orders, generates ZK commitments, submits proofs)  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Privacy Layer (Midnight)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │  Shielded     │  │  Encrypted   │  │    Selective      │  │
│  │  Pool         │  │  State       │  │    Disclosure     │  │
│  └──────────────┘  └──────────────┘  └───────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    ZK Circuits Module                         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │  Order        │  │  Price Range │  │  Anti-Front-      │  │
│  │  Commitment   │  │  Proof       │  │  Running Proof    │  │
│  └──────────────┘  └──────────────┘  └───────────────────┘  │
│  ┌──────────────┐                                            │
│  │  Margin       │                                           │
│  │  Proof        │                                           │
│  └──────────────┘                                            │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Matching Engine                             │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │  Order Book   │  │  Order       │  │  Matching         │  │
│  │  (Private)    │  │  Matcher     │  │  Events           │  │
│  └──────────────┘  └──────────────┘  └───────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  Settlement Layer (Cardano)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │  Settlement   │  │  Margin      │  │  Funding Rate     │  │
│  │  Engine       │  │  Manager     │  │  Calculator       │  │
│  └──────────────┘  └──────────────┘  └───────────────────┘  │
│  ┌──────────────┐                                            │
│  │  Cardano      │                                           │
│  │  Connector    │                                           │
│  └──────────────┘                                            │
└─────────────────────────────────────────────────────────────┘

Shared Types, Errors & Utilities ──────────── common/
```

---

## Module Descriptions

### 📁 `common/`
Shared type definitions, error classes, utility functions, and system constants used across all modules. Provides the foundational data structures (`Order`, `Position`, `ZKProof`, etc.) that ensure type consistency throughout the system.

### 📁 `zk-circuits/`
Zero-Knowledge Proof circuit definitions for:
- **Order Commitments** — Hide order details (price, size, direction) using cryptographic commitments.
- **Price Range Proofs** — Prove a price falls within a valid range without revealing the exact value.
- **Margin Proofs** — Prove sufficient collateral exists without exposing the trader's balance.
- **Anti-Front-Running Proofs** — Prove temporal ordering of order commitments to prevent reordering.

### 📁 `matching/`
Privacy-preserving order matching engine that pairs buy and sell orders based on committed (hidden) data. Includes the order book data structure, matching logic with price-time priority, order validation, and an event system for trade lifecycle tracking.

### 📁 `settlement/`
On-chain settlement layer built for Cardano. Handles trade execution, margin account management (deposits, withdrawals, liquidations), PnL calculation, funding rate computation for perpetual contracts, and direct interaction with the Cardano blockchain via UTxO queries and transaction building.

### 📁 `privacy/`
Privacy layer powered by Midnight's ZK infrastructure. Manages the connection to the Midnight network, encrypted on-chain state, shielded transaction pools, and selective disclosure mechanisms for regulatory compliance.

---

## Technology Stack

| Component | Technology |
|-----------|-----------|
| **L1 Blockchain** | Cardano |
| **Privacy Layer** | Midnight (ZK-powered sidechain) |
| **ZK Language** | Compact (Midnight's ZK DSL) |
| **Implementation** | TypeScript |
| **Smart Contracts** | Plutus / Aiken (Cardano), Compact (Midnight) |

---

## Repository Structure

```
Anti-Front-Running-ZKPerps-on-Cardano-w-MidnightZK/
├── README.md                  # This file
├── LICENSE                    # MIT License
├── docs/                      # Documentation & specifications
│   └── SRS.pdf                # System Requirements Specification
├── common/                    # Shared types, errors, utilities, constants
│   ├── STUB_types.ts
│   ├── STUB_errors.ts
│   ├── STUB_utils.ts
│   ├── STUB_constants.ts
│   └── API.md
├── zk-circuits/               # ZK proof circuit definitions
│   ├── STUB_order_commitment.ts
│   ├── STUB_price_range_proof.ts
│   ├── STUB_margin_proof.ts
│   ├── STUB_anti_front_running_proof.ts
│   ├── STUB_circuit_utils.ts
│   └── API.md
├── matching/                  # Privacy-preserving order matching engine
│   ├── STUB_order_matcher.ts
│   ├── STUB_order_book.ts
│   ├── STUB_order_validator.ts
│   ├── STUB_matching_events.ts
│   └── API.md
├── settlement/                # On-chain settlement on Cardano
│   ├── STUB_settlement_engine.ts
│   ├── STUB_margin_manager.ts
│   ├── STUB_cardano_connector.ts
│   ├── STUB_funding_rate.ts
│   └── API.md
└── privacy/                   # Privacy layer (Midnight integration)
    ├── STUB_midnight_connector.ts
    ├── STUB_shielded_pool.ts
    ├── STUB_selective_disclosure.ts
    ├── STUB_encrypted_state.ts
    └── API.md
```

---

## Getting Started

> **Note:** This is the v0.1.0 stub release. The files contain interface definitions and placeholder implementations to establish the project architecture. Full implementations will be delivered in subsequent milestones.

1. Clone the repository:
   ```bash
   git clone https://github.com/Nucastio/Anti-Front-Running-ZKPerps-on-Cardano-w-MidnightZK.git
   ```

2. Browse the module folders to review the API interfaces and type definitions.

3. Each module contains an `API.md` file with detailed documentation of its interfaces.

---

## Roadmap

- **v0.1.0** (Current) — Repository structure, stub implementations, API/interface documentation
- **v0.2.0** — ZK circuit implementations using Midnight's Compact language
- **v0.3.0** — Matching engine with privacy-preserving order book
- **v0.4.0** — Cardano settlement integration with margin management
- **v0.5.0** — Full system integration, testnet deployment, and audit

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Contributing

Contributions are welcome! Please read the API documentation in each module's `API.md` before implementing any changes.

---

*Built by [Nucastio](https://github.com/Nucastio) — Combining Cardano's security with Midnight's privacy for fair DeFi perpetuals.*