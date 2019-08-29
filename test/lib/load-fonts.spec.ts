import { expect } from 'chai';

import { loadFonts } from '../../src/lib';

describe('loadFonts', () => {
  it('should generate correct captcha string', () => {
    const fonts = loadFonts();

    expect(fonts).to.be.an('array').that.has.length.that.is.greaterThan(0);
  });
});
