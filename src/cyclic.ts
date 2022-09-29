import { Valid, Validator, ValuePath } from "./_common";

export class VCyclic<V extends Validator<any>> extends Validator<Valid<V>> {
  constructor(readonly validator: () => V) {
    super(undefined as any);
  }

  parse(theValue: ValuePath, raw: unknown): Valid<V> {
    return this.validator().parse(theValue, raw);
  }
}
