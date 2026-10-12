import { catalog, defaultDraft } from '../catalog';
import type { ComponentId } from '../catalog';
import { exportComponent } from '../export-component';

describe('standalone component export', () => {
  beforeEach(() => {
    document.body.replaceChildren();
  });
  afterEach(() => {
    document.body.replaceChildren();
  });

  it.each(catalog)('exports valid, deterministic HTML and scoped CSS for $name', (component) => {
    const draft = {
      ...defaultDraft(component),
      textColor: '#ffffff',
      backgroundColor: '#123456',
      borderColor: '#abcdef',
    };
    const output = exportComponent(component.id, draft);
    expect(exportComponent(component.id, draft)).toEqual(output);
    const document = new DOMParser().parseFromString(output.html, 'text/html');
    expect(document.querySelector(`.component-${component.id}`)).not.toBeNull();
    expect(output.css).toContain(`width: ${draft.width}px`);
    expect(output.css).toContain('color: #ffffff');
    expect(output.css).toContain('background-color: #123456');
    expect(output.css).toContain('#abcdef');
    expect(output.html).not.toContain('workstation-browser');
    expect(output.javascript).not.toContain('fetch(');
  });

  it.each(catalog)('escapes labels as data for $name', (component) => {
    const label = '<script>alert("bad")</script> & "quoted"';
    const output = exportComponent(component.id, { ...defaultDraft(component), label });
    const parsed = new DOMParser().parseFromString(output.html, 'text/html');
    expect(parsed.querySelector('script')).toBeNull();
    expect(parsed.body.textContent).toContain(label);
    expect(output.javascript).not.toContain(label);
  });

  it.each(catalog)('provides a fallback for an empty $name label', (component) => {
    const output = exportComponent(component.id, { ...defaultDraft(component), label: '' });
    expect(new DOMParser().parseFromString(output.html, 'text/html').body.textContent).not.toBe('');
  });

  it.each(catalog.filter((component) => component.supportsDisabled))(
    'exports the disabled $name state',
    (component) => {
      const output = exportComponent(component.id, { ...defaultDraft(component), disabled: true });
      expect(
        new DOMParser().parseFromString(output.html, 'text/html').querySelector(':disabled'),
      ).not.toBeNull();
    },
  );

  it('runs the button script independently for multiple exported instances', () => {
    const output = exportComponent('button', defaultDraft(catalog[0]));
    const template = document.createElement('template');
    template.innerHTML = output.html + output.html;
    document.body.append(template.content);
    const initialize = new Function('document', output.javascript);
    initialize(document);
    initialize(document);
    const buttons = document.querySelectorAll('button');
    buttons[0].click();
    buttons[0].click();
    buttons[1].click();
    expect(
      Array.from(document.querySelectorAll('[role="status"]'), (status) => status.textContent),
    ).toEqual(['Clicks: 2', 'Clicks: 1']);
  });

  it('keeps disabled native input borders consistent with the preview', () => {
    const component = catalog.find((item) => item.id === 'input');
    if (!component) throw new Error('Input catalog entry is missing.');
    const output = exportComponent('input', { ...defaultDraft(component), disabled: true });
    expect(output.css).not.toContain('border-style: dashed');
    expect(
      new DOMParser().parseFromString(output.html, 'text/html').querySelector('input:disabled'),
    ).not.toBeNull();
  });

  it('rejects invalid configuration instead of inserting it into CSS', () => {
    const draft = defaultDraft(catalog[0]);
    expect(() => exportComponent('unknown' as ComponentId, draft)).toThrow('Unknown');
    expect(() => exportComponent('button', { ...draft, width: -1 })).toThrow('dimensions');
    expect(() => exportComponent('button', { ...draft, height: 1001 })).toThrow('dimensions');
    expect(() =>
      exportComponent('button', { ...draft, textColor: '#fff; } body { display:none;' }),
    ).toThrow('hex');
  });
});
