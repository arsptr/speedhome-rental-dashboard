const DEFAULT_USER_AGENT = 'SpeedhomeRentalDashboard/1.0 (+https://github.com)';

type RobotsRules = {
  allow: string[];
  disallow: string[];
};

function normalizeRobotsPath(value: string): string {
  return value.trim() === '' ? '/' : value.trim();
}

function parseRobotsText(text: string): RobotsRules {
  const allow: string[] = [];
  const disallow: string[] = [];
  let userAgentSection = false;

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.split('#')[0].trim();
    if (!line) {
      continue;
    }

    const [key, value] = line.split(':', 2).map((segment) => segment.trim());
    if (!key || value === undefined) {
      continue;
    }

    const directive = key.toLowerCase();
    if (directive === 'user-agent') {
      userAgentSection = value === '*' || value.toLowerCase().includes('speedhome');
      continue;
    }

    if (!userAgentSection) {
      continue;
    }

    if (directive === 'allow') {
      allow.push(normalizeRobotsPath(value));
    }

    if (directive === 'disallow') {
      disallow.push(normalizeRobotsPath(value));
    }
  }

  return { allow, disallow };
}

function isPathAllowedByRules(rules: RobotsRules, path: string): boolean {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (rules.disallow.some((rule) => rule !== '/' && normalizedPath.startsWith(rule))) {
    if (rules.allow.some((rule) => normalizedPath.startsWith(rule))) {
      return true;
    }
    return false;
  }

  return true;
}

export async function isPathAllowed(url: URL): Promise<boolean> {
  try {
    const robotsUrl = new URL('/robots.txt', url.origin).toString();
    const response = await fetch(robotsUrl, {
      headers: {
        'User-Agent': DEFAULT_USER_AGENT,
        Accept: 'text/plain',
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return true;
    }

    const text = await response.text();
    const rules = parseRobotsText(text);
    return isPathAllowedByRules(rules, url.pathname);
  } catch {
    return true;
  }
}
