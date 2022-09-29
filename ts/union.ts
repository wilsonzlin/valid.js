import { ValidationError, Validator, ValuePath } from "./_common";

// WARNING: This is slow, use sparingly.
export class VUnion<A, B> extends Validator<A | B> {
  public constructor(
    readonly a: Validator<A>,
    readonly b: Validator<B>,
    helper?: string
  ) {
    super(a.example, helper);
  }

  parse(theValue: ValuePath, raw: unknown): A | B {
    try {
      return this.a.parse(theValue, raw);
    } catch (e) {
      if (e instanceof ValidationError) {
        return this.b.parse(theValue, raw);
      }
      throw e;
    }
  }
}
