import decodeBase64 from "@xtjs/lib/js/decodeBase64";
import { Validator, ValuePath } from "./_common";

export class VBytes extends Validator<Uint8Array> {
  public constructor(
    readonly minLen = 0,
    readonly maxLen = Infinity,
    readonly prefix = Array<number>(),
    helper?: string
  ) {
    super(new Uint8Array(Array(minLen).fill(0)), helper);
  }

  parse(theValue: ValuePath, raw: unknown) {
    if (!(raw instanceof Uint8Array)) {
      throw theValue.isBadAsIt("is not a byte array");
    }
    if (raw.length < this.minLen) {
      throw theValue.isBadAsIt("is too short");
    }
    if (raw.length > this.maxLen) {
      throw theValue.isBadAsIt("is too long");
    }
    if (this.prefix.length && !this.prefix.every((exp, i) => raw[i] === exp)) {
      throw theValue.isBadAsIt("does not start with a valid prefix");
    }
    return raw;
  }
}

export class VBase64Encoded<V> extends Validator<V> {
  public constructor(readonly bytesValidator: Validator<V>, helper?: string) {
    super(bytesValidator.example, helper);
  }

  parse(theValue: ValuePath, raw: unknown) {
    if (typeof raw != "string") {
      throw theValue.isBadAsIt("is not a Base64 string");
    }
    // Allow spaces as some programs (**cough** PostgreSQL) format Base64 values.
    if (!/^[a-zA-Z0-9+\/=\s]*$/.test(raw)) {
      throw theValue.isBadAsIt("is not a valid Base64 string");
    }
    return this.bytesValidator.parse(theValue, decodeBase64(raw));
  }
}
