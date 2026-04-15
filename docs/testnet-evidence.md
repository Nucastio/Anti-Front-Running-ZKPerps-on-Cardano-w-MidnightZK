# Cardano testnet evidence (Milestone C)

This file records **≥2 successful Cardano testnet transactions** that anchor **ZK-verified order settlement** via the **Aiken settlement script** (inline **`AnchorDatum`**), linking public commitments to Midnight proof transaction identifiers where applicable.

**Last updated:** 2026-04-15 (Preprod anchors aligned with latest `benchmarks.md` / Midnight undeployed pipeline run).

## How to produce evidence

1. Copy `.env.example` to `.env` and set `CARDANO_BACKEND=blockfrost`, `BLOCKFROST_PROJECT_ID`, `WALLET_MNEMONIC`, and `CARDANO_NETWORK=Preprod` (or `Preview`).
2. Fund the wallet with test ADA from the official faucet.
3. Run twice with different settlement IDs (example):

```bash
npx tsx scripts/cardano-anchor-settlement.ts settle-demo-1 <64-hex-order-commitment> <optional-midnight-prove-tx-hash>
npx tsx scripts/cardano-anchor-settlement.ts settle-demo-2 <64-hex-order-commitment> <optional-midnight-prove-tx-hash>
```

4. Paste the printed **Cardanoscan** (or other explorer) URLs below.

## Recorded transactions

Script address (Preprod): `addr_test1wrf8enqnl26m0q5cfg73lxf4xxtu5x5phcrfjs0lcqp7uagh2hm3k`

| # | Settlement ID | txHash | Explorer URL |
|---|---------------|--------|--------------|
| 1 | `preprod-run-01` | `a0d8109593fe136a4dafc923b7857a187d6d7de72ef019133646bd5925b6621a` | [preprod.cardanoscan.io](https://preprod.cardanoscan.io/transaction/a0d8109593fe136a4dafc923b7857a187d6d7de72ef019133646bd5925b6621a) |
| 2 | `preprod-run-02` | `1c26333ec3ca79b4f9b0c2d4e6746c94adc4e7e6da9c8c013ada59f325fea4f5` | [preprod.cardanoscan.io](https://preprod.cardanoscan.io/transaction/1c26333ec3ca79b4f9b0c2d4e6746c94adc4e7e6da9c8c013ada59f325fea4f5) |

Both transactions lock **min-ADA** at the **`settlement_anchor`** Plutus V3 script with inline **`AnchorDatum`** (settlement id, 32-byte order commitment, optional midnight reference string in `midnight_tx`).
