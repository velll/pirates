const DOM = {
  $: (id: string): HTMLElement => document.getElementById(id),
  $$: (selector: string): HTMLElement => document.querySelector(selector),
  $$$: (selector: string): NodeListOf<HTMLElement> => (
    document.querySelectorAll(selector)
  )
};

export { DOM };
