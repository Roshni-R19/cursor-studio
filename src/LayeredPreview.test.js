import { render, screen } from '@testing-library/react';
import LayeredPreview from './LayeredPreview';

const BODY_SRC = '/bodies/test-body.png';
const EYES_SRC = '/eyes/test-eyes.png';
const ACC_SRC  = '/accessories/test-acc.png';

test('renders nothing when no srcs provided', () => {
  const { container } = render(
    <LayeredPreview bodySrc={null} eyesSrc={null} accSrc={null} />
  );
  expect(container.querySelectorAll('img')).toHaveLength(0);
});

test('renders only body img when only bodySrc is set', () => {
  const { container } = render(
    <LayeredPreview bodySrc={BODY_SRC} eyesSrc={null} accSrc={null} />
  );
  const imgs = container.querySelectorAll('img');
  expect(imgs).toHaveLength(1);
  expect(imgs[0]).toHaveAttribute('src', BODY_SRC);
});

test('renders all three layers when all srcs provided', () => {
  const { container } = render(
    <LayeredPreview bodySrc={BODY_SRC} eyesSrc={EYES_SRC} accSrc={ACC_SRC} />
  );
  const imgs = container.querySelectorAll('img');
  expect(imgs).toHaveLength(3);
  const srcs = Array.from(imgs).map(i => i.getAttribute('src'));
  expect(srcs).toContain(BODY_SRC);
  expect(srcs).toContain(EYES_SRC);
  expect(srcs).toContain(ACC_SRC);
});

test('container dimensions scale with size prop', () => {
  const size = 200;
  const { container } = render(
    <LayeredPreview bodySrc={BODY_SRC} eyesSrc={null} accSrc={null} size={size} />
  );
  const wrapper = container.firstChild;
  expect(wrapper).toHaveStyle({ width: `${size}px` });
  // height = size * 1.25
  expect(wrapper).toHaveStyle({ height: `${Math.round(size * 1.25)}px` });
});

test('uses default size of 160 when size prop is omitted', () => {
  const { container } = render(
    <LayeredPreview bodySrc={BODY_SRC} eyesSrc={null} accSrc={null} />
  );
  const wrapper = container.firstChild;
  expect(wrapper).toHaveStyle({ width: '160px' });
  expect(wrapper).toHaveStyle({ height: '200px' });
});

test('accessory is positioned above body (negative top offset)', () => {
  const { container } = render(
    <LayeredPreview bodySrc={BODY_SRC} eyesSrc={EYES_SRC} accSrc={ACC_SRC} size={160} />
  );
  const imgs = container.querySelectorAll('img');
  // Third img is the accessory layer
  const accImg = imgs[2];
  // top: -20 * s where s = 160/160 = 1 → top: -20px
  expect(accImg).toHaveStyle({ top: '-20px' });
});

test('images are not draggable', () => {
  const { container } = render(
    <LayeredPreview bodySrc={BODY_SRC} eyesSrc={EYES_SRC} accSrc={ACC_SRC} />
  );
  container.querySelectorAll('img').forEach(img => {
    expect(img).toHaveAttribute('draggable', 'false');
  });
});
