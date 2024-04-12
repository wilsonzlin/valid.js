import { Validator, ValuePath } from "./_common";

export class VDate extends Validator<Date> {
  public constructor(helper?: string) {
    super(new Date(Date.UTC(2010, 4, 19, 16, 30, 45, 123)), helper);
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

export class VUnixSecTimestamp extends Validator<Date> {
  public constructor(helper?: string) {
    super(new Date(Date.UTC(2010, 4, 19, 16, 30, 45, 123)), helper);
  }

  parse(theValue: ValuePath, raw: unknown): Date {
    if (typeof raw != "number") {
      throw theValue.isBadAsIt("is not a UNIX timestamp in seconds");
    }
    const parsed = new Date(raw * 1000);
    if (isNaN(parsed.getTime())) {
      throw theValue.isBadAsIt(`is not a valid timestamp`);
    }
    return parsed;
  }
}

export class VUnixMsTimestamp extends Validator<Date> {
  public constructor(helper?: string) {
    super(new Date(Date.UTC(2010, 4, 19, 16, 30, 45, 123)), helper);
  }

  parse(theValue: ValuePath, raw: unknown): Date {
    if (typeof raw != "number") {
      throw theValue.isBadAsIt("is not a UNIX timestamp in milliseconds");
    }
    const parsed = new Date(raw);
    if (isNaN(parsed.getTime())) {
      throw theValue.isBadAsIt(`is not a valid timestamp`);
    }
    return parsed;
  }
}
