import { Validator, ValuePath } from "./_common";

export class VBoolean extends Validator<boolean> {
  public constructor(helper?: string) {
    super(true, helper);
  }

  parse(theValue: ValuePath, raw: unknown): boolean {
    if (typeof raw == "boolean") {
      return raw;
    }
    if (typeof raw == "number") {
      if (raw == 0) {
        return false;
      }
      if (raw == 1) {
        return true;
      }
      throw theValue.isBadAsIt(
        "is not a valid boolean number representation (0 or 1)"
      );
    }
    if (typeof raw == "string") {
      if (raw === "true") {
        return true;
      }
      if (raw === "false") {
        return false;
      }
      throw theValue.isBadAsIt("is not a valid boolean (true or false)");
    }
    throw theValue.isBadAsIt("is not a boolean");
  }
}
