# UI Guidelines

## Purpose

Design a practical component workstation: organized toolbox drawers, a focused
editing bench, folders for saved themes, and a picture-frame portfolio wall.
The editor is an everyday development tool, not a marketing landing page.

These guidelines establish behavior and quality expectations. Fields marked
`________` are intentional decisions for the project owner to complete. Do not
silently replace blanks with permanent design choices.

## Design Direction Worksheet

| Decision | Owner's specification |
| --- | --- |
| Product name and logo | ________ |
| Primary audience and daily tasks | ________ |
| Visual references / inspiration links | ________ |
| Desired tone and personality | ________ |
| Light, dark, or both modes | ________ |
| Default density | ________ |
| Preferred toolbox / drawer treatment | ________ |
| Folder appearance | ________ |
| Showcase frame appearance | ________ |
| Designs or patterns to avoid | ________ |

## Workspace and Navigation

Start on the usable workstation. Provide a clear component catalog, canvas,
inspector, and access to presets, themes, datasets, export, and showcase views.
The toolbox metaphor should communicate organization without disguising familiar
controls or requiring users to learn decorative interactions.

- Keep drawer categories consistent: Clickables, Inputs, Layout, Data, and Media.
- Support search, meaningful empty states, and a visible selected item.
- Use collapsible drawers for categories, folder lists for saved collections,
  and responsive frames for projects. Avoid placing cards inside cards.
- Keep frequent commands near the selected component. Separate destructive
  actions from routine edits and provide confirmation when data may be lost.
- Indicate unsaved changes and preserve drafts across navigation or failures.
- Keep editor chrome visually distinct from the component being designed.

| Layout decision | Specification |
| --- | --- |
| Drawer width / collapse behavior | ________ |
| Inspector width / placement | ________ |
| Canvas minimum size | ________ |
| Toolbar height / grouping | ________ |
| Narrow-screen navigation | ________ |
| Default view and retained preferences | ________ |

## Visual Tokens

Use named tokens for interface colors, spacing, typography, borders, elevation,
and motion. Separate workstation tokens from user-created component theme tokens
so editing a theme cannot accidentally restyle the application's controls.

Choose a restrained palette with clear neutral surfaces, readable text, and
distinct semantic feedback. Do not communicate status through color alone.
Workstation controls and text should satisfy WCAG 2.2 AA contrast. A user's
component design may deliberately differ, but show contrast warnings.

| Color token | Value |
| --- | --- |
| Workspace background | ________ |
| Drawer / inspector surface | ________ |
| Preview canvas surface | ________ |
| Primary text / secondary text | ________ / ________ |
| Borders / dividers | ________ |
| Accent / selected state | ________ |
| Focus indicator | ________ |
| Success / warning / error | ________ / ________ / ________ |
| Disabled state | ________ |
| Chart series palette | ________ |

## Typography, Spacing, and Shape

Use a purposeful, legible interface font, with a monospace font for generated
code and data where appropriate. Keep compact panel headings proportionate to
their containers. Avoid negative letter spacing and viewport-scaled font sizes.
Text must wrap or truncate intentionally; essential information must remain
available rather than disappearing behind ellipses.

Use a consistent spacing scale and stable dimensions for toolbars, icons,
handles, and repeated items. Workstation cards should have a radius of 8px or
less unless the eventual design system explicitly requires otherwise. Exported
components may use user-selected radii independent of the workstation.

| Token group | Specification |
| --- | --- |
| Interface font / fallback | ________ |
| Code font / fallback | ________ |
| Font source and loading policy | ________ |
| Body / caption / panel heading sizes | ________ |
| Line heights and weights | ________ |
| Spacing scale | ________ |
| Control heights / icon sizes | ________ |
| Workstation radii / border widths | ________ |
| Elevation / shadow scale | ________ |

## Controls and Editing

