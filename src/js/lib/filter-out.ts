import { includes } from './includes';

function filterOut<T extends object>(array: T[], undesirables: T[]): T[] {
  return array.filter(el => (
    !includes(undesirables, el)
  ));
}

export { filterOut };
