# Standalone Code Export

## Current Output

Select and edit a component, then use Component code beneath its preview.
The HTML, CSS, and JavaScript tabs update from its current draft. Each tab has
a copy button and a read-only code field; Select code highlights the current
output for manual copying. Clipboard failure also selects the output and reports
the failure without discarding the design.

This export is framework-independent browser code, not Java or React/TypeScript.
React remains the workstation's implementation framework; typed React exports
are still planned.

## Using the Snippets

1. Put the HTML into your page's body or an appropriate HTML template.
2. Put the CSS into your stylesheet, or a style element in the document head.
3. Put JavaScript into a script loaded after the component HTML. An external
   script with `defer` also works. Do not paste JavaScript into a stylesheet.
4. Replace sample links, options, card text, and table rows as needed.

Native inputs, checkboxes, selects, and links do not need custom JavaScript to
work. Their JavaScript tab states that explicitly. The button includes its demo
click counter, scoped independently to each exported instance; replace that
handler with your application's action when integrating it.

Exports include configured labels, dimensions, colors, and disabled state. User
labels are escaped as HTML data, and colors/dimensions are validated before CSS
generation. Transient preview input values and click counts are not exported.
No workstation API, React runtime, toolkit font, or external assets are required.

## Boundaries

- Width shrinks to fit its container; height is a minimum, so content may expand.
- CSS uses component-type class names. Different styles of the same component
  type on one page need distinct names or parent scopes to avoid collisions.
- Host CSS can override a snippet. Test it in your target application and adjust
  specificity deliberately rather than relying on global style resets.
- Paste HTML into an HTML template, not directly into JSX; JSX conversion and
  React event handling are outside the current export format.
- Tables are static samples, not sortable or connected to datasets yet.
- Images are labeled placeholders; no actual project image is exported.
- Browser-native widgets may look different across operating systems.

## Verification

Jest checks deterministic generation, valid markup, escaping, disabled states,
all component types, live updates, copy feedback, and failure handling.
The Chromium POM journey copies all three outputs, renders an exported button
in an isolated page, verifies its dimensions/colors/click behavior, and checks
manual selection when the clipboard is unavailable.

## Wood Asset

The inspector uses a locally bundled diffuse image from
[Wood Table 001 by Poly Haven](https://polyhaven.com/a/wood_table_001), distributed
under [CC0](https://polyhaven.com/license). It is stored at
[packages/frontend/src/worktable-wood.jpg](../packages/frontend/src/worktable-wood.jpg)
and served with the application, so the wooden surface does not depend on an
external image request. The exported components do not include this workstation asset.
