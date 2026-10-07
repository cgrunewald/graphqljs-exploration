/*
 * Minimal typings for the built-in `node:test` runner. The project's
 * @types/node (v10) predates `node:test`, so declare just what tests use.
 */
declare module 'node:test' {
    type TestFn = () => void | Promise<void>;
    export function describe(name: string, fn: () => void): void;
    export function it(name: string, fn: TestFn): void;
    export function test(name: string, fn: TestFn): void;
}
