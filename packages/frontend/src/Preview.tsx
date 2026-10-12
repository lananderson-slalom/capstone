import { useState } from 'react';

import type { ComponentId, Draft } from './catalog';

export function Preview({ id, draft }: { id: ComponentId; draft: Draft }) {
  const [clicks, setClicks] = useState(0);
  const appearance = {
    color: draft.textColor,
    backgroundColor: draft.backgroundColor,
    borderColor: draft.borderColor,
  };
  const size = {
    ...appearance,
    width: draft.width,
    minHeight: draft.height,
    maxWidth: '100%',
    boxSizing: 'border-box' as const,
  };

  switch (id) {
    case 'button':
      return (
        <div>
          <button style={size} disabled={draft.disabled} onClick={() => setClicks(clicks + 1)}>
            {draft.label || 'Button'}
          </button>
          <p role="status">Clicks: {clicks}</p>
        </div>
      );
    case 'link':
      return (
        <a
          style={{ ...size, display: 'inline-block', border: `1px solid ${draft.borderColor}` }}
          href="https://example.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          {draft.label || 'Link'}
        </a>
      );
    case 'input':
      return (
        <label className="preview-field" style={appearance}>
          {draft.label || 'Text input'}
          <input style={size} disabled={draft.disabled} placeholder="Enter text" />
        </label>
      );
    case 'textarea':
      return (
        <label className="preview-field" style={appearance}>
          {draft.label || 'Text area'}
          <textarea style={size} disabled={draft.disabled} placeholder="Enter notes" />
        </label>
      );
    case 'checkbox':
      return (
        <label
          style={{
            ...size,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            border: `1px solid ${draft.borderColor}`,
          }}
        >
          <input
            type="checkbox"
            disabled={draft.disabled}
            style={{ accentColor: draft.borderColor }}
          />
          {draft.label || 'Checkbox'}
        </label>
      );
    case 'select':
      return (
        <label className="preview-field" style={appearance}>
          {draft.label || 'Select'}
          <select style={size} disabled={draft.disabled} defaultValue="">
            <option value="" disabled>
              Choose...
            </option>
            <option>Option one</option>
            <option>Option two</option>
          </select>
        </label>
      );
    case 'card':
      return (
        <article className="sample-card" style={size}>
          <h3>{draft.label || 'Card'}</h3>
          <p>Sample content</p>
        </article>
      );
    case 'table':
      return (
        <table style={size}>
          <caption style={appearance}>{draft.label || 'Table'}</caption>
          <thead>
            <tr>
              <th scope="col" style={{ borderColor: draft.borderColor }}>
                Item
              </th>
              <th scope="col" style={{ borderColor: draft.borderColor }}>
                Quantity
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ borderColor: draft.borderColor }}>Buttons</td>
              <td style={{ borderColor: draft.borderColor }}>12</td>
            </tr>
            <tr>
              <td style={{ borderColor: draft.borderColor }}>Inputs</td>
              <td style={{ borderColor: draft.borderColor }}>8</td>
            </tr>
          </tbody>
        </table>
      );
    case 'image':
      return (
        <div
          className="image-placeholder"
          role="img"
          aria-label={draft.label || 'Image placeholder'}
          style={size}
        >
          {draft.label || 'Image placeholder'}
        </div>
      );
  }
}
