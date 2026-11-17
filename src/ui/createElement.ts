interface ElementOptions {
  className?: string;
  text?: string;
  attributes?: Record<string, string>;
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  { className, text, attributes = {} }: ElementOptions = {},
  ...children: Node[]
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }

  element.append(...children);

  return element;
}
