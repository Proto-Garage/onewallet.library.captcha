import crypto from 'crypto';
import { expect } from 'chai';
import R from 'ramda';

import { generateCaptchaString } from '../../src/lib';

describe('generateCaptchaString', () => {
  const secret = crypto.randomBytes(8);
  const message = 'acc_cefacd298d2e5d08b43001aeb169eea4';

  it('should generate correct captcha string', () => {
    const captcha = generateCaptchaString(secret, message);
    expect(/^[A-Z0-9]{4}$/.test(captcha)).to.be.ok;
  });

  it('should generate unique captcha strings', () => {
    const captchas = R.times(() => generateCaptchaString(secret, message))(100);

    expect(R.uniq(captchas)).to.has.length(100);
  });
});
