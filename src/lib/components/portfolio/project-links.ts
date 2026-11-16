/** Names a project's primary link by where it leads, such as its hostname. */
export function projectLinkLabel(url: string): string {
  const host = new URL(url).hostname.replace(/^www\./, '');

  if (host === 'npmjs.com') return 'npm';

  if (host === 'github.com') return 'GitHub';

  return host;
}
