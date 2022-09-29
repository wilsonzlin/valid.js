import { Validator, ValuePath } from "./_common";

export class VEmail extends Validator<string> {
  public constructor(helper?: string) {
    super("me@example.org", helper);
  }

  parse(theValue: ValuePath, raw: unknown): string {
    if (raw == undefined) {
      throw theValue.isBadAsIt("can't be omitted");
    }
    if (typeof raw != "string") {
      throw theValue.isBadAsIt("is not a string");
    }
    // https://medium.com/hackernoon/the-100-correct-way-to-validate-email-addresses-7c4818f24643.
    if (!raw.includes("@")) {
      throw theValue.isBadAsIt("is not a valid email");
    }
    return raw.trim();
  }
}
