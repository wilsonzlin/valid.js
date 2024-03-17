import isPlainObject from "@xtjs/lib/js/isPlainObject";
import { VOptional } from "./optional";
import { Valid, Validator, ValuePath } from "./_common";

export class VObject extends Validator<object> {
  public constructor(helper?: string) {
    super({}, helper);
  }

  parse(theValue: ValuePath, raw: unknown): object {
    if (!isPlainObject(raw)) {
      throw theValue.isBadAsIt("is not a plain object");
    }
    return raw;
  }
}

export type VStructSchema = {
  [property: string]: Validator<any>;
};

type OptionalProperties<S extends VStructSchema> = {
  /// We cannot use `undefined extends Valid<S[prop]>` as that breaks some other fields like VJsobSerialised.
  [prop in keyof S]: S[prop] extends VOptional<any> ? prop : never;
}[keyof S];

export type ValidStruct<S extends VStructSchema> = {
  // We can't simply use `property in keyof S` as using `?` on a property will make it `undefined`, even if the type is `never`.
  [property in OptionalProperties<S>]?: Valid<S[property]>;
} & {
  [property in Exclude<keyof S, OptionalProperties<S>>]: Valid<S[property]>;
};

export class VStruct<S extends VStructSchema> extends Validator<
  ValidStruct<S>
> {
  public constructor(
    readonly fields: S,
    helper?: string,
    readonly allowExtraFields = false
  ) {
    super(
      Object.fromEntries(
        Object.entries(fields).map(([n, v]) => [n, v.example] as const)
      ) as any,
      helper
    );
  }

  parse(theValue: ValuePath, raw: any): ValidStruct<S> {
    if (typeof raw != "object" || raw == null) {
      throw theValue.isBadAsIt("is not an object");
    }
    const providedKeys = new Set(Object.keys(raw));
    const validated = {} as any;
    for (const [name, v] of Object.entries<Validator<S[keyof S]>>(
      this.fields
    )) {
      validated[name] = v.parse(theValue.andThen(name), raw[name]);
      providedKeys.delete(name);
    }
    if (this.allowExtraFields) {
      for (const k of providedKeys) {
        validated[k] = raw[k];
      }
    } else if (providedKeys.size) {
      throw theValue.isBadAsIt(
        `has extraneous fields: ${[...providedKeys].sort().join(", ")}`
      );
    }
    return validated;
  }
}

export const partial = <T extends Record<string, Validator<any>>>(
  fields: T
): {
  [F in keyof T]: VOptional<Valid<T[F]>>;
} =>
  Object.fromEntries(
    Object.entries(fields).map(([k, v]) => [k, new VOptional(v)])
  ) as any;
