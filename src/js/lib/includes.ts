import { findIndex, isMatch } from 'lodash';

function includes<T extends object>(array: T[], obj: T): boolean {
  return findIndex(array, (element) => {
    return isMatch(element, obj);
  }) > -1;
}

export { includes };
