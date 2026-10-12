import { useState } from 'react';

import { catalog, categories, defaultDraft, filterCatalog, validDimension } from './catalog';
import type { ComponentId, Draft } from './catalog';
import { CodeExport } from './CodeExport';
import { Preview } from './Preview';

function DimensionField({
  field,
  value,
  error,
  onChange,
}: {
  field: 'width' | 'height';
  value: number;
  error: string;
  onChange: (value: string) => void;
}) {
  const [input, setInput] = useState(String(value));
  return (
    <label className="field">
      {field === 'width' ? 'Width (px)' : 'Height (px)'}
      <input
        type="number"
        min={24}
        max={1000}
        value={input}
        aria-describedby={error ? 'dimension-error' : undefined}
        aria-invalid={validDimension(input) === null}
        onChange={(event) => {
          setInput(event.target.value);
          onChange(event.target.value);
        }}
      />
    </label>
  );
}

export function App() {
  const [lidOpen, setLidOpen] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<ComponentId>('button');
  const [drafts, setDrafts] = useState<Partial<Record<ComponentId, Draft>>>({});
  const [errors, setErrors] = useState<Partial<Record<'width' | 'height', string>>>({});
  const error = Object.values(errors).find(Boolean) ?? '';
  const [resetCount, setResetCount] = useState(0);
  const selected = catalog.find((component) => component.id === selectedId) ?? catalog[0];
  const draft = drafts[selectedId] ?? defaultDraft(selected);
  const results = filterCatalog(query);
  const changed = JSON.stringify(draft) !== JSON.stringify(defaultDraft(selected));

  function updateDraft(patch: Partial<Draft>) {
    setDrafts((previous) => ({ ...previous, [selectedId]: { ...draft, ...patch } }));
  }

  function updateDimension(field: 'width' | 'height', value: string) {
    const dimension = validDimension(value);
    if (dimension === null) {
      setErrors((previous) => ({
        ...previous,
        [field]: 'Dimensions must be whole numbers from 24 to 1000 pixels.',
      }));
      return;
    }
    setErrors((previous) => ({ ...previous, [field]: '' }));
    updateDraft({ [field]: dimension });
  }

  return (
    <>
      <header className="app-header">
        <h1>Component Workstation</h1>
        <span>Toolbox</span>
      </header>
      <main className="workspace">
        <aside className="toolbox" aria-labelledby="toolbox-heading">
          <h2 id="toolbox-heading" className="chest-heading">
            <button
              type="button"
              className="chest-lid"
              aria-label={lidOpen ? 'Close toolbox lid' : 'Open toolbox lid'}
              aria-expanded={lidOpen}
              aria-controls="chest-search-tray"
              onClick={() => setLidOpen((previous) => !previous)}
            >
              <span className="lid-name">Toolbox</span>
              <span className="lid-state" aria-hidden="true">
                {lidOpen ? 'Close lid' : 'Open lid'}
              </span>
            </button>
          </h2>
          <div className="chest-body">
            <div className="chest-search-tray" id="chest-search-tray" hidden={!lidOpen}>
              <label className="field">
                Search components
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              {query && (
                <button type="button" onClick={() => setQuery('')}>
                  Clear search
                </button>
              )}
            </div>
            <div className="chest-front">
              <span role="status">{results.length} components</span>
              <span className="chest-lock" aria-hidden="true" />
            </div>
            <div className="chest-drawers">
              {results.length === 0 && <p className="empty-drawer">No components found.</p>}
              {categories.map((category) => {
                const items = results.filter((component) => component.category === category);
                if (query && items.length === 0) return null;
                return (
                  <details key={category} className="chest-drawer" open>
                    <summary>
                      <span className="drawer-front">
                        <span className="drawer-nameplate">{category}</span>
                        <span className="drawer-count" aria-hidden="true">
                          {items.length}
                        </span>
                      </span>
                      <span className="drawer-handle" aria-hidden="true" />
                    </summary>
                    <ul className="drawer-tray">
                      {items.map((component) => (
                        <li key={component.id}>
                          <button
                            type="button"
                            aria-pressed={selectedId === component.id}
                            onClick={() => {
                              setSelectedId(component.id);
                              setErrors({});
                            }}
                          >
                            {component.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </details>
                );
              })}
            </div>
            <div className="chest-base" aria-hidden="true" />
          </div>
        </aside>
        <div className="workbench">
          <section aria-labelledby="preview-heading">
            <div className="section-heading">
              <h2 id="preview-heading">Preview: {selected.name}</h2>
              <span>{changed ? 'Modified draft' : 'Default'}</span>
            </div>
            <div className="canvas">
              <Preview key={`${selectedId}-${resetCount}`} id={selectedId} draft={draft} />
            </div>
          </section>
          <CodeExport key={`${selectedId}-${resetCount}`} id={selectedId} draft={draft} />
        </div>
        <aside
          key={`${selectedId}-${resetCount}`}
          className="inspector"
          aria-labelledby="inspector-heading"
        >
          <h2 id="inspector-heading">Inspector</h2>
          <p>{selected.name}</p>
          <label className="field">
            Label
            <input
              value={draft.label}
              maxLength={200}
              onChange={(event) => updateDraft({ label: event.target.value })}
            />
          </label>
          <DimensionField
            field="width"
            value={draft.width}
            error={error}
            onChange={(value) => updateDimension('width', value)}
          />
          <DimensionField
            field="height"
            value={draft.height}
            error={error}
            onChange={(value) => updateDimension('height', value)}
          />
          {error && (
            <p role="alert" id="dimension-error">
              {error}
            </p>
          )}
          <fieldset className="color-controls">
            <legend>Colors</legend>
            {(
              [
                { field: 'textColor', label: 'Text color' },
                { field: 'backgroundColor', label: 'Background color' },
                { field: 'borderColor', label: 'Border color' },
              ] as const
            ).map(({ field, label }) => (
              <div key={field} className="color-field">
                <label htmlFor={`component-${field}`}>{label}</label>
                <span className="color-value">
                  <input
                    id={`component-${field}`}
                    type="color"
                    value={draft[field]}
                    onChange={(event) => updateDraft({ [field]: event.target.value })}
                  />
                  <span aria-hidden="true">{draft[field].toUpperCase()}</span>
                </span>
              </div>
            ))}
          </fieldset>
          {selected.supportsDisabled && (
            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={draft.disabled}
                onChange={(event) => updateDraft({ disabled: event.target.checked })}
              />
              Disabled
            </label>
          )}
          <button
            type="button"
            disabled={!changed && !error}
            onClick={() => {
              setDrafts((previous) => ({ ...previous, [selectedId]: defaultDraft(selected) }));
              setErrors({});
              setResetCount((previous) => previous + 1);
            }}
          >
            Reset component
          </button>
        </aside>
      </main>
    </>
  );
}
