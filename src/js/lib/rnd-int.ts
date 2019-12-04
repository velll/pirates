// get random integer from 0 to N - 1. N is NOT included
function getRndInt(below: number) {
  return Math.floor(Math.random() * below);
}

export { getRndInt };
