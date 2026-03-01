export function isPastEvent(dateTime: string): boolean {
  return new Date(dateTime) < new Date();
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');

  if (!domain) {
    return email;
  }

  const first = local.slice(0, 2);
  const last = local.slice(-1);
  const masked = first + '***' + last;

  return `${masked}@${domain}`;
}

export function getDisplayName(name: string, email: string): string {
  return name || maskEmail(email);
}

export function getInitial(value: string): string {
  return value.charAt(0).toUpperCase();
}
