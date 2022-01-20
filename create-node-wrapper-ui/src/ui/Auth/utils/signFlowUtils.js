import { sampleSize as _sampleSize } from 'lodash';

const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';

// eslint-disable-next-line import/prefer-default-export
export function randomPassword() {
  return _sampleSize(chars, 24).join('');
}
