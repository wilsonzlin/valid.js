import { Validator, ValuePath } from "./_common";

export class VUnknown extends Validator<unknown> {
  public constructor(helper?: string) {
    super(undefined, helper);
  }

  parse(_theValue: ValuePath, raw: unknown): unknown {
    return raw;
  }
}

export const vUnknown = new VUnknown();
