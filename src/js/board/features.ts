import { map } from 'lodash'
import { Cell } from './cell'

let ports: Array<Cell> = map([
 [12, 1, "Newfoundland"], // France
 [5,7, "Maryland peninsula"], // Pirates
 [9, 12, "Bermudas"], // Spain
 [1,16, "Havana"], // Spain
 [3,22, "Porto Bello"], // Spain
 [4,18, "Santiago"], // Spain
 [5,17, "Tortuga"], // pirates
 [7,18, "Santo Domingo"], // Spain
 [11,19, "Guadalupe"], //France
 [11,22, "Trinidad"], //pirates
 [12,23, "Guyana"], //Netherlands
 [36,1, "Lands End"], //pirates
 [35,5, "Bay of Biscay"], // Spain
 [34,8, "Lisbon"], // Portugal
 [27,8, "Azores"], // Portugal
 [31, 11, "Madeira"], // Portugal
 [30, 13, "Canary island"], // Spain
 [27,19, "Cabo Verde island"], // Portugal
 [30, 20, "Cabo Verde"] // Portugal
],
function(point: [number, number, string]){
  return new Cell(point[0], point[1], point[2])
});

let rocks:  Array<Cell> = map([
  [7,0], [8,0], [9,0], [10,0], [11,0],
  [7,1], [9, 1], 
  [6,2], [8,2], [13,2], [14, 2],
  [6,3], [7,3], [8,3], 
  [7,7]
],
function(point: [number, number]){
  return new Cell(point[0], point[1])
});

interface Features {ports: Array<Cell>, rocks: Array<Cell>}

let features: Features = {
  ports: ports,
  rocks: rocks
}

console.log("here are our features");
console.log(features);

export { features, Features }