Use icons from the chosen icon library for recognizable tools, with tooltips and
accessible names. Use swatches for colors, tabs for views, segmented controls
for modes, toggles/checkboxes for binary choices, and menus for option sets.
Use text or icon-plus-text buttons for clear commands such as saving a preset.

- Every draggable resize operation must have numeric and keyboard alternatives.
- Show selection outlines and handles without obscuring the selected component.
- Keep dimensions bounded and distinguish fixed from responsive sizing.
- Apply inspector changes immediately; group a completed drag into one undo step.
- Keep hover/focus/disabled simulations separate from interactive preview mode.
- Validate fields inline and preserve entered values when a save fails.
- Provide visible copy success/failure feedback and a manual copy fallback.
- Avoid visual changes on hover that resize or shift controls.

| Editing decision | Specification |
| --- | --- |
| Icon library / style | ________ |
| Selection outline / handles | ________ |
| Resize limits / snap increments | ________ |
| Preview device sizes | ________ |
| Undo history behavior | ________ |
| Validation and notification placement | ________ |

## Tables, Charts, and Themes

Tables prioritize scanning and comparison: aligned columns, restrained row
separators, visible headings, clear sort direction, and predictable pagination.
Represent loading, errors, empty results, and missing values explicitly. Do not
use an empty table as the only explanation of a failed data connection.

Charts must have readable labels, legends where needed, distinct series, and an
accessible text or tabular alternative. Show which dataset and mappings drive
each view. Distinguish linked filters from local sorting.

Theme folders should show names and useful token previews. Distinguish inherited
values, local overrides, and snapshots. Preview changes before applying them and
make removal of an override discoverable.

| Data / theme decision | Specification |
| --- | --- |
| Table density / row height | ________ |
| Pagination defaults | ________ |
| Chart defaults / series treatment | ________ |
| Connected-source indicator | ________ |
| Theme preview layout | ________ |
| Override / inheritance indicator | ________ |

## Showcase Wall and Assets

Frames display an inspectable project thumbnail, title, and safe website link.
Keep images at consistent aspect ratios without cropping away the project's
important content. Use placeholders for missing or broken images. Do not assume
external sites allow embedding. Keep portfolio presentation free of editor
controls and private workstation data.

Use relevant visual assets, not generic decorative illustrations. Track image
sources and licensing, supply meaningful alt text when appropriate, and avoid
fetching arbitrary project URLs through the backend.

Frame aspect ratio: ________  Thumbnail source policy: ________

Frame spacing / columns: ________  Image fit / focal point policy: ________

## Responsive Behavior, Accessibility, and Motion

Adapt panels into tabs or drawers on narrow screens rather than shrinking the
whole workstation. Keep controls reachable by touch, preserve logical keyboard
order, and prevent unintended horizontal page scrolling. A large table or code
preview may have its own clearly bounded scroll area.

- Target WCAG 2.2 AA, semantic HTML, visible focus, and accessible labels.
- Manage focus when opening/closing dialogs and restore it to the trigger.
- Do not rely on dragging, hover, color, or pointer precision alone.
- Respect reduced-motion preferences and avoid essential information in motion.
- Use restrained transitions to explain panel changes or saved-state feedback.
- Announce asynchronous results appropriately without repeatedly interrupting.

Breakpoints: ________  Minimum supported viewport: ________

Touch target specification: ________  Motion durations / easing: ________

## UI Review Checklist

- Core workflows work with mouse, keyboard, and touch-compatible controls.
- Text, selection handles, panels, and menus do not overlap or clip.
- Loading, empty, invalid, offline, disabled, and failure states are designed.
- Desktop and mobile layouts preserve access to all essential actions.
- Preview and exported appearance match, including fonts and interaction states.
- Contrast, focus order, accessible names, and chart alternatives are checked.
- Showcase assets load or degrade cleanly; no private data enters presentation.
- Unresolved worksheet decisions are recorded before implementation depends on them.