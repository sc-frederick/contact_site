/**
 * Names a project's primary link by where it leads: its hostname, plus its path
 * when the link opens a page below the site's home, such as a product demo.
 */
export function projectLinkLabel(url: string): string {
  const { hostname, pathname } = new URL(url);
  const host = hostname.replace(/^www\./, '');

  if (host === 'npmjs.com') return 'npm';

  if (host === 'github.com') return 'GitHub';

  const path = pathname.replace(/\/$/, '');

  return host + path;
}
