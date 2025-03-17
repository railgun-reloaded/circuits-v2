// NOTE: @types/brittle is outdated, which calls for this
declare module 'brittle' {
  interface CoercibleAssertion {
    (actual: unknown, expected: unknown, message?: string): void;
    coercively(actual: unknown, expected: unknown, message?: string): void;
  }

  type AnyErrorConstructor = new() => Error

  interface ExceptionAssertion {
    (fn: Promise<unknown> | (() => Promise<unknown>), message?: string): Promise<void>;
    (
      fn: Promise<unknown> | (() => Promise<unknown>),
      error?: RegExp | AnyErrorConstructor,
      message?: string,
    ): Promise<void>;
    (fn: () => unknown, message?: string): void;
    (fn: () => unknown, error?: RegExp | AnyErrorConstructor, message?: string): void;

    all(fn: Promise<unknown> | (() => Promise<unknown>), message?: string): Promise<void>;
    all(
      fn: Promise<unknown> | (() => Promise<unknown>),
      error?: RegExp | AnyErrorConstructor,
      message?: string,
    ): Promise<void>;
    all(fn: () => unknown, message?: string): void;
    all(fn: () => unknown, error?: RegExp | AnyErrorConstructor, message?: string): void;
  }

  interface TeardownOptions {
    order?: number;
    force?: boolean;
  }

  interface Assertion {
    is: CoercibleAssertion;
    not: CoercibleAssertion;
    alike: CoercibleAssertion;
    unlike: CoercibleAssertion;
    ok(value: unknown, message?: string): void;
    absent(value: unknown, message?: string): void;
    pass(message?: string): void;
    fail(message?: string): void;
    exception: ExceptionAssertion;
    execution<T>(fn: (() => T) | Promise<T> | T, message?: string): Promise<number>;
    snapshot(actual: unknown, message?: string): void;
  }

  interface TestOptions {
    timeout?: number;
    solo?: boolean;
    skip?: boolean;
    todo?: boolean;
    stealth?: boolean;
    hook?: boolean;
  }

  interface ConfigureOptions {
    timeout?: number;
    bail?: boolean;
    solo?: boolean;
    unstealth?: boolean;
    source?: boolean;
  }

  interface TestInstance extends Assertion {
    plan(n: number): void;
    teardown(fn: () => unknown | Promise<unknown>, options?: TeardownOptions): void;
    timeout(ms: number): void;
    comment(...message: any[]): void;
    end(): void;
    test: TestFn;
    stealth: StealthFn;
    tmp(): string; // Returns a temporary directory path

    // Promise interface
    then<TResult1 = unknown, TResult2 = never>(
      onfulfilled?: ((value: unknown) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): Promise<TResult1 | TResult2>;
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): Promise<unknown | TResult>;
    finally(onfinally?: (() => void) | undefined | null): Promise<unknown>;
  }

  interface TestFn {
    (name: string, options: TestOptions, callback: (t: TestInstance) => void | Promise<void>): Promise<void>;
    (name: string, callback: (t: TestInstance) => void | Promise<void>): Promise<void>;
    (callback: (t: TestInstance) => void | Promise<void>): Promise<void>;
    (name: string, options: TestOptions): TestInstance;
    (name: string): TestInstance;
    (): TestInstance;
  }

  interface StealthFn {
    (name: string, options: TestOptions, callback: (t: TestInstance) => void | Promise<void>): Promise<void>;
    (name: string, callback: (t: TestInstance) => void | Promise<void>): Promise<void>;
    (callback: (t: TestInstance) => void | Promise<void>): Promise<void>;
  }

  interface Test extends TestFn {
    Test: any; // The Test class
    test: Test;
    solo: TestFn;
    skip: TestFn;
    todo: TestFn;
    hook: TestFn;
    stealth: StealthFn;
    configure(options: ConfigureOptions): void;
    pause(): void;
    resume(): void;
    createTypedArray: any; // For snapshot functionality
  }

  declare const test: Test

  export = test
}
