import { createElement } from 'react';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { App } from '../App';

describe('toolbox', () => {
  beforeEach(() => {
    render(createElement(App));
  });
  afterEach(() => {
    cleanup();
  });

  it('starts with drawers and an interactive button preview', async () => {
    const user = userEvent.setup();
    expect(screen.getByRole('heading', { name: 'Preview: Button' })).toBeInTheDocument();
    expect(screen.getByText('Clickables')).toBeInTheDocument();
    expect(screen.getByText('Media')).toBeInTheDocument();
    const preview = screen.getByRole('region', { name: 'Preview: Button' });
    await user.click(within(preview).getByRole('button', { name: 'Button' }));
    expect(within(preview).getByRole('status')).toHaveTextContent('Clicks: 1');
  });

  it('filters the catalog and recovers from no results', async () => {
    const user = userEvent.setup();
    await user.type(screen.getByRole('searchbox'), 'not found');
    expect(screen.getByText('No components found.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    await user.type(screen.getByRole('searchbox'), 'table');
    await user.click(screen.getByRole('button', { name: 'Table' }));
    expect(screen.getByRole('table', { name: 'Sample inventory' })).toBeInTheDocument();
  });

  it('opens and closes the lid without clearing the search or component draft', async () => {
    const user = userEvent.setup();
    await user.type(screen.getByRole('searchbox'), 'button');
    await user.clear(screen.getByLabelText('Label'));
    await user.type(screen.getByLabelText('Label'), 'Save');
    const lid = screen.getByRole('button', { name: 'Close toolbox lid' });
    expect(lid).toHaveAttribute('aria-expanded', 'true');
    await user.click(lid);
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Label')).toHaveValue('Save');
    const closedLid = screen.getByRole('button', { name: 'Open toolbox lid' });
    expect(closedLid).toHaveAttribute('aria-expanded', 'false');
    await user.click(closedLid);
    expect(screen.getByRole('searchbox')).toHaveValue('button');
    expect(screen.getByLabelText('Label')).toHaveValue('Save');
  });

  it('edits a label, preserves its draft across selection, and resets it', async () => {
    const user = userEvent.setup();
    await user.clear(screen.getByLabelText('Label'));
    await user.type(screen.getByLabelText('Label'), 'Save');
    await user.click(screen.getByRole('button', { name: 'Text input' }));
    expect(screen.getByLabelText('Your name')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Button' }));
    expect(screen.getByLabelText('Label')).toHaveValue('Save');
    await user.click(screen.getByRole('button', { name: 'Reset component' }));
    expect(screen.getByLabelText('Label')).toHaveValue('Button');
  });

  it('disables only the selected preview control', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByLabelText('Disabled'));
    const preview = screen.getByRole('region', { name: 'Preview: Button' });
    expect(within(preview).getByRole('button', { name: 'Button' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Button', pressed: true })).toBeEnabled();
  });

  it('updates preview colors, keeps them per component, and resets them', async () => {
    const user = userEvent.setup();
    fireEvent.change(screen.getByLabelText('Text color'), { target: { value: '#ffffff' } });
    fireEvent.change(screen.getByLabelText('Background color'), { target: { value: '#123456' } });
    fireEvent.change(screen.getByLabelText('Border color'), { target: { value: '#abcdef' } });
    const preview = screen.getByRole('region', { name: 'Preview: Button' });
    expect(within(preview).getByRole('button', { name: 'Button' })).toHaveStyle({
      color: '#ffffff',
      backgroundColor: '#123456',
      borderColor: '#abcdef',
    });
    await user.click(screen.getByRole('button', { name: 'Text input' }));
    expect(screen.getByLabelText('Background color')).toHaveValue('#ffffff');
    await user.click(
      within(screen.getByRole('complementary', { name: 'Toolbox' })).getByRole('button', {
        name: 'Button',
      }),
    );
    expect(screen.getByLabelText('Background color')).toHaveValue('#123456');
    await user.click(screen.getByRole('button', { name: 'Reset component' }));
    expect(screen.getByLabelText('Text color')).toHaveValue('#000000');
    expect(screen.getByLabelText('Background color')).toHaveValue('#ffffff');
    expect(screen.getByLabelText('Border color')).toHaveValue('#000000');
  });

  it.each([
    { name: 'Button', role: 'button' },
    { name: 'Link', role: 'link' },
    { name: 'Text input', role: 'textbox' },
    { name: 'Text area', role: 'textbox' },
    { name: 'Checkbox', role: 'checkbox' },
    { name: 'Select', role: 'combobox' },
    { name: 'Card', role: 'article' },
    { name: 'Table', role: 'table' },
    { name: 'Image', role: 'img' },
  ])('applies the selected palette to $name', async ({ name, role }) => {
    const user = userEvent.setup();
    await user.click(
      within(screen.getByRole('complementary', { name: 'Toolbox' })).getByRole('button', { name }),
    );
    fireEvent.change(screen.getByLabelText('Text color'), { target: { value: '#ffffff' } });
    fireEvent.change(screen.getByLabelText('Background color'), { target: { value: '#123456' } });
    fireEvent.change(screen.getByLabelText('Border color'), { target: { value: '#abcdef' } });
    const preview = screen.getByRole('region', { name: `Preview: ${name}` });
    const control = within(preview).getByRole(role);
    expect(role === 'checkbox' ? control.closest('label') : control).toHaveStyle({
      color: '#ffffff',
      backgroundColor: '#123456',
      borderColor: '#abcdef',
    });
    if (role === 'table') {
      for (const cell of within(preview).getAllByRole('cell')) {
        expect(cell).toHaveStyle({ borderColor: '#abcdef' });
      }
    }
  });

  it('accepts replacement dimensions and prevents invalid preview sizes', async () => {
    const user = userEvent.setup();
    const width = screen.getByLabelText('Width (px)');
    await user.clear(width);
    await user.type(width, '240');
    const preview = screen.getByRole('region', { name: 'Preview: Button' });
    expect(within(preview).getByRole('button', { name: 'Button' })).toHaveStyle({ width: '240px' });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await user.clear(width);
    await user.type(width, '1001');
    expect(screen.getByRole('alert')).toHaveTextContent('24 to 1000');
    expect(width).toHaveAttribute('aria-invalid', 'true');
    const height = screen.getByLabelText('Height (px)');
    await user.clear(height);
    await user.type(height, '80');
    expect(screen.getByRole('alert')).toHaveTextContent('24 to 1000');
    await user.click(screen.getByRole('button', { name: 'Reset component' }));
    expect(screen.getByLabelText('Width (px)')).toHaveValue(140);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders every available component with an accessible preview', async () => {
    const user = userEvent.setup();
    for (const name of ['Link', 'Text area', 'Checkbox', 'Select', 'Card', 'Table', 'Image']) {
      await user.click(screen.getByRole('button', { name }));
      expect(screen.getByRole('heading', { name: `Preview: ${name}` })).toBeInTheDocument();
    }
    expect(screen.getByRole('img', { name: 'Image placeholder' })).toBeInTheDocument();
  });

  it('provides fallback names when preview labels are empty', async () => {
    const user = userEvent.setup();
    for (const name of [
      'Button',
      'Link',
      'Text input',
      'Text area',
      'Checkbox',
      'Select',
      'Card',
      'Table',
      'Image',
    ]) {
      await user.click(
        within(screen.getByRole('complementary', { name: 'Toolbox' })).getByRole('button', {
          name,
        }),
      );
      await user.clear(screen.getByLabelText('Label'));
      expect(screen.getByRole('region', { name: `Preview: ${name}` })).not.toBeEmptyDOMElement();
    }
    expect(screen.getByRole('img', { name: 'Image placeholder' })).toBeInTheDocument();
  });

  it('exports the current draft and copies each language', async () => {
    const user = userEvent.setup();
    const writeText = jest.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    await user.clear(screen.getByLabelText('Label'));
    await user.type(screen.getByLabelText('Label'), 'Save & finish');
    expect((screen.getByLabelText('HTML code') as HTMLTextAreaElement).value).toContain(
      'Save &amp; finish',
    );
    await user.click(screen.getByRole('button', { name: 'Copy HTML' }));
    expect(writeText).toHaveBeenLastCalledWith(expect.stringContaining('Save &amp; finish'));
    expect(screen.getByText('HTML copied.')).toBeInTheDocument();
    await user.type(screen.getByLabelText('Label'), '!');
    expect(screen.queryByText('HTML copied.')).not.toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: 'CSS' }));
    expect((screen.getByLabelText('CSS code') as HTMLTextAreaElement).value).toContain(
      'width: 140px',
    );
    await user.click(screen.getByRole('button', { name: 'Copy CSS' }));
    expect(writeText).toHaveBeenLastCalledWith(expect.stringContaining('.component-button'));
    await user.click(screen.getByRole('tab', { name: 'JavaScript' }));
    await user.click(screen.getByRole('button', { name: 'Copy JavaScript' }));
    expect(writeText).toHaveBeenLastCalledWith(expect.stringContaining('addEventListener'));
  });

  it('selects code for manual copying if clipboard access fails', async () => {
    const user = userEvent.setup();
    jest.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Not allowed'));
    await user.click(screen.getByRole('button', { name: 'Copy HTML' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Code selected for manual copying');
    const code = screen.getByLabelText('HTML code') as HTMLTextAreaElement;
    expect(code).toHaveFocus();
    expect(code.selectionStart).toBe(0);
    expect(code.selectionEnd).toBe(code.value.length);
    await user.click(screen.getByRole('button', { name: 'Select code' }));
    expect(code).toHaveFocus();
  });

  it('supports keyboard navigation between export tabs', async () => {
    const user = userEvent.setup();
    const html = screen.getByRole('tab', { name: 'HTML' });
    html.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'CSS' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'JavaScript' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(html).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'JavaScript' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(html).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(html).toHaveFocus();
  });
});
