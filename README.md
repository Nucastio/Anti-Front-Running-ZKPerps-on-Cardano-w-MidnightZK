# Anti-Front-Running ZK Perpetuals on Cardano (Midnight ZK)

Privacy-preserving perpetual derivatives flow: **private order commitments**, **Midnight ZK proofs**, **matching**, and **Cardano-anchored settlement** references. Requirements: [Software requirements specification](./docs/SRS.md). **Architecture (Milestone A):** [docs/architecture.md](./docs/architecture.md).

## Repository layout

| Path | Purpose |
|------|---------|
| `contract/` | **Compact** `zkperps-order` contract + managed ZK artifacts (`npm run compact`) |
| `midnight-local-cli/` | Midnight.js **deploy / prove / bind** CLI (`npm run midnight:run-all`) |
| `src/config/` | **NuAuth-style** env defaults: `midnight_network.ts`, `cardano_env.ts` |
| `src/order/` | Off-chain **commitment** + unit tests |
| `settlement/cardano_connector.ts` | **Lucid Evolution** Cardano connector (Blockfrost **or** in-process emulator) |
| `cardano/settlement-anchor/` | **Aiken** `settlement_anchor` validator; run `aiken build` → `plutus.json` |
| `scripts/cardano-anchor-settlement.ts` | Submit **L1 anchor tx** (min-ADA **ToContract** + inline **AnchorDatum**) |
| `docs/benchmarks.md` / `docs/benchmarks.csv` | Benchmark report + raw CSV |
| `docs/testnet-evidence.md` | Cardano explorer links (fill after testnet runs) |
| `docs/demo.md` | Demo video link + suggested script |

Module API references: [zk-circuits/API.md](./zk-circuits/API.md), [matching/API.md](./matching/API.md), [settlement/API.md](./settlement/API.md), [privacy/API.md](./privacy/API.md), [common/API.md](./common/API.md).

**Stylized demo (browser replay, screen-record to MP4):** [docs/demo-terminal.html](docs/demo-terminal.html) · [docs/demo.md](docs/demo.md).

## Quick start

```bash
cp .env.example .env
# Edit: WALLET_MNEMONIC; for Cardano testnet also BLOCKFROST_PROJECT_ID and CARDANO_BACKEND=blockfrost
# For Midnight CLI: BIP39_MNEMONIC, ZKPERPS_* hex vars

npm install
npm run build:contract

# Proof server (local Docker, optional if using hosted Midnight proof URL)
docker run --rm -p 6300:6300 midnightntwrk/proof-server:8.0.3 midnight-proof-server -v &

npm test
npm run bench
```

### Midnight: deploy + ZK circuits

Requires funded **`BIP39_MNEMONIC`** on the selected Midnight network and (for `undeployed`) [midnight-local-network](https://github.com/bricktowers/midnight-local-network) running.

```bash
npm run midnight:run-all

# Full five-contract stack: order + matching + settlement + liquidation + aggregate (5 deploys)
npm run midnight:run-pipeline
```

See [midnight-local-cli/README.md](./midnight-local-cli/README.md) for env variables (`MIDNIGHT_DEPLOY_NETWORK`, `ZKPERPS_TRADER_SK_HEX`, optional `ZKPERPS_*` for matching/settlement/liquidation/aggregate, …).

### Cardano: anchor settlement digest (Aiken script)

Rebuild on-chain artifact after editing validators: `cd cardano/settlement-anchor && aiken build` (commits `plutus.json`).

**Emulator (no keys):** set `CARDANO_BACKEND=emulator` in `.env`.

```bash
npx tsx scripts/cardano-anchor-settlement.ts demo-1 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
```

**Preprod:** set `CARDANO_BACKEND=blockfrost`, `BLOCKFROST_PROJECT_ID`, fund wallet, then run the same command with real commitment hex. Paste explorer URLs into [docs/testnet-evidence.md](./docs/testnet-evidence.md).

Optional: **`SETTLEMENT_ANCHOR_BLUEPRINT`** — path to a different `plutus.json`.

## Toolchain versions

- **Node.js** ≥ 20  
- **[Aiken](https://aiken-lang.org/)** (for `cardano/settlement-anchor`, same major as `aiken.toml` `compiler`)  
- **Compact CLI** (see [Midnight installation](https://docs.midnight.network/getting-started/installation))  
- Midnight npm packages pinned in `contract/package.json` and `midnight-local-cli/package.json` (align with [Midnight docs](https://docs.midnight.network/relnotes/overview)).

## License

MIT
