import { Validator, ValuePath } from "./_common";

export class VString extends Validator<string> {
  public constructor(
    readonly minLen: number = 0,
    readonly maxLen: number = Infinity,
    readonly regex?: RegExp,
    helper?: string,
    example?: string
  ) {
    super(example ?? "_".repeat(minLen), helper);
  }

  parse(theValue: ValuePath, raw: unknown): string {
    if (raw == undefined) {
      throw theValue.isBadAsIt("can't be omitted");
    }
    if (typeof raw != "string") {
      throw theValue.isBadAsIt("is not a string");
    }
    if (!raw && this.minLen > 0) {
      throw theValue.isBadAsIt("can't be blank");
    }
    if (raw.length < this.minLen) {
      throw theValue.isBadAsIt("is too short");
    }
    if (raw.length > this.maxLen) {
      throw theValue.isBadAsIt("is too long");
    }
    if (this.regex && !this.regex.test(raw)) {
      throw theValue.isBadAsIt("is not a valid value");
    }
    return raw;
  }
}

export class VTrimmedString extends VString {
  override parse(theValue: ValuePath, raw: unknown): string {
    return super.parse(theValue, typeof raw == "string" ? raw.trim() : raw);
  }
}

// Trims strings, and ensures that they don't contain null/control/surrogate pair/invisible/etc. characters.
// This is especially useful as null/surrogate pair characters aren't allowed in PostgreSQL text values.
export class VHumanString extends VString {
  override parse(theValue: ValuePath, raw: unknown): string {
    if (typeof raw == "string") {
      if (!/^[\P{Other}\r\n]*$/u.test(raw)) {
        throw theValue.isBadAsIt("contains invalid characters");
      }
      return super.parse(theValue, raw.trim());
    }
    return super.parse(theValue, raw);
  }
}
