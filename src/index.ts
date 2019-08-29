import { generateCaptchaImage, generateCaptchaString } from './lib';

export default function generateCaptcha(secret: Buffer, message: string) {
  const value = generateCaptchaString(secret, message);

  return {
    value,
    image: generateCaptchaImage(value)
  };
}
