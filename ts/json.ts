import UnreachableError from "@xtjs/lib/js/UnreachableError";
import { Valid, Validator, ValuePath } from "./_common";

export type JsonValue =
  | boolean
  | null
  | number
  | string
  | {
      [prop: string]: JsonValue;
    }
  | JsonValue[];

export const isJsonValue = (val: unknown): val is JsonValue => {
  switch (typeof val) {
    case "object":
      if (val === null) {
        return true;
      }
      if (Array.isArray(val)) {
        return val.every(isJsonValue);
      }
      return Object.values(val).every(isJsonValue);
    case "boolean":
    case "number":
    case "string":
      return true;
    case "undefined":
    case "function":
    case "symbol":
    case "bigint":
      return false;
    default:
      throw new UnreachableError();
  }
};

export class VJsonString extends Validator<string> {
  public constructor(example: string = "{}", helper?: string) {
    super(example, helper);
  }

  parse(theValue: ValuePath, raw: unknown) {
    if (typeof raw != "string") {
      throw theValue.isBadAsIt("is not JSON");
    }
    try {
      JSON.parse(raw);
    } catch (e) {
      throw theValue.isBadAsIt("is invalid JSON");
    }
    return raw;
  }
}

export class VJsonSerialisableValue extends Validator<JsonValue> {
  public constructor(
    example: JsonValue = { x: 3.14, y: "e" },
    helper?: string
  ) {
    super(example, helper);
  }

  parse(theValue: ValuePath, raw: unknown): JsonValue {
    if (!isJsonValue(raw)) {
      throw theValue.isBadAsIt("cannot be serialised into JSON");
    }
    return raw;
  }
}

export class VJsonSerialisedValue<
  // Allow any value as we can technically parse from a JSON value to a non-JSON value.
  V extends Validator<any>
> extends Validator<Valid<V>> {
  public constructor(
    readonly value: V,
    example: string = "{}",
    helper?: string
  ) {
    super(example as any, helper);
  }

  parse(theValue: ValuePath, raw: unknown): Valid<V> {
    if (typeof raw != "string") {
      throw theValue.isBadAsIt("is not JSON");
    }
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      throw theValue.isBadAsIt("is invalid JSON");
    }
    return this.value.parse(theValue, parsed) as any;
  }
}
