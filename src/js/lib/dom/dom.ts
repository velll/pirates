class DOM {
  public static $(id: string): HTMLElement {
   return document.getElementById(id);
  }

  public static $$(klass: string): HTMLCollectionOf<Element> {
    return document.getElementsByClassName(klass);
  }
}

export { DOM };
