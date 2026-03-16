// =============================================================================
// THIS IS STUB CODE — Not yet implemented.
// Provides interface definitions and placeholder logic only.
// Module: settlement/STUB_funding_rate.ts
// Purpose: Funding rate mechanism for perpetual contracts. Calculates and
//          applies periodic funding payments between long and short position
//          holders to keep the perpetual price anchored to the index price.
// =============================================================================

import { PerpetualContract, Position, PriceData } from "../common/STUB_types";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Record of a single funding rate epoch.
 */
export interface FundingRateRecord {
  /** Unique identifier for this funding epoch */
  epochId: string;
  /** Trading pair identifier */
  pairId: string;
  /** The calculated funding rate for this epoch */
  fundingRate: number;
  /** Mark price used in the calculation */
  markPrice: number;
  /** Index price used in the calculation */
  indexPrice: number;
  /** Total funding paid by longs (positive = longs pay shorts) */
  totalFundingPaid: number;
  /** Total funding received by shorts */
  totalFundingReceived: number;
  /** Number of positions affected */
  positionsAffected: number;
  /** Unix timestamp (ms) of this funding epoch */
  timestamp: number;
}

/**
 * Funding payment for an individual position.
 */
export interface FundingPayment {
  /** Position identifier */
  positionId: string;
  /** Trader's wallet address */
  traderId: string;
  /** Funding amount (positive = trader pays, negative = trader receives) */
  amount: number;
  /** The funding rate applied */
  fundingRate: number;
  /** Position size used for calculation */
  positionSize: number;
  /** Mark price at the time of funding */
  markPrice: number;
}

/**
 * Predicted next funding rate based on current market conditions.
 */
export interface FundingRatePrediction {
  /** Predicted funding rate */
  predictedRate: number;
  /** Current mark-index spread */
  currentSpread: number;
  /** Time until next funding (ms) */
  timeUntilNextFundingMs: number;
  /** Estimated payment per unit of long position size */
  estimatedPaymentPerUnitLong: number;
  /** Estimated payment per unit of short position size */
  estimatedPaymentPerUnitShort: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// FUNDING RATE FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculates the funding rate for a perpetual contract based on the
 * divergence between mark price and index price.
 *
 * **Formula:**
 * ```
 * Raw Rate = (Mark Price - Index Price) / Index Price
 * Clamped Rate = clamp(Raw Rate, -MAX_FUNDING_RATE, +MAX_FUNDING_RATE)
 * Dampened Rate = Clamped Rate × Dampening Factor
 * ```
 *
 * - Positive rate: Longs pay shorts (mark > index, bullish premium)
 * - Negative rate: Shorts pay longs (mark < index, bearish discount)
 *
 * @param priceData       - Current price data with mark and index prices.
 * @param dampeningFactor - Dampening factor (default: 0.1).
 * @returns The funding rate as a decimal (e.g., 0.001 = 0.1%).
 *
 * @example
 * ```typescript
 * const rate = calculateFundingRate(
 *   { markPrice: 1.05, indexPrice: 1.00, ... },
 *   0.1
 * );
 * // Returns 0.005 (0.5%) — longs pay shorts
 * ```
 */
export function calculateFundingRate(
  priceData: PriceData,
  dampeningFactor: number = 0.1
): number {
  // STUB: Will implement the clamped, dampened funding rate formula
  throw new Error("Not implemented: calculateFundingRate");
}

/**
 * Applies funding payments to all open positions for a trading pair.
 *
 * For each open position:
 * - LONG positions: payment = fundingRate × positionSize × markPrice
 * - SHORT positions: payment = -fundingRate × positionSize × markPrice
 *
 * Positive payment means the trader pays; negative means the trader receives.
 *
 * @param pairId       - The trading pair.
 * @param fundingRate  - The funding rate to apply.
 * @param positions    - All open positions for the pair.
 * @param markPrice    - The current mark price.
 * @returns Array of individual funding payments.
 *
 * @example
 * ```typescript
 * const payments = applyFunding("ADA-USD", 0.001, openPositions, 1.05);
 * for (const p of payments) {
 *   console.log(`${p.traderId}: ${p.amount > 0 ? "pays" : "receives"} ${Math.abs(p.amount)}`);
 * }
 * ```
 */
export function applyFunding(
  pairId: string,
  fundingRate: number,
  positions: Position[],
  markPrice: number
): FundingPayment[] {
  // STUB: Will calculate funding for each position and return payments
  throw new Error("Not implemented: applyFunding");
}

/**
 * Retrieves the funding rate history for a trading pair.
 *
 * @param pairId - The trading pair.
 * @param limit  - Maximum number of records to return (default: 100).
 * @param offset - Offset for pagination (default: 0).
 * @returns Array of historical funding rate records.
 */
export async function getFundingHistory(
  pairId: string,
  limit: number = 100,
  offset: number = 0
): Promise<FundingRateRecord[]> {
  // STUB: Will query funding history from on-chain or off-chain storage
  throw new Error("Not implemented: getFundingHistory");
}

/**
 * Gets the time until the next funding epoch for a trading pair.
 *
 * @param pairId            - The trading pair.
 * @param fundingIntervalMs - The funding interval in milliseconds.
 * @returns Time remaining in milliseconds until the next funding epoch.
 */
export function getNextFundingTime(
  pairId: string,
  fundingIntervalMs: number
): number {
  // STUB: Will calculate based on last funding timestamp + interval
  throw new Error("Not implemented: getNextFundingTime");
}

/**
 * Predicts the next funding rate based on current market conditions.
 *
 * @param priceData         - Current price data.
 * @param fundingIntervalMs - The funding interval in milliseconds.
 * @returns Funding rate prediction with estimated payments.
 */
export function predictNextFundingRate(
  priceData: PriceData,
  fundingIntervalMs: number
): FundingRatePrediction {
  // STUB: Will calculate predicted rate and estimated payments
  throw new Error("Not implemented: predictNextFundingRate");
}

/**
 * Processes a full funding epoch: calculates rate, applies to all positions,
 * and records the result.
 *
 * Called automatically at each funding interval by the settlement engine.
 *
 * @param contract  - The perpetual contract definition.
 * @param priceData - Current price data.
 * @param positions - All open positions for the contract.
 * @returns The funding rate record for this epoch.
 */
export async function processFundingEpoch(
  contract: PerpetualContract,
  priceData: PriceData,
  positions: Position[]
): Promise<FundingRateRecord> {
  // STUB: Will orchestrate the full funding flow:
  // 1. Calculate funding rate
  // 2. Apply to all positions
  // 3. Execute margin transfers
  // 4. Record the epoch
  throw new Error("Not implemented: processFundingEpoch");
}
