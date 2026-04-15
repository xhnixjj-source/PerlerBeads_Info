declare module "culori" {
  export function parse(color: string): unknown;
  export function differenceCiede2000(
    ...args: unknown[]
  ): (a: unknown, b: unknown) => number;
}
