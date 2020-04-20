import { generateCaptchaImage, generateCaptchaString } from './lib';

export default function generateCaptcha(
  secret: Buffer,
  message: string,
  options?: {
    pool?: string;
    algorithm?: string;
  },
) {
  const value = generateCaptchaString(secret, message, options);

  return {
    value,
    image: generateCaptchaImage(value)
  };
}
