import { Validator, ValuePath } from "./_common";

const EXAMPLE_DT = new Date(Date.UTC(2010, 4, 19, 16, 30, 45, 123));

export class VJSDate extends Validator<Date> {
  public constructor(helper?: string) {
    super(EXAMPLE_DT, helper);
  }

  parse(theValue: ValuePath, raw: unknown): Date {
    if (raw instanceof Date) {
      return raw;
    }
    // We don't support numbers as it's ambiguous whether it's UNIX epoch seconds (more common) or milliseconds (JS).
    if (typeof raw != "string") {
      throw theValue.isBadAsIt("is not an ISO 8601 date and time");
    }
    const parsed = new Date(raw);
    if (isNaN(parsed.getTime())) {
      throw theValue.isBadAsIt(`is not a valid timestamp`);
    }
    return parsed;
  }
}
