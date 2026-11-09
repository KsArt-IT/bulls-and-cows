export const element = (tag, { className, text } = {}, children = []) => {
    const node = document.createElement(tag);
    if (className)
        node.className = className;
    if (text !== undefined)
        node.textContent = text;
    node.append(...children);
    return node;
};
export const optionButton = (label, selected, disabled, onClick) => {
    const button = element('button', { className: 'option', text: label });
    button.type = 'button';
    button.disabled = disabled;
    button.setAttribute('aria-pressed', String(selected));
    button.addEventListener('click', onClick);
    return button;
};
//# sourceMappingURL=dom.js.map