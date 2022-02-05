export function assertUnreachable(arg: never): never {
    throw new Error(`Didn't expect arg [${arg}] to get here`);
}
