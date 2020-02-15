class LockableState {
  public locked = false;

  public lock() {
    this.locked = true;
  }

  public unlock() {
    this.locked = false;
  }
}

export { LockableState };
