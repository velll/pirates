function assert(condition: boolean, message: string) {
  if (!condition) {
    throw Error(message);
  }
}

export { assert };
