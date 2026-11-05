// Result type returned by boundary functions instead of throwing (convention 008).

export type Result<T, E> = { isOk: true; value: T } | { isOk: false; error: E };
