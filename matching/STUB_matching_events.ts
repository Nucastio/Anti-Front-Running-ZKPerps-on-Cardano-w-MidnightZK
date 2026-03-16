// =============================================================================
// THIS IS STUB CODE — Not yet implemented.
// Provides interface definitions and placeholder logic only.
// Module: matching/STUB_matching_events.ts
// Purpose: Event definitions and emitter interface for the matching engine.
//          Provides a pub/sub mechanism for order lifecycle events that
//          downstream systems (settlement, monitoring, UI) can subscribe to.
// =============================================================================

import { OrderCommitment, ZKProof } from "../common/STUB_types";

// ─────────────────────────────────────────────────────────────────────────────
// EVENT TYPES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * All possible matching engine event types.
 */
export enum MatchingEventType {
  /** A new order commitment has been submitted and accepted */
  ORDER_SUBMITTED = "ORDER_SUBMITTED",
  /** Two orders have been matched */
  ORDER_MATCHED = "ORDER_MATCHED",
  /** An order has been cancelled by the trader */
  ORDER_CANCELLED = "ORDER_CANCELLED",
  /** An order has expired past its TTL */
  ORDER_EXPIRED = "ORDER_EXPIRED",
  /** An order was rejected during validation */
  ORDER_REJECTED = "ORDER_REJECTED",
  /** An order was partially filled */
  ORDER_PARTIALLY_FILLED = "ORDER_PARTIALLY_FILLED",
  /** A matching round has started */
  MATCHING_ROUND_STARTED = "MATCHING_ROUND_STARTED",
  /** A matching round has completed */
  MATCHING_ROUND_COMPLETED = "MATCHING_ROUND_COMPLETED",
  /** An error occurred during matching */
  MATCHING_ERROR = "MATCHING_ERROR",
}

// ─────────────────────────────────────────────────────────────────────────────
// EVENT PAYLOADS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Base event interface — all events include these fields.
 */
export interface BaseMatchingEvent {
  /** Event type identifier */
  type: MatchingEventType;
  /** Unix timestamp (ms) when the event was emitted */
  timestamp: number;
  /** Unique event identifier */
  eventId: string;
  /** Trading pair associated with this event */
  pairId: string;
}

/**
 * Emitted when a new order is submitted and accepted into the order book.
 */
export interface OrderSubmittedEvent extends BaseMatchingEvent {
  type: MatchingEventType.ORDER_SUBMITTED;
  /** Internal order ID */
  orderId: string;
  /** The order commitment (order details are hidden) */
  commitment: OrderCommitment;
}

/**
 * Emitted when two orders are matched.
 */
export interface OrderMatchedEvent extends BaseMatchingEvent {
  type: MatchingEventType.ORDER_MATCHED;
  /** Unique match identifier */
  matchId: string;
  /** Buy-side order ID */
  buyOrderId: string;
  /** Sell-side order ID */
  sellOrderId: string;
  /** Execution price */
  executionPrice: number;
  /** Executed quantity */
  executionSize: number;
  /** ZK proof of correct matching */
  matchingProof: ZKProof;
}

/**
 * Emitted when an order is cancelled.
 */
export interface OrderCancelledEvent extends BaseMatchingEvent {
  type: MatchingEventType.ORDER_CANCELLED;
  /** The cancelled order ID */
  orderId: string;
  /** Reason for cancellation */
  reason: "trader_requested" | "insufficient_margin" | "system";
}

/**
 * Emitted when an order expires.
 */
export interface OrderExpiredEvent extends BaseMatchingEvent {
  type: MatchingEventType.ORDER_EXPIRED;
  /** The expired order ID */
  orderId: string;
  /** Original TTL in milliseconds */
  ttlMs: number;
}

/**
 * Emitted when an order is rejected during validation.
 */
export interface OrderRejectedEvent extends BaseMatchingEvent {
  type: MatchingEventType.ORDER_REJECTED;
  /** Commitment hash of the rejected order */
  commitmentHash: string;
  /** Rejection reason */
  reason: string;
  /** Error code */
  errorCode: number;
}

/**
 * Emitted when an order is partially filled.
 */
