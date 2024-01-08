import describeType from "@xtjs/lib/js/describeType";
import splitString from "@xtjs/lib/js/splitString";
import { Validator, ValuePath } from "./_common";

// We tried to make the parsed type readonly but it just broke in too many places, especially 3rd party libraries where we don't have control over the types.
export class VArray<V> extends Validator<V[]> {
  public constructor(
    readonly elements: Validator<V>,
    private readonly minLen: number = 0,
    private readonly maxLen: number = Infinity,
    helper?: string
  ) {
    super([elements.example], helper);
  }

  parse(theValue: ValuePath, raw: unknown): V[] {
    if (!Array.isArray(raw)) {
      throw theValue.isBadAsIt(`is not a list (got ${describeType(raw)})`);
    }
    if (raw.length < this.minLen) {
      throw theValue.isBadAsIt("has too few items");
    }
    if (raw.length > this.maxLen) {
      throw theValue.isBadAsIt("has too many items");
    }
    return raw.map((v, i) => this.elements.parse(theValue.andThen(`#${i + 1}`), v));
  }
}

export class VOneNullAsEmptyArray<V> extends VArray<V> {
  public constructor(
    elem: Validator<V>,
    minLen?: number,
    maxLen?: number,
    helper?: string
  ) {
    super(elem, minLen, maxLen, helper);
  }

  override parse(theValue: ValuePath, raw: unknown): V[] {
    if (Array.isArray(raw) && raw.length == 1 && raw[0] === null) {
      return [];
    }
    return super.parse(theValue, raw);
  }
}

export class VOneElementArray<V> extends Validator<V> {
  public constructor(private readonly elem: Validator<V>, helper?: string) {
    super(elem.example, helper);
  }

  override parse(theValue: ValuePath, raw: unknown): V {
    if (!Array.isArray(raw)) {
      throw theValue.isBadAsIt(`is not a list (got ${describeType(raw)})`);
    }
    if (raw.length < 1) {
      throw theValue.isBadAsIt("is empty");
    }
    if (raw.length > 1) {
      throw theValue.isBadAsIt("has more than one item");
    }
    return this.elem.parse(theValue.andThen(`#1`), raw[0]);
  }
}

export class VDelimiterSeparated extends Validator<string[]> {
  public constructor(readonly delimiter: string, helper = ["1", "2"]) {
    super(helper);
  }

  parse(theValue: ValuePath, raw: unknown): string[] {
    if (typeof raw != "string") {
      throw theValue.isBadAsIt("is not a string");
    }
    return splitString(raw, this.delimiter);
  }
}

// Use `readonly` in bound so that `as const` can be used to reinterpret `(X | Y | Z)[]` as `[X, X, Z, Y]`.
export class VTuple<V extends readonly [...unknown[]]> extends Validator<V> {
  public constructor(
    private readonly elems: {
      [i in keyof V]: Validator<V[i]>;
    },
    helper?: string
  ) {
    super(elems.map((e) => e.example) as any, helper);
  }

  parse(theValue: ValuePath, raw: unknown): V {
    if (!Array.isArray(raw)) {
      throw theValue.isBadAsIt("is not an array");
    }
    if (raw.length !== this.elems.length) {
      throw theValue.isBadAsIt("has an incorrect amount of elements");
    }
    return raw.map((v, i) =>
      this.elems[i].parse(theValue.andThen(`[${i}]`), v)
    ) as any;
  }
}
