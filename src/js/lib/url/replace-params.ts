import { reduce } from 'lodash';

type URLSubsts = Record<string, string>;

// Replaces params in URL as following:
// games/$id/turns/$no with {id: 1, no: 15} becomes
// games/1/turns/15

function replaceURLParams(url: string, substs: URLSubsts) {
  return reduce(substs, (result, value, key) => (
    result.replace(`$${key}`, value)
  ), url);
}

export { URLSubsts, replaceURLParams };
