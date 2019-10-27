import { Ship } from '../game/ship';

const ships = [
  new Ship("galleon", "Spaniards", "Santa Clara", {x: 4, y: 22}, true),
  new Ship("galleon", "Spaniards", "Domingo",     {x: 4, y: 21}),
  new Ship("galleon", "Spaniards", "Idalho",      {x: 2, y: 16}),
  new Ship("brigantine", "Pirates", "Black Hawk",         {x: 6, y: 17}),
  new Ship("brigantine", "Pirates", "Fortune's galley",   {x: 10, y: 12}),
  new Ship("brigantine", "Pirates", "Gentelman Jack",     {x: 28, y: 19}),
  new Ship("brigantine", "Pirates", "HMS Indefatigable",  {x: 37, y: 1}),
  new Ship("brigantine", "Pirates", "Ominous",            {x: 31, y: 20}),
  new Ship("brigantine", "Pirates", "Bullshit squad",     {x: 13, y: 23})
];

export { ships };
