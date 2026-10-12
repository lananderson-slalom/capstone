import { catalog, validDimension } from './catalog';
import type { ComponentId, Draft } from './catalog';

export interface ComponentCode {
  html: string;
  css: string;
  javascript: string;
}

function element<Tag extends keyof HTMLElementTagNameMap>(
  tag: Tag,
  text?: string,
  attributes: Record<string, string> = {},
): HTMLElementTagNameMap[Tag] {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
  return node;
}

export function exportComponent(id: ComponentId, draft: Draft): ComponentCode {
  const definition = catalog.find((component) => component.id === id);
  if (!definition) throw new Error('Unknown component.');
  if (
    validDimension(String(draft.width)) === null ||
    validDimension(String(draft.height)) === null
  ) {
    throw new Error('Invalid component dimensions.');
  }
  if (
    ![draft.textColor, draft.backgroundColor, draft.borderColor].every((color) =>
      /^#[\da-f]{6}$/i.test(color),
    )
  ) {
    throw new Error('Colors must be six-digit hex values.');
  }

  const className = `component-${id}`;
  const label = draft.label || (id === 'image' ? 'Image placeholder' : definition.name);
  const disabled: Record<string, string> = draft.disabled ? { disabled: '' } : {};
  let root: HTMLElement;
  let javascript = '// This component uses native HTML behavior; no JavaScript is required.\n';

  switch (id) {
    case 'button': {
      root = element('div', undefined, { class: 'component-button-demo' });
      root.append(
        element('button', label, { class: className, type: 'button', ...disabled }),
        element('p', 'Clicks: 0', { role: 'status' }),
      );
      javascript = `document.querySelectorAll('.component-button-demo').forEach((demo) => {
  if (demo.dataset.clickCounterReady) return;
  demo.dataset.clickCounterReady = 'true';
  const button = demo.querySelector('button');
  const status = demo.querySelector('[role="status"]');
  let clicks = 0;
  button.addEventListener('click', () => {
    clicks += 1;
    status.textContent = 'Clicks: ' + clicks;
  });
});
`;
      break;
    }
    case 'link':
      root = element('a', label, {
        class: className,
        href: 'https://example.com',
        target: '_blank',
        rel: 'noopener noreferrer',
      });
      break;
    case 'input':
    case 'textarea':
    case 'select': {
      root = element('label', label, { class: `${className}-field` });
      const control =
        id === 'input'
          ? element('input', undefined, { type: 'text', placeholder: 'Enter text', ...disabled })
          : id === 'textarea'
            ? element('textarea', undefined, { placeholder: 'Enter notes', ...disabled })
            : element('select', undefined, disabled);
      control.className = className;
      if (id === 'select') {
        control.append(
          element('option', 'Choose...', { value: '', disabled: '', selected: '' }),
          element('option', 'Option one'),
          element('option', 'Option two'),
        );
      }
      root.append(control);
      break;
    }
    case 'checkbox':
      root = element('label', undefined, { class: className });
      root.append(
        element('input', undefined, { type: 'checkbox', ...disabled }),
        document.createTextNode(label),
      );
      break;
    case 'card':
      root = element('article', undefined, { class: className });
      root.append(element('h3', label), element('p', 'Sample content'));
      break;
    case 'table': {
      root = element('table', undefined, { class: className });
      const head = element('thead');
      const heading = element('tr');
      heading.append(
        element('th', 'Item', { scope: 'col' }),
        element('th', 'Quantity', { scope: 'col' }),
      );
      head.append(heading);
      const body = element('tbody');
      for (const [item, quantity] of [
        ['Buttons', '12'],
        ['Inputs', '8'],
      ]) {
        const row = element('tr');
        row.append(element('td', item), element('td', quantity));
        body.append(row);
      }
      root.append(element('caption', label), head, body);
      break;
    }
    case 'image':
      root = element('div', label, { class: className, role: 'img', 'aria-label': label });
      break;
  }

  let css = `.${className} {
  box-sizing: border-box;
  width: ${draft.width}px;
  min-height: ${draft.height}px;
  max-width: 100%;
  color: ${draft.textColor};
  background-color: ${draft.backgroundColor};
  border: 1px ${id === 'image' ? 'dashed' : 'solid'} ${draft.borderColor};
  border-radius: 0;
  font: 16px sans-serif;
  padding: ${id === 'card' || id === 'image' ? '16px' : id === 'checkbox' || id === 'table' || id === 'link' ? '0' : '8px'};
}
.${className}:focus-visible,
.${className} input:focus-visible {
  outline: 2px solid ${draft.textColor};
  outline-offset: 3px;
}
`;
  if (id === 'input' || id === 'textarea' || id === 'select') {
    css += `.${className}-field {
  display: grid;
  gap: 8px;
  width: fit-content;
  max-width: 100%;
  margin-bottom: 16px;
  color: ${draft.textColor};
  background-color: ${draft.backgroundColor};
  font: 16px sans-serif;
}
`;
  }
  if (id === 'button')
    css += `.${className} { cursor: pointer; overflow-wrap: anywhere; }
.component-button-demo [role="status"] { font: 16px sans-serif; }
`;
  if (draft.disabled && id === 'button')
    css += `.${className}:disabled { cursor: default; border-style: dashed; }
`;
  if (id === 'link')
    css += `.${className} { display: inline-block; }
`;
  if (id === 'checkbox')
    css += `.${className} { display: flex; align-items: center; gap: 8px; }
.${className} input { accent-color: ${draft.borderColor}; }
`;
  if (id === 'card')
    css += `.${className} { overflow-wrap: anywhere; }
.${className} h3 { font-size: 16px; }
`;
  if (id === 'image')
    css += `.${className} { display: grid; place-items: center; overflow-wrap: anywhere; }
`;
  if (id === 'table')
    css += `.${className} { border-collapse: collapse; }
.${className} th, .${className} td { border: 1px solid ${draft.borderColor}; padding: 8px; text-align: left; }
.${className} caption { padding-bottom: 8px; text-align: left; color: ${draft.textColor}; background-color: ${draft.backgroundColor}; }
`;
  return { html: root.outerHTML, css, javascript };
}
