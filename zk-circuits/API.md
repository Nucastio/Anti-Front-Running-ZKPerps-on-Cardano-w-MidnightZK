# ZK Circuits Module — API Reference

This module defines Zero-Knowledge Proof circuits written in Midnight's Compact language for the Anti-Front-Running ZK Perpetuals system. All circuit files use the `.compact` extension. Supporting TypeScript utilities are in `STUB_circuit_utils.ts`.

Refer to SRS Section 6.2: "Smart contracts are written using Compact, Midnight's smart contract language designed with privacy as the default behavior."

Refer to SRS Section 7: "The system relies on non-interactive zero-knowledge proofs, allowing a prover to demonstrate correctness of computations without revealing private inputs."

---

## Primary Proof Circuits (SRS Section 7)

| Circuit | File | SRS Requirement | Key Guarantee |
|---------|------|-----------------|---------------|
| Order Validation | `STUB_order_validation.compact` | Section 3.3, 7 | Commitment integrity, signature, margin sufficiency |
| Matching Verification | `STUB_matching_verification.compact` | Section 3.4, 7 | Correct pairing, fair execution, liquidity |
| Settlement Verification | `STUB_settlement_verification.compact` | Section 3.5, 7 | Balance updates, position changes, margin accounting |
| Liquidation Verification | `STUB_liquidation_verification.compact` | Section 3.6, 7 | Margin breach, liquidation eligibility, penalty |

## Supporting Circuits

| Circuit | File | Purpose |
|---------|------|---------|
| Price Range Proof | `STUB_price_range_proof.compact` | Proves price within oracle-derived bounds |
| Margin Proof | `STUB_margin_proof.compact` | Proves sufficient collateral without revealing balance |
| Anti-Front-Running Proof | `STUB_anti_front_running_proof.compact` | Proves temporal ordering of commitments |

---

## STUB_order_validation.compact

Validates a trading order by proving commitment hash integrity, trader signature authenticity, parameter range compliance, and margin sufficiency.

| Element | Type | Description |
|---------|------|-------------|
| `OrderCommitment` | type | Public commitment fields: hash, pair, timestamp, trader |
| `OrderParams` | type | Private order parameters: price, size, side, leverage, margin, nonce |
| `MarginState` | type | Private margin: total balance, locked, available |
| `orderCommitments` | ledger | On-chain registry of validated commitments |
| `validateOrder` | circuit | Main validation circuit accepting an `OrderCommitment` |

---

## STUB_matching_verification.compact

Validates that a trade match was performed correctly.

| Element | Type | Description |
|---------|------|-------------|
| `MatchedPair` | type | Execution details: buy/sell hashes, price, size |
| `MatchPrivateData` | type | Private order data for both sides |
| `matchRegistry` | ledger | On-chain match records |
| `verifyMatch` | circuit | Validates pairing, price crossing, fair execution, sizing |

Proves: `buyPrice >= sellPrice`, `executionPrice = (buyPrice + sellPrice) / 2`, `executionSize = min(buySize, sellSize)`.

---

## STUB_settlement_verification.compact

Validates that trade settlement preserves balance conservation.

| Element | Type | Description |
|---------|------|-------------|
| `BalanceTransition` | type | Before/after balance states |
| `PositionUpdate` | type | New position parameters |
| `positionRegistry` | ledger | On-chain position records |
| `verifySettlement` | circuit | Validates margin locks, balance conservation, position integrity |

---

## STUB_liquidation_verification.compact

Validates that a liquidation is justified and correctly executed.

| Element | Type | Description |
|---------|------|-------------|
| `LiquidationTarget` | type | Position details being liquidated |
| `MarketData` | type | Oracle price data with signature |
| `insuranceFundBalance` | ledger | Insurance fund accumulation |
| `verifyLiquidation` | circuit | Validates margin breach, oracle, penalty, remaining margin |

Penalty formula: `penalty = positionValue * 250 / 10000` (2.5%).

---

## STUB_price_range_proof.compact

| Element | Type | Description |
|---------|------|-------------|
| `OraclePrice` | type | Oracle feed data with signature |
| `provePriceInRange` | circuit | Proves actual price within `[minPrice, maxPrice]` |

---

## STUB_margin_proof.compact

| Element | Type | Description |
|---------|------|-------------|
| `MarginProofPublicInputs` | type | Balance commitment and minimum required |
| `proveMarginSufficiency` | circuit | Proves `availableBalance >= requiredMargin` |

---

## STUB_anti_front_running_proof.compact

| Element | Type | Description |
|---------|------|-------------|
| `TimelockPublicInputs` | type | Reference block and timestamp for matching round |
| `proveTimelockOrdering` | circuit | Proves commitment existed before reference point |
| `verifyBatchTimelock` | circuit | Batch verification for multiple commitments |

---

## STUB_circuit_utils.ts (TypeScript)

Utility functions for circuit management. This file remains in TypeScript because it handles compilation, serialization, and caching — not proof generation.

| Function | Description |
|----------|-------------|
| `compileCircuit` | Compiles a Compact circuit with trusted setup |
| `generateWitness` | Generates witness assignment for a circuit |
| `serializeProof` | Serializes proof for storage or transmission |
| `deserializeProof` | Deserializes proof from stored format |
| `loadCachedCircuit` | Loads a pre-compiled circuit from cache |
| `listAvailableCircuits` | Returns metadata for all system circuits |
