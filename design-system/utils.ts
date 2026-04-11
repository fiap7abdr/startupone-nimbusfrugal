export function tokenKeyToCssVar(key: string): string {
  const kebab = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
  return `--${kebab}`;
}

export function sidebarKeyToCssVar(key: string): string {
  const kebab = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
  return `--sidebar-${kebab}`;
}
