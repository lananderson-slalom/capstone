import { catalog, defaultDraft, filterCatalog, validDimension } from '../catalog';

describe('catalog helpers', () => {
  it('searches names and categories without case or surrounding-space sensitivity', () => {
    expect(filterCatalog('  INPUTS  ')).toHaveLength(4);
    expect(filterCatalog('table').map((component) => component.id)).toEqual(['table']);
    expect(filterCatalog('missing')).toEqual([]);
    expect(filterCatalog('')).toEqual(catalog);
  });

  it.each(['', ' ', '0', '-1', '1001', '25.5', 'nope'])('rejects invalid dimension %s', (value) => {
    expect(validDimension(value)).toBeNull();
  });

  it.each([24, 140, 1000])('accepts valid dimension %s', (value) => {
    expect(validDimension(String(value))).toBe(value);
  });

  it('creates independent default drafts', () => {
    const draft = defaultDraft(catalog[0]);
    draft.label = 'Edited';
    expect(defaultDraft(catalog[0]).label).toBe('Button');
    expect(draft.disabled).toBe(false);
  });
});
