import { Validator, ValuePath } from "./_common";

export class VInstanceOf<T> extends Validator<T> {
  constructor(
    readonly cls: {
      new (...args: any[]): T;
    },
    example?: T,
    helper?: string
  ) {
    super(example as any, helper);
  }

  public parse(theValue: ValuePath, raw: unknown): T {
    if (!(raw instanceof this.cls)) {
      throw theValue.isBadAsIt(`is not an instance of ${this.cls.name}`);
    }
    return raw;
  }
}
