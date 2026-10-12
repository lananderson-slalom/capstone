import { Check, Copy, TextSelect } from 'lucide-react';
import { useRef, useState } from 'react';

import type { ComponentId, Draft } from './catalog';
import { exportComponent } from './export-component';

const languages = [
  { key: 'html', label: 'HTML' },
  { key: 'css', label: 'CSS' },
  { key: 'javascript', label: 'JavaScript' },
] as const;
type Language = (typeof languages)[number]['key'];

export function CodeExport({ id, draft }: { id: ComponentId; draft: Draft }) {
  const [language, setLanguage] = useState<Language>('html');
  const [feedback, setFeedback] = useState<{
    code: string;
    message: string;
    failed: boolean;
  } | null>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const output = exportComponent(id, draft);
  const code = output[language];
  const label = languages.find((item) => item.key === language)?.label ?? 'HTML';
  const currentFeedback = feedback?.code === code ? feedback : null;

  function selectCode() {
    textarea.current?.focus();
    textarea.current?.select();
  }

  async function copyCode() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable.');
      await navigator.clipboard.writeText(code);
      setFeedback({ code, message: `${label} copied.`, failed: false });
    } catch {
      selectCode();
      setFeedback({
        code,
        message: 'Clipboard unavailable. Code selected for manual copying.',
        failed: true,
      });
    }
  }

  return (
    <section className="code-export" aria-labelledby="export-heading">
      <h2 id="export-heading">Component code</h2>
      <div className="export-toolbar">
        <div className="export-tabs" role="tablist" aria-label="Export language">
          {languages.map((item, index) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              id={`export-tab-${item.key}`}
              aria-selected={language === item.key}
              aria-controls="export-panel"
              tabIndex={language === item.key ? 0 : -1}
              onClick={() => setLanguage(item.key)}
              onKeyDown={(event) => {
                let next: number;
                switch (event.key) {
                  case 'ArrowRight':
                    next = (index + 1) % languages.length;
                    break;
                  case 'ArrowLeft':
                    next = (index + languages.length - 1) % languages.length;
                    break;
                  case 'Home':
                    next = 0;
                    break;
                  case 'End':
                    next = languages.length - 1;
                    break;
                  default:
                    return;
                }
                event.preventDefault();
                const item = languages[next];
                setLanguage(item.key);
                document.getElementById(`export-tab-${item.key}`)?.focus();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="export-actions">
          <button type="button" onClick={copyCode}>
            {currentFeedback && !currentFeedback.failed ? (
              <Check size={16} aria-hidden="true" />
            ) : (
              <Copy size={16} aria-hidden="true" />
            )}
            Copy {label}
          </button>
          <button type="button" onClick={selectCode} title="Select code">
            <TextSelect size={16} aria-hidden="true" />
            Select code
          </button>
        </div>
      </div>
      <div role="tabpanel" id="export-panel" aria-labelledby={`export-tab-${language}`}>
        <textarea
          ref={textarea}
          aria-label={`${label} code`}
          readOnly
          spellCheck={false}
          wrap="off"
          value={code}
        />
      </div>
      {currentFeedback && (
        <p role={currentFeedback.failed ? 'alert' : 'status'}>{currentFeedback.message}</p>
      )}
    </section>
  );
}
