// Shapes for fetchJson: its options and the serialisable error it returns instead of throwing.

export type FetchJsonErrorKind =
  'aborted' | 'timeout' | 'network' | 'http' | 'content-type' | 'too-large' | 'parse' | 'schema';

export type FetchJsonError = { kind: FetchJsonErrorKind; message: string; status: number | null };

export type FetchJsonOptions = {
  signal?: AbortSignal | undefined;
  timeoutMs?: number;
  maxBytes?: number;
};
