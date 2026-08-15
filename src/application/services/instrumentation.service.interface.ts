/** Scalar value accepted by application tracing spans. */
export type InstrumentationSpanAttribute = string | number | boolean;

/** Application-owned tracing attributes keyed by telemetry field name. */
export type InstrumentationSpanAttributes = Record<
  string,
  InstrumentationSpanAttribute | undefined
>;

/** Application contract for starting one tracing span. */
export type InstrumentationSpanOptions = {
  name: string;
  op?: string;
  attributes?: InstrumentationSpanAttributes;
};

/** Application contract for instrumenting one server action. */
export type ServerActionInstrumentationOptions = {
  recordResponse?: boolean;
};

/** Records tracing spans without exposing vendor-specific telemetry types. */
export interface IInstrumentationService {
  startSpan<T>(options: InstrumentationSpanOptions, callback: () => T): T;
  instrumentServerAction<T>(
    name: string,
    options: ServerActionInstrumentationOptions,
    callback: () => T
  ): Promise<T>;
}
