import assertState from "@xtjs/lib/js/assertState";
import { Validator, ValuePath } from "./_common";

// This is string-only as partially-/fully-numeric enums have much more complex types due to reverse mappings.
export class VStringEnum<M extends string> extends Validator<M> {
  readonly values: Set<M>;

  public constructor(
    members: {
      [name: string]: M;
    },
    helper?: string
  ) {
    const values = new Set(Object.values(members));
    assertState(values.size > 0, "Enum has no members");
    super(values.values().next().value, helper);
    this.values = values;
  }

  parse(theValue: ValuePath, raw: unknown): M {
    if (!this.values.has(raw as any)) {
      throw theValue.isBadAsIt("is not a valid value");
    }
    return raw as M;
  }
}

export class VNumericEnum<M extends number> extends Validator<M> {
  readonly values: Set<M>;

  public constructor(
    members: {
      [nameOrVal: string]: string | M;
    },
    helper?: string
  ) {
    const values = new Set(
      Object.values(members).filter((v): v is M => typeof v == "number")
    );
    assertState(values.size > 0, "Enum has no members");
    super(values.values().next().value, helper);
    this.values = values;
  }

  parse(theValue: ValuePath, raw: unknown): M {
    if (typeof raw == "string") {
      raw = +raw;
    }
    if (!this.values.has(raw as any)) {
      throw theValue.isBadAsIt("is not a valid value");
    }
    return raw as M;
  }
}
