import hasKey from "@xtjs/lib/js/hasKey";
import isPlainObject from "@xtjs/lib/js/isPlainObject";
import { VStruct } from "./struct";
import { Valid, Validator, ValuePath } from "./_common";

type ValidTagged<
  TagProp extends string,
  Options extends {
    [tag: string]: VStruct<any>;
  }
> = {
  [option in keyof Options]: {
    [tagProp in TagProp]: option;
  } & Valid<Options[option]>;
}[keyof Options];

export class VTagged<
  TagProp extends string,
  Options extends {
    [tag: string]: VStruct<any>;
  }
> extends Validator<ValidTagged<TagProp, Options>> {
  constructor(
    readonly tagProp: TagProp,
    readonly options: Options,
    helper?: string
  ) {
    super({ [tagProp]: "" } as any, helper);
  }

  parse(theValue: ValuePath, raw: unknown): ValidTagged<TagProp, Options> {
    if (!isPlainObject(raw)) {
      throw theValue.isBadAsIt("is not an object");
    }
    const tagged = raw as any;
    if (!hasKey(tagged, this.tagProp)) {
      throw theValue.isBadAsIt(`is missing the ${this.tagProp}`);
    }
    const { [this.tagProp]: tag, ...obj } = tagged;
    const option = this.options[tag];
    if (!option) {
      throw theValue.isBadAsIt(`has an unknown ${this.tagProp}`);
    }
    return {
      ...option.parse(theValue.andThen(`${this.tagProp} "${tag}"`), obj),
      [this.tagProp]: tag,
    } as any;
  }
}
