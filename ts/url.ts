import decodeUrlEncoded from "@xtjs/lib/js/decodeUrlEncoded";
import { Validator, ValuePath } from "./_common";

export const normalisePathnameComponents = (raw: string) =>
  raw
    .split("/")
    .filter((c) => c)
    .map((c) => decodeUrlEncoded(c));

// Remove any leading or trailing slashes, and normalise slashes.
export const normalisePathname = (raw: string) =>
  normalisePathnameComponents(raw).join("/");

export const maybeParseUrl = (
  raw: string,
  {
    removeQuery,
    removeHash,
  }: {
    removeQuery?: boolean;
    removeHash?: boolean;
  } = {}
) => {
  let url;
  try {
    url = new URL(raw);
  } catch {
    return undefined;
  }
  if (!["http:", "https:"].includes(url.protocol)) {
    return undefined;
  }
  if (removeQuery) {
    url.search = "";
  }
  if (removeHash) {
    url.hash = "";
  }
  return url.toString();
};

// Don't use URL return type; it's inconvenient and isn't supported by JSOB.
export class VUrl extends Validator<string> {
  public constructor(example: string = "https://example.org", helper?: string) {
    super(example, helper);
  }

  parse(theValue: ValuePath, raw: unknown) {
    if (typeof raw != "string") {
      throw theValue.isBadAsIt("is not a URL");
    }
    const parsed = maybeParseUrl(raw);
    if (parsed === undefined) {
      throw theValue.isBadAsIt("is not a URL");
    }
    return parsed;
  }
}

// NOTE: A path includes the pathname and query. This doesn't allow for hash components.
export class VUrlPath extends Validator<string> {
  public constructor(
    readonly options: {
      removeQuery?: boolean;
    } = {},
    example: string = "/url/path?q=1",
    helper?: string
  ) {
    super(example, helper);
  }

  parse(theValue: ValuePath, raw: unknown): string {
    if (
      typeof raw != "string" ||
      // Check that value starts with at most one slash. If we don't, someone could redirect to a different domain (e.g. `//malicious.com`), which is extra dangerous when we attach secret state.
      raw.startsWith("//") ||
      // This regex must check for exactly zero or one `?` so that query extraction is correct.
      !/^\/[\/a-zA-Z0-9-._~!$&'()*+,;=:@%]*\??[a-zA-Z0-9-._~%=&\[\]]*$/.test(
        raw
      )
    ) {
      throw theValue.isBadAsIt("is not a URL path");
    }
    let parsed = raw;
    const queryPos = raw.indexOf("?");
    if (this.options.removeQuery && queryPos > -1) {
      parsed = parsed.slice(0, queryPos);
    }
    return parsed;
  }
}
