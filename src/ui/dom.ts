type Props = { readonly className?: string; readonly text?: string };

export const element = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  { className, text }: Props = {},
  children: readonly Node[] = [],
): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  node.append(...children);
  return node;
};

export const optionButton = (
  label: string,
  selected: boolean,
  disabled: boolean,
  onClick: () => void,
): HTMLButtonElement => {
  const button = element('button', { className: 'option', text: label });
  button.type = 'button';
  button.disabled = disabled;
  button.setAttribute('aria-pressed', String(selected));
  button.addEventListener('click', onClick);
  return button;
};
