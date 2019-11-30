/*
A straightforward wrapper for manually resolving promises.

This doesn't really achieve anything except organizing the code
a little more neatly — not requiring you to put everything in
a constructor of a promise.

.fulfil() resolves the promise
.dismiss() rejects it
*/

class Pledge<T> {
  public fulfil: (value: T) => void;
  public dismiss: (value: T) => void;

  private promise: Promise<T>;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.fulfil = resolve;
      this.dismiss = reject;
    });
  }

  public get() {
    return this.promise;
  }
}

export { Pledge };
