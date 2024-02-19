import maybeParseBigInt from "@xtjs/lib/js/maybeParseBigInt";
import { Validator, ValuePath } from "./_common";

export class VInteger extends Validator<number> {
  public constructor(
    readonly min?: number,
    readonly max?: number,
    helper?: string
  ) {
    super(min ?? 1, helper);
  }

  parse(theValue: ValuePath, raw: unknown): number {
    const { min, max } = this;
    if (typeof raw != "string" && typeof raw != "number") {
      throw theValue.isBadAsIt("is not a number");
    }
    if (typeof raw == "string") {
      // Number.parseInt accepts decimal strings and simply truncates.
      if (!/^-?[0-9]+$/.test(raw)) {
        throw theValue.isBadAsIt("is not an integer");
      }
    }
    const val = typeof raw == "string" ? Number.parseInt(raw, 10) : raw;
    if (!Number.isSafeInteger(val)) {
      throw theValue.isBadAsIt("is not an integer");
    }
    if (min !== undefined && val < min) {
      throw theValue.isBadAsIt(`is less than the minimum of ${min}`);
    }
    if (max !== undefined && val > max) {
      throw theValue.isBadAsIt(`is greater than the maximum of ${max}`);
    }
    return val;
  }
}

export class VBigInt extends Validator<bigint> {
  public constructor(
    readonly min?: bigint,
    readonly max?: bigint,
    helper?: string
  ) {
    // Use BigInt(1) instead of 1n in case BigInt isn't supported in the target browser/engine (and parsing would fail, even if this class isn't used).
    super(min ?? BigInt(1), helper);
  }

  parse(theValue: ValuePath, raw: unknown): bigint {
    const { min, max } = this;
    if (
      typeof raw != "string" &&
      typeof raw != "bigint" &&
      typeof raw != "number"
    ) {
      throw theValue.isBadAsIt("is not a bigint");
    }
    const val =
      typeof raw == "string" || typeof raw == "number"
        ? maybeParseBigInt(raw)
        : raw;
    if (val == undefined) {
      throw theValue.isBadAsIt("is not an integer");
    }
    if (min !== undefined && val < min) {
      throw theValue.isBadAsIt(`is less than the minimum of ${min}`);
    }
    if (max !== undefined && val > max) {
      throw theValue.isBadAsIt(`is greater than the maximum of ${max}`);
    }
    return val;
  }
}
