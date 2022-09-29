import { Validator, ValuePath } from "./_common";

export class VFiniteNumber extends Validator<number> {
  public constructor(
    readonly min?: number,
    readonly max?: number,
    helper?: string
  ) {
    super(min ?? 3.14, helper);
  }

  parse(theValue: ValuePath, raw: unknown) {
    const { min, max } = this;
    if (typeof raw == "string") {
      // Number constructor accepts 0b11, 0o777, 0x3d, Infinity, -0, -Infinity,
      // all of which Number.parseFloat doesn't parse.
      raw = Number(raw);
    }
    if (typeof raw != "number") {
      throw theValue.isBadAsIt("is not a number");
    }
    if (!Number.isFinite(raw)) {
      throw theValue.isBadAsIt("is not a number");
    }
    if (min !== undefined && raw < min) {
      throw theValue.isBadAsIt(`is less than the minimum of ${min}`);
    }
    if (max !== undefined && raw > max) {
      throw theValue.isBadAsIt(`is greater than the maximum of ${max}`);
    }
    return raw;
  }
}

export class VInfiniteAsOptional<T> extends Validator<T | undefined> {
  public constructor(readonly otherwise: Validator<T>, helper?: string) {
    super(otherwise.example, helper ?? otherwise.helper);
  }

  parse(theValue: ValuePath, raw: unknown): T | undefined {
    if (raw === Infinity || raw === "infinity") {
      return undefined;
    }
    return this.otherwise.parse(theValue, raw);
  }
}

// Allows +/-Infinity and NaN.
export class VAnyNumber extends Validator<number> {
  public constructor(
    readonly min?: number,
    readonly max?: number,
    helper?: string
  ) {
    super(min ?? 3.14, helper);
  }

  parse(theValue: ValuePath, raw: unknown) {
    const { min, max } = this;
    if (typeof raw == "string") {
      raw = Number(raw);
    }
    if (typeof raw != "number") {
      throw theValue.isBadAsIt("is not a number");
    }
    if (min !== undefined && raw < min) {
      throw theValue.isBadAsIt(`is less than the minimum of ${min}`);
    }
    if (max !== undefined && raw > max) {
      throw theValue.isBadAsIt(`is greater than the maximum of ${max}`);
    }
    return raw;
  }
}
