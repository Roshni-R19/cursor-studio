import { renderHook, waitFor } from '@testing-library/react';
import useAssets from './useAssets';

const MOCK_MANIFEST = {
  bodies:      [{ key: 'flower', label: 'Flower', src: '/bodies/flower.png' }],
  eyes:        [{ key: 'none', label: 'None', src: null }],
  accessories: [{ key: 'none', label: 'None', src: null }],
};

afterEach(() => {
  jest.restoreAllMocks();
});

test('returns null before the manifest loads', () => {
  global.fetch = jest.fn(() => new Promise(() => {})); // never resolves
  const { result } = renderHook(() => useAssets());
  expect(result.current).toBeNull();
});

test('returns parsed asset maps after a successful fetch', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(MOCK_MANIFEST),
    })
  );

  const { result } = renderHook(() => useAssets());

  await waitFor(() => expect(result.current).not.toBeNull());

  expect(result.current.bodies.flower).toEqual({ label: 'Flower', src: '/bodies/flower.png' });
  expect(result.current.eyes.none).toEqual({ label: 'None', src: null });
  expect(result.current.accessories.none).toEqual({ label: 'None', src: null });
});

test('falls back to hardcoded assets when fetch returns non-ok response', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: false })
  );

  const { result } = renderHook(() => useAssets());

  await waitFor(() => expect(result.current).not.toBeNull());

  // Fallback always includes 'flower' body and 'none' eyes
  expect(result.current.bodies).toHaveProperty('flower');
  expect(result.current.eyes).toHaveProperty('none');
});

test('falls back to hardcoded assets when fetch rejects', async () => {
  global.fetch = jest.fn(() => Promise.reject(new Error('network error')));

  const { result } = renderHook(() => useAssets());

  await waitFor(() => expect(result.current).not.toBeNull());

  expect(result.current.bodies).toHaveProperty('flower');
});

test('asset map entries have label and src fields', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(MOCK_MANIFEST),
    })
  );

  const { result } = renderHook(() => useAssets());
  await waitFor(() => expect(result.current).not.toBeNull());

  Object.values(result.current.bodies).forEach(asset => {
    expect(asset).toHaveProperty('label');
    expect(asset).toHaveProperty('src');
  });
});
