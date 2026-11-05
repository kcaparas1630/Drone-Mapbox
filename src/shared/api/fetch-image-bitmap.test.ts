// Tests the binary fetch guards: HTTP status, content type, declared size, and a decoded success.
import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchImageBitmap } from './fetch-image-bitmap';

// Replaces the global fetch with one that resolves to the given response.
function setFetchResponse(body: BodyInit | null, init: ResponseInit = {}): void {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.resolve(new Response(body, init))),
  );
}

describe('fetchImageBitmap', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reports HTTP errors and non-image bodies without decoding them', async () => {
    setFetchResponse('nope', { status: 401, headers: { 'content-type': 'image/png' } });
    await expect(fetchImageBitmap('https://a.test')).resolves.toMatchObject({
      isOk: false,
      error: { kind: 'http', status: 401 },
    });
    setFetchResponse('{}', { headers: { 'content-type': 'application/json' } });
    await expect(fetchImageBitmap('https://a.test')).resolves.toMatchObject({
      isOk: false,
      error: { kind: 'content-type' },
    });
  });

  it('refuses an image declared larger than the cap', async () => {
    setFetchResponse('x', { headers: { 'content-type': 'image/png', 'content-length': '999999' } });
    await expect(fetchImageBitmap('https://a.test', { maxBytes: 10 })).resolves.toMatchObject({
      isOk: false,
      error: { kind: 'too-large' },
    });
  });

  it('decodes an image without colour conversion', async () => {
    const bitmap = { width: 256, height: 256 };
    const decode = vi.fn(() => Promise.resolve(bitmap));
    vi.stubGlobal('createImageBitmap', decode);
    setFetchResponse('png-bytes', { headers: { 'content-type': 'image/png' } });
    await expect(fetchImageBitmap('https://a.test')).resolves.toEqual({
      isOk: true,
      value: bitmap,
    });
    expect(decode).toHaveBeenCalledWith(expect.any(Blob), {
      colorSpaceConversion: 'none',
      premultiplyAlpha: 'none',
    });
  });
});
