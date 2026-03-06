const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  tech: {
    bg: 'bg-blue-100 dark:bg-blue-900/40',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
  },
  art: {
    bg: 'bg-pink-100 dark:bg-pink-900/40',
    text: 'text-pink-700 dark:text-pink-300',
    border: 'border-pink-200 dark:border-pink-800',
  },
  business: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  music: {
    bg: 'bg-purple-100 dark:bg-purple-900/40',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
  },
  design: {
    bg: 'bg-orange-100 dark:bg-orange-900/40',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-200 dark:border-orange-800',
  },
  science: {
    bg: 'bg-cyan-100 dark:bg-cyan-900/40',
    text: 'text-cyan-700 dark:text-cyan-300',
    border: 'border-cyan-200 dark:border-cyan-800',
  },
  networking: {
    bg: 'bg-indigo-100 dark:bg-indigo-900/40',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-200 dark:border-indigo-800',
  },
  workshop: {
    bg: 'bg-amber-100 dark:bg-amber-900/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
  },
  health: {
    bg: 'bg-rose-100 dark:bg-rose-900/40',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-800',
  },
  education: {
    bg: 'bg-teal-100 dark:bg-teal-900/40',
    text: 'text-teal-700 dark:text-teal-300',
    border: 'border-teal-200 dark:border-teal-800',
  },
};

const DEFAULT_COLOR = {
  bg: 'bg-gray-100 dark:bg-gray-800/40',
  text: 'text-gray-700 dark:text-gray-300',
  border: 'border-gray-200 dark:border-gray-700',
};

// Stable fallback colors for unknown tags (hashed by name)
const FALLBACK_COLORS = [
  {
    bg: 'bg-violet-100 dark:bg-violet-900/40',
    text: 'text-violet-700 dark:text-violet-300',
    border: 'border-violet-200 dark:border-violet-800',
  },
  {
    bg: 'bg-lime-100 dark:bg-lime-900/40',
    text: 'text-lime-700 dark:text-lime-300',
    border: 'border-lime-200 dark:border-lime-800',
  },
  {
    bg: 'bg-sky-100 dark:bg-sky-900/40',
    text: 'text-sky-700 dark:text-sky-300',
    border: 'border-sky-200 dark:border-sky-800',
  },
  {
    bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/40',
    text: 'text-fuchsia-700 dark:text-fuchsia-300',
    border: 'border-fuchsia-200 dark:border-fuchsia-800',
  },
];

function hashString(str: string): number {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
}

export interface TagColor {
  bg: string;
  text: string;
  border: string;
}

export function getTagColor(tagName: string): TagColor {
  const normalized = tagName.toLowerCase();
  const mapped = TAG_COLORS[normalized];

  if (mapped) return mapped;

  return FALLBACK_COLORS[hashString(normalized) % FALLBACK_COLORS.length] ?? DEFAULT_COLOR;
}

export function getTagBadgeClasses(tagName: string): string {
  const color = getTagColor(tagName);

  return `${color.bg} ${color.text} ${color.border} border`;
}

export function getTagFilterClasses(tagName: string, isSelected: boolean): string {
  const color = getTagColor(tagName);

  if (isSelected) {
    return `${color.bg} ${color.text} ${color.border} border`;
  }

  return `bg-transparent ${color.text} ${color.border} border opacity-50 hover:opacity-75`;
}

export function getCalendarChipClasses(tagName: string | undefined): string {
  if (!tagName) return 'bg-primary/90 text-primary-foreground hover:bg-primary';

  const color = getTagColor(tagName);

  return `${color.bg} ${color.text} hover:opacity-80`;
}
