import { Validator, ValuePath } from "./_common";

// WARNING: This considers `null` as `undefined`, so neither can be used as a value.
export class VOptional<V> extends Validator<V | undefined> {
  public constructor(readonly of: Validator<V>, helper?: string) {
    super(of.example, helper ?? of.helper);
  }

  parse(theValue: ValuePath, raw: unknown) {
    if (raw == null) {
      return undefined;
    }
    return this.of.parse(theValue, raw);
  }
}

export class VBlankAsOptional<V extends string> extends Validator<
  V | undefined
> {
  public constructor(
    readonly of: Validator<V>,
    readonly trim?: boolean,
    helper?: string
  ) {
    super(of.example, helper ?? of.helper);
  }

  parse(theValue: ValuePath, raw: unknown): V | undefined {
    if (typeof raw != "string") {
      throw theValue.isBadAsIt("is not a string");
    }
    if (this.trim) {
      raw = raw.trim();
    }
    return !raw ? undefined : this.of.parse(theValue, raw);
  }
}

// WARNING: This considers `null` as `undefined`, so neither can be used as a value.
export class VDefault<V> extends Validator<V> {
  public constructor(
    readonly of: Validator<V>,
    private readonly def: V,
    helper?: string
  ) {
    super(def, helper ?? of.helper);
  }

  parse(theValue: ValuePath, raw: unknown): V {
    if (raw == null) {
      return this.def;
    }
    return this.of.parse(theValue, raw);
  }
}
