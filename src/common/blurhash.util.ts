import sharp from 'sharp';
import { encode } from 'blurhash';

export async function generateBlurhash(decoded: sharp.Sharp): Promise<string> {
  const { data, info } = await decoded
    .clone()
    .raw()
    .ensureAlpha()
    .resize(32, 32, { fit: 'inside' })
    .toBuffer({ resolveWithObject: true });

  return encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4);
}
