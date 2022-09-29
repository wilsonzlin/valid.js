import Dict from "@xtjs/lib/js/Dict";
import { Validator, ValuePath } from "./_common";

export class VDict<K, V> extends Validator<Dict<K, V>> {
  public constructor(
    readonly key: Validator<K>,
    readonly value: Validator<V>,
    helper?: string
  ) {
    super(new Dict([[key.example, value.example]]), helper);
  }

  parse(theValue: ValuePath, raw: unknown) {
    if (!(raw instanceof Dict)) {
      throw theValue.isBadAsIt("is not a Dict");
    }
    for (const [key, value] of raw) {
      this.key.parse(theValue.andThen("a key"), key);
      this.value.parse(theValue.andThen("a value"), value);
    }
    return raw;
  }
}
