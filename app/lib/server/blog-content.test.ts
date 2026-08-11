import { describe, expect, it } from 'vitest';
import { sanitizeBlogHtml } from './blog-content';

describe('sanitizeBlogHtml', () => {
  it('preserves the supported authored markup', () => {
    expect(sanitizeBlogHtml('<h2>Title</h2><p><strong>Safe</strong> content.</p>')).toBe(
      '<h2>Title</h2><p><strong>Safe</strong> content.</p>',
    );
  });

  it('removes scripts, event handlers, images, and unsafe URL schemes', () => {
    const output = sanitizeBlogHtml(
      '<script>alert(1)</script><img src=x onerror=alert(1)><p onclick=alert(1)>Text</p><a href="javascript:alert(1)">bad</a>',
    );

    expect(output).not.toContain('script');
    expect(output).not.toContain('onerror');
    expect(output).not.toContain('onclick');
    expect(output).not.toContain('javascript:');
    expect(output).not.toContain('<img');
    expect(output).toContain('<p>Text</p>');
  });

  it('adds safe relationship attributes to allowed links', () => {
    expect(sanitizeBlogHtml('<a href="https://example.com">Example</a>')).toContain(
      'rel="noopener noreferrer"',
    );
  });
});
