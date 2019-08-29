import { createCanvas, registerFont } from 'canvas';
import R from 'ramda';
import path from 'path';
import fs from 'fs';
import sample from 'lodash.sample';
import crypto from 'crypto';

export function random () {
  return (0.5 - Math.random()) * 2;
}

export function rotate (params: { x: number, y: number }, theta: number) {
  const { x, y } = params;
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  return {
    x: x * cos - y * sin,
    y: x * sin + y * cos
  };
}

export function loadFonts() {
  const regex = /^(.*)-Regular\.ttf$/;
  const fonts = R.map<string, { font: string; file: string }>(font => {
    const files = fs.readdirSync(path.resolve(__dirname, `../fonts/${font}`));

    return {
      font,
      file: `fonts/${font}/${R.find<string>(item => regex.test(item))(files)}`
    };
  })(fs.readdirSync(path.resolve(__dirname, '../fonts')));
  fonts.forEach(({ font, file }) => {
    registerFont(file, { family: font })
  });

  return fonts;
}

let fonts: ReturnType<typeof loadFonts>;
export function generateCaptchaImage(text: string): string {
  if (!fonts) {
    fonts = loadFonts();
  }

  const canvas = createCanvas(160, 60);
  const ctx = canvas.getContext('2d');


  for (let index = 0; index < 4; index +=1 ) {
    const { font } = sample(fonts)!;
    ctx.font = `${Math.floor(60 + random() * 20)}px "${font}"`;
    const { width, actualBoundingBoxAscent } = ctx.measureText(text.charAt(index));
    const theta = random() * 0.25;
    const x = index * 40 + 20 + random() * 10;
    const y = 30 + random() * 10;
    const { x: xx, y: yy } = rotate({ x, y }, -theta);
    ctx.fillStyle = '#44aa44';
    ctx.shadowColor = "#229922";
    ctx.shadowOffsetX = random() * 4;
    ctx.shadowOffsetY = random() * 4;
    ctx.shadowBlur = 4;
    ctx.rotate(theta);
    ctx.fillText(text.charAt(index), xx - width / 2, yy + actualBoundingBoxAscent / 2);
    ctx.rotate(-theta);
  }

  return canvas.toDataURL();
}

export function generateCaptchaString(secret: Buffer, message: string) {
  const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  const hmac = crypto.createHmac('sha256', secret);

  const digest = hmac
    .update(message)
    .update(crypto.randomBytes(4))
    .digest();

  return   R.reduce((accum, value: number) => {
    return `${accum}${pool.charAt(digest.readUInt8(value) % pool.length)}`;
  }, '')(R.range(0, 4));
}

