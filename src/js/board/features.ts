import { map } from 'lodash'
import { Cell } from './cell'

function cellify(pair: [number, number]) {
  return new Cell(pair[0], pair[1]);
}

// FIXME: Just mock data. Will need to find where ports and rocks are on the map
let ports: Array<Cell> = map([
 [10, 1],
 [10, 20]
],
cellify);

let rocks:  Array<Cell> = map([
  [12,0],
  [11,0],
  [5,5],
  [7,7]
],
cellify);

enum Types {
  Sea,
  Port,
  Rock
}

interface Features {ports: Array<Cell>, rocks: Array<Cell>}

let features: Features = {
  ports: ports,
  rocks: rocks
}

console.log("here are our features");
console.log(features);

export { features, Features }
