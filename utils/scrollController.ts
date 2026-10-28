/**
 * Scripted scroll animation controller.
 *
 * Pure module: no access to window/document and no Nuxt or Vue imports. All
 * browser access goes through the injected `ScrollEnv`, so tests can drive the
 * controller with a manual clock.
 */

import { SCROLL_DURATION_MS, scrollPositionAt } from './scrollMath';

export interface ScrollEnv {
  getScrollY(): number;
  /** Instant write. */
  setScrollY(y: number): void;
  /** max(0, scrollHeight - innerHeight). */
  getMaxScroll(): number;
  /** Current time in ms. */
  now(): number;
  /** Returns null when no animation API is available. */
  requestFrame(cb: (ts: number) => void): number | null;
  cancelFrame(id: number): void;
  prefersReducedMotion(): boolean;
  /** true: apply inline `scroll-behavior: auto`; false: restore the previous value. */
  setSmoothOverride(active: boolean): void;
  /** Subscribes to scroll interruption events. Returns the unsubscribe function. */
  onInterrupt(handler: () => void): () => void;
}

export interface ScrollRequest {
  /** Already clamped by the caller; re-clamped defensively here. */
  target: number;
  /** Defaults to 800 ms. */
  durationMs?: number;
  /** Reached the target (animated or instant). */
  onComplete?: () => void;
  /** Interrupted, superseded, or cancelled. */
  onCancel?: () => void;
}

interface Run {
  start: number;
  target: number;
  durationMs: number;
  t0: number;
  frameId: number | null;
  unsubscribe: (() => void) | null;
  onComplete?: () => void;
  onCancel?: () => void;
}

export class ScrollController {
  private readonly env: ScrollEnv;
  private run: Run | null = null;

  constructor(env: ScrollEnv) {
    this.env = env;
  }

  /** Target of the running animation, or null when idle. */
  get activeTarget(): number | null {
    return this.run ? this.run.target : null;
  }

  scrollTo(req: ScrollRequest): void {
    const env = this.env;
    const target = clamp(req.target, env.getMaxScroll());
    const durationMs =
      typeof req.durationMs === 'number' && Number.isFinite(req.durationMs)
        ? req.durationMs
        : SCROLL_DURATION_MS;

    if (this.run) {
      // Same target already in flight: keep the running animation untouched.
      if (this.run.target === target) return;
      // Different target: supersede and restart from the current position.
      this.cancel();
    }

    const start = env.getScrollY();

    // Instant path: reduced motion, nothing to animate, or zero duration.
    if (env.prefersReducedMotion() || !(durationMs > 0) || sameSpot(start, target)) {
      this.writeInstant(target);
      safeCall(req.onComplete);
      return;
    }

    env.setSmoothOverride(true);

    const run: Run = {
      start,
      target,
      durationMs,
      t0: env.now(),
      frameId: null,
      unsubscribe: null,
      onComplete: req.onComplete,
      onCancel: req.onCancel,
    };

    this.run = run;
    const firstFrame = env.requestFrame(() => this.step(run));
    if (firstFrame === null) {
      // No animation API: fall back to an instant write.
      this.run = null;
      try {
        env.setScrollY(target);
      } finally {
        env.setSmoothOverride(false);
      }
      safeCall(req.onComplete);
      return;
    }

    run.frameId = firstFrame;
    run.unsubscribe = env.onInterrupt(() => this.interrupt(run));
  }

  /** Cancels the running animation, if any. Keeps the position; calls `onCancel`. */
  cancel(): void {
    const run = this.run;
    if (!run) return;
    this.end(run);
    safeCall(run.onCancel);
  }

  private step(run: Run): void {
    if (this.run !== run) return;
    run.frameId = null;
    const env = this.env;

    const elapsed = env.now() - run.t0;
    if (elapsed >= run.durationMs) {
      env.setScrollY(run.target);
      this.complete(run);
      return;
    }

    env.setScrollY(scrollPositionAt(run.start, run.target, elapsed, run.durationMs));

    const actual = env.getScrollY();
    if (sameSpot(actual, run.target)) {
      if (actual !== run.target) env.setScrollY(run.target);
      this.complete(run);
      return;
    }

    const next = env.requestFrame(() => this.step(run));
    if (next === null) {
      // Frame API vanished mid-run: finish instantly.
      env.setScrollY(run.target);
      this.complete(run);
      return;
    }
    run.frameId = next;
  }

  private interrupt(run: Run): void {
    if (this.run !== run) return;
    this.end(run);
    safeCall(run.onCancel);
  }

  private complete(run: Run): void {
    this.end(run);
    safeCall(run.onComplete);
  }

  /** Single exit point: leaves the Animating state exactly once per run. */
  private end(run: Run): void {
    if (this.run !== run) return;
    this.run = null;
    if (run.frameId !== null) {
      this.env.cancelFrame(run.frameId);
      run.frameId = null;
    }
    if (run.unsubscribe) {
      const unsubscribe = run.unsubscribe;
      run.unsubscribe = null;
      unsubscribe();
    }
    this.env.setSmoothOverride(false);
  }

  private writeInstant(target: number): void {
    const env = this.env;
    env.setSmoothOverride(true);
    try {
      env.setScrollY(target);
    } finally {
      env.setSmoothOverride(false);
    }
  }
}

function clamp(value: number, maxScroll: number): number {
  const max = maxScroll > 0 ? maxScroll : 0;
  if (!(value > 0)) return 0;
  return value > max ? max : value;
}

function sameSpot(a: number, b: number): boolean {
  return Math.round(a) === Math.round(b);
}

function safeCall(fn: (() => void) | undefined): void {
  if (fn) fn();
}
