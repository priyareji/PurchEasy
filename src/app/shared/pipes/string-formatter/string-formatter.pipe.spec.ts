import { StringFormatterPipe } from './string-formatter.pipe';

describe('StringFormatterPipe', () => {
  it('create an instance', () => {
    const pipe = new StringFormatterPipe();
    expect(pipe).toBeTruthy();
  });
});
