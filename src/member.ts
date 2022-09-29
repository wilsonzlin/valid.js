import assertState from "@xtjs/lib/js/assertState";
import { Validator, ValuePath } from "./_common";

export class VMember<M extends string> extends Validator<M> {
  readonly values: Set<string>;

  public constructor(
    members: ReadonlySet<M> | ReadonlyArray<M>,
    helper?: string
  ) {
    const values = new Set(members);
    assertState(values.size > 0, "Set/array has no members");
    super(values.values().next().value, helper);
    this.values = values;
  }

  parse(theValue: ValuePath, raw: unknown): M {
    if (typeof raw != "string" || !this.values.has(raw)) {
      throw theValue.isBadAsIt("is not a valid value");
    }
    return raw as M;
  }
}
