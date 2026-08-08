export type Vec = { x: number; y: number };

export function rotateVec(angleDeg: number, x: number, y: number): Vec {
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return { x: x * cos - y * sin, y: x * sin + y * cos };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export type ElementBox = { x: number; y: number; width: number; height: number; rotation: number };

/** Center of the element's bounding box, in percentage-of-canvas units. */
export function boxCenter(box: ElementBox): Vec {
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

const CORNER_SIGN: Record<string, Vec> = {
  nw: { x: -1, y: -1 },
  ne: { x: 1, y: -1 },
  sw: { x: -1, y: 1 },
  se: { x: 1, y: 1 },
};

/**
 * Rotation-aware corner resize, anchored at the opposite corner. All
 * coordinates are in canvas-pixel space (caller converts to/from percent).
 * Returns the new box in the same pixel space.
 *
 * This unprojects the mouse position into the element's local (unrotated)
 * axes before computing width/height — resizing a rotated element without
 * this step causes the handles to visibly drift off the cursor.
 */
export function resizeFromCorner(
  handle: "nw" | "ne" | "sw" | "se",
  boxPx: ElementBox,
  mouse: Vec,
  minSizePx: number,
): ElementBox {
  const sign = CORNER_SIGN[handle];
  const oppositeSign = { x: -sign.x, y: -sign.y };
  const center = boxCenter(boxPx);
  const halfW = boxPx.width / 2;
  const halfH = boxPx.height / 2;

  const oppositeOffset = rotateVec(boxPx.rotation, oppositeSign.x * halfW, oppositeSign.y * halfH);
  const oppositeCorner = { x: center.x + oppositeOffset.x, y: center.y + oppositeOffset.y };

  const dx = mouse.x - oppositeCorner.x;
  const dy = mouse.y - oppositeCorner.y;
  const local = rotateVec(-boxPx.rotation, dx, dy);

  const newWidth = Math.max(sign.x * local.x, minSizePx);
  const newHeight = Math.max(sign.y * local.y, minSizePx);

  const centerOffset = rotateVec(boxPx.rotation, (sign.x * newWidth) / 2, (sign.y * newHeight) / 2);
  const newCenter = { x: oppositeCorner.x + centerOffset.x, y: oppositeCorner.y + centerOffset.y };

  return {
    x: newCenter.x - newWidth / 2,
    y: newCenter.y - newHeight / 2,
    width: newWidth,
    height: newHeight,
    rotation: boxPx.rotation,
  };
}

export function angleFromCenter(center: Vec, point: Vec): number {
  return (Math.atan2(point.y - center.y, point.x - center.x) * 180) / Math.PI;
}

export function normalizeAngle(deg: number): number {
  let a = deg % 360;
  if (a > 180) a -= 360;
  if (a < -180) a += 360;
  return a;
}
