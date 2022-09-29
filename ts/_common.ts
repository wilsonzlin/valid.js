export class ValidationError extends Error {
  constructor(
    readonly path: (string | number)[],
    readonly relativeMsg: string
  ) {
    super(`${path.join(" > ")} ${relativeMsg}`);
  }
}

export class ValuePath {
  constructor(readonly components: (string | number)[]) {}

  andThen(component: string | number) {
    return new ValuePath(this.components.concat(component));
  }

  isBadAsIt(finishTheSentence: string) {
    return new ValidationError(this.components, finishTheSentence);
  }
}

export abstract class Validator<V> {
  protected constructor(
    // An example value allows for runtime reflection and generation of placeholders/initial values.
    readonly example: V,
    // A message shown to the end user for help or on failed validation of a field.
    readonly helper?: string
  ) {}

  public abstract parse(theValue: ValuePath, raw: unknown): V;

  public parseRoot(raw: unknown): V {
    return this.parse(new ValuePath([]), raw);
  }
}

export type Valid<V> = V extends Validator<infer Value> ? Value : never;
