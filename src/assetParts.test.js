import { buildCompositePNG, ASSET_BODIES, ASSET_EYES, ASSET_ACCESSORIES } from './assetParts';

// ── Canvas + Image mocks ───────────────────────────────────────────────────────

let mockDrawImage;
let mockToDataURL;

beforeEach(() => {
  mockDrawImage = jest.fn();
  mockToDataURL = jest.fn(() => 'data:image/png;base64,mocked');

  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    drawImage: mockDrawImage,
    clearRect: jest.fn(),
    fillRect: jest.fn(),
  }));
  HTMLCanvasElement.prototype.toDataURL = mockToDataURL;

  // Make new Image() call onload immediately with a stub image object
  global.Image = class {
    constructor() {
      this.onload  = null;
      this.onerror = null;
    }
    set src(_) {
      if (this.onload) this.onload();
    }
  };
});

afterEach(() => {
  jest.restoreAllMocks();
});

// ── buildCompositePNG ──────────────────────────────────────────────────────────

test('returns a data URL string', async () => {
  const result = await buildCompositePNG({ bodySrc: '/b.png', eyesSrc: null, accSrc: null });
  expect(typeof result).toBe('string');
  expect(result).toMatch(/^data:/);
});

test('draws nothing when all srcs are null', async () => {
  await buildCompositePNG({ bodySrc: null, eyesSrc: null, accSrc: null });
  expect(mockDrawImage).not.toHaveBeenCalled();
});

test('draws exactly once when only body is provided', async () => {
  await buildCompositePNG({ bodySrc: '/b.png', eyesSrc: null, accSrc: null });
  expect(mockDrawImage).toHaveBeenCalledTimes(1);
});

test('draws three times when all layers are provided', async () => {
  await buildCompositePNG({ bodySrc: '/b.png', eyesSrc: '/e.png', accSrc: '/a.png' });
  expect(mockDrawImage).toHaveBeenCalledTimes(3);
});

test('canvas is sized correctly for the default size (160)', async () => {
  const canvasSpy = jest.spyOn(document, 'createElement');
  await buildCompositePNG({ bodySrc: null, eyesSrc: null, accSrc: null });
  const canvas = canvasSpy.mock.results.find(r => r.value instanceof HTMLCanvasElement)?.value;
  expect(canvas.width).toBe(160);
  // non-square: height = 160 * 1.25 = 200
  expect(canvas.height).toBe(200);
});

test('canvas uses provided size', async () => {
  const canvasSpy = jest.spyOn(document, 'createElement');
  await buildCompositePNG({ bodySrc: null, eyesSrc: null, accSrc: null }, 96);
  const canvas = canvasSpy.mock.results.find(r => r.value instanceof HTMLCanvasElement)?.value;
  expect(canvas.width).toBe(96);
  expect(canvas.height).toBe(Math.round(96 * 1.25)); // 120
});

test('body layer is drawn at the bottom of the canvas', async () => {
  const size = 160;
  await buildCompositePNG({ bodySrc: '/b.png', eyesSrc: null, accSrc: null }, size);
  const [, , y, , h] = mockDrawImage.mock.calls[0];
  const H = Math.round(size * 1.25); // 200
  expect(y).toBe(H - 160); // 40 — body is bottom-aligned
  expect(h).toBe(160);
});

test('eyes layer is drawn at top:80 (scaled)', async () => {
  const size = 160;
  await buildCompositePNG({ bodySrc: '/b.png', eyesSrc: '/e.png', accSrc: null }, size);
  const eyesCall = mockDrawImage.mock.calls[1];
  const [, , y] = eyesCall;
  expect(y).toBe(80); // 80 * (160/160) = 80
});

test('accessory layer is drawn at top:-20 (scaled)', async () => {
  const size = 160;
  await buildCompositePNG({ bodySrc: '/b.png', eyesSrc: '/e.png', accSrc: '/a.png' }, size);
  const accCall = mockDrawImage.mock.calls[2];
  const [, , y] = accCall;
  expect(y).toBe(-20); // -20 * (160/160) = -20
});

test('layer positions scale proportionally at size=96', async () => {
  const size = 96;
  const s = size / 160;
  await buildCompositePNG({ bodySrc: '/b.png', eyesSrc: '/e.png', accSrc: '/a.png' }, size);

  const [bodyCall, eyesCall, accCall] = mockDrawImage.mock.calls;
  const H = Math.round(size * 1.25);

  expect(bodyCall[2]).toBeCloseTo(H - 160 * s); // body y
  expect(eyesCall[2]).toBeCloseTo(80 * s);       // eyes y
  expect(accCall[2]).toBeCloseTo(-20 * s);        // accessory y
});

// ── Fallback asset maps ────────────────────────────────────────────────────────

test('ASSET_BODIES fallback has at least one entry', () => {
  expect(Object.keys(ASSET_BODIES).length).toBeGreaterThan(0);
});

test('ASSET_EYES fallback includes a none entry with null src', () => {
  expect(ASSET_EYES.none).toBeDefined();
  expect(ASSET_EYES.none.src).toBeNull();
});

test('ASSET_ACCESSORIES fallback includes a none entry with null src', () => {
  expect(ASSET_ACCESSORIES.none).toBeDefined();
  expect(ASSET_ACCESSORIES.none.src).toBeNull();
});

test('all fallback assets have label and src fields', () => {
  const allAssets = [
    ...Object.values(ASSET_BODIES),
    ...Object.values(ASSET_EYES),
    ...Object.values(ASSET_ACCESSORIES),
  ];
  allAssets.forEach(asset => {
    expect(asset).toHaveProperty('label');
    expect(asset).toHaveProperty('src');
  });
});