export interface OrderPartiallyFilledEvent extends BaseMatchingEvent {
  type: MatchingEventType.ORDER_PARTIALLY_FILLED;
  /** The order that was partially filled */
  orderId: string;
  /** Amount filled in this match */
  filledSize: number;
  /** Remaining unfilled amount */
  remainingSize: number;
}

/**
 * Emitted when a matching round starts.
 */
export interface MatchingRoundStartedEvent extends BaseMatchingEvent {
  type: MatchingEventType.MATCHING_ROUND_STARTED;
  /** Matching round identifier */
  roundId: string;
  /** Number of open orders at round start */
  openOrderCount: number;
}

/**
 * Emitted when a matching round completes.
 */
export interface MatchingRoundCompletedEvent extends BaseMatchingEvent {
  type: MatchingEventType.MATCHING_ROUND_COMPLETED;
  /** Matching round identifier */
  roundId: string;
  /** Number of matches made in this round */
  matchCount: number;
  /** Duration of the matching round in milliseconds */
  durationMs: number;
}

/**
 * Emitted when an error occurs during matching.
 */
export interface MatchingErrorEvent extends BaseMatchingEvent {
  type: MatchingEventType.MATCHING_ERROR;
  /** Error message */
  errorMessage: string;
  /** Error code */
  errorCode: number;
  /** Whether the error is recoverable */
  isRecoverable: boolean;
}

/**
 * Union type of all matching events.
 */
export type MatchingEvent =
  | OrderSubmittedEvent
  | OrderMatchedEvent
  | OrderCancelledEvent
  | OrderExpiredEvent
  | OrderRejectedEvent
  | OrderPartiallyFilledEvent
  | MatchingRoundStartedEvent
  | MatchingRoundCompletedEvent
  | MatchingErrorEvent;

// ─────────────────────────────────────────────────────────────────────────────
// EVENT HANDLER TYPE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Type for event handler callbacks.
 */
export type MatchingEventHandler<T extends MatchingEvent = MatchingEvent> = (
  event: T
) => void | Promise<void>;

// ─────────────────────────────────────────────────────────────────────────────
// EVENT EMITTER CLASS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Event emitter for matching engine events.
 *
 * Provides a type-safe pub/sub mechanism for subscribing to specific
 * event types. Used by the settlement module, monitoring dashboards,
 * and notification systems.
 *
 * @example
 * ```typescript
 * const emitter = new MatchingEventEmitter();
 *
 * // Subscribe to match events
 * emitter.on(MatchingEventType.ORDER_MATCHED, async (event) => {
 *   console.log(`Match: ${event.matchId} at price ${event.executionPrice}`);
 *   await settlementEngine.settleTrade(event);
 * });
 *
 * // Subscribe to all events
 * emitter.onAny((event) => {
 *   logger.info(`Event: ${event.type}`, event);
 * });
 * ```
 */
export class MatchingEventEmitter {
  private handlers: Map<MatchingEventType, MatchingEventHandler[]> = new Map();
  private globalHandlers: MatchingEventHandler[] = [];

  /**
   * Subscribes to events of a specific type.
   *
   * @param eventType - The event type to listen for.
   * @param handler   - Callback function invoked when the event fires.
   * @returns An unsubscribe function.
   */
  public on(
    eventType: MatchingEventType,
    handler: MatchingEventHandler
  ): () => void {
    // STUB: Will register the handler and return an unsubscribe function
    throw new Error("Not implemented: MatchingEventEmitter.on");
  }

  /**
   * Subscribes to all event types.
   *
   * @param handler - Callback function invoked for every event.
   * @returns An unsubscribe function.
   */
  public onAny(handler: MatchingEventHandler): () => void {
    // STUB: Will register a global handler
    throw new Error("Not implemented: MatchingEventEmitter.onAny");
  }

  /**
   * Emits an event to all registered handlers.
   *
   * @param event - The event to emit.
   */
  public async emit(event: MatchingEvent): Promise<void> {
    // STUB: Will call all type-specific and global handlers
    throw new Error("Not implemented: MatchingEventEmitter.emit");
  }

  /**
   * Removes all handlers for a specific event type, or all handlers if
   * no type is specified.
   *
   * @param eventType - Optional event type to clear handlers for.
   */
  public removeAllListeners(eventType?: MatchingEventType): void {
    // STUB: Will clear handlers map
    throw new Error("Not implemented: MatchingEventEmitter.removeAllListeners");
  }
}
