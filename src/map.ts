import Dict from "@xtjs/lib/js/Dict";
import isPlainObject from "@xtjs/lib/js/isPlainObject";
import map from "@xtjs/lib/js/map";
import { Validator, ValuePath } from "./_common";

export class VObjectMap<V> extends Validator<{ [prop: string]: V }> {
  public constructor(
    readonly values: Validator<V>,
    example: { [prop: string]: V } = {
      key1: values.example,
      key2: values.example,
    },
    helper?: string
  ) {
    super(example, helper);
  }

  parse(theValue: ValuePath, raw: unknown): { [prop: string]: V } {
    if (!isPlainObject(raw)) {
      throw theValue.isBadAsIt("is not a plain object");
    }
    return Object.fromEntries(
      Object.entries(raw).map(([p, v]) => [
        p,
        this.values.parse(theValue.andThen(`Value of ${p}`), v),
      ])
    );
  }
}

export class VMap<K, V> extends Validator<Map<K, V>> {
  public constructor(
    readonly keys: Validator<K>,
    readonly values: Validator<V>,
    example: Map<K, V> = new Map(),
    helper?: string
  ) {
    super(example, helper);
  }

  parse(theValue: ValuePath, raw: unknown): Map<K, V> {
    if (!(raw instanceof Map) && !(raw instanceof Dict)) {
      throw theValue.isBadAsIt("is not a map");
    }
    return new Map(
      map(raw, ([k, v]) => [
        this.keys.parse(theValue.andThen(`Key ${String(k)}`), k),
        this.values.parse(theValue.andThen(`Value of ${String(k)}`), v),
      ])
    );
  }
}

export class VSet<T> extends Validator<Set<T>> {
  public constructor(
    readonly members: Validator<T>,
    example: Set<T> = new Set(),
    helper?: string
  ) {
    super(example, helper);
  }

  parse(theValue: ValuePath, raw: unknown): Set<T> {
    if (!(raw instanceof Set)) {
      throw theValue.isBadAsIt("is not a set");
    }
    return new Set(
      map(raw, (v) =>
        this.members.parse(theValue.andThen(`Value of ${String(v)}`), v)
      )
    );
  }
}
