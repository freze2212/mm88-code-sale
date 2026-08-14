export const DEFAULT_PRIZE_OPTIONS = [
  188, 208, 268, 288, 338, 388, 468, 488, 528, 588, 658, 688, 768, 788, 828, 888,
];

const STORAGE_KEY = 'mm88-admin-prize-config';
const ADMIN_USERNAME_KEY = 'mm88-admin-username';
const ADMIN_PASSWORD_KEY = 'mm88-admin-password';
const DEFAULT_ADMIN_USERNAME = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'Mm88Admin@2026';

export function normalizeAccountId(accountId) {
  return String(accountId || '').trim().toLowerCase();
}

export function getRandomPoint() {
  if (!DEFAULT_PRIZE_OPTIONS.length) return 0;
  const randomIndex = Math.floor(Math.random() * DEFAULT_PRIZE_OPTIONS.length);
  return DEFAULT_PRIZE_OPTIONS[randomIndex];
}

export function loadPrizeConfigs() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);
    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue
      .filter((item) => {
        return (
          typeof item === 'object' &&
          item !== null &&
          typeof item.accountId === 'string' &&
          typeof item.amount === 'number' &&
          Number.isFinite(item.amount)
        );
      })
      .map((item) => ({
        accountId: normalizeAccountId(item.accountId),
        amount: Math.floor(item.amount),
      }));
  } catch {
    return [];
  }
}

export function savePrizeConfigs(configs) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
}

export function getConfiguredPrize(accountId) {
  const normalizedAccountId = normalizeAccountId(accountId);
  if (!normalizedAccountId) {
    return null;
  }

  const matchingConfig = loadPrizeConfigs().find((item) => item.accountId === normalizedAccountId);
  return matchingConfig?.amount ?? null;
}

export function loadAdminPassword() {
  if (typeof window === 'undefined') {
    return DEFAULT_ADMIN_PASSWORD;
  }

  return window.localStorage.getItem(ADMIN_PASSWORD_KEY) ?? DEFAULT_ADMIN_PASSWORD;
}

export function loadAdminUsername() {
  if (typeof window === 'undefined') {
    return DEFAULT_ADMIN_USERNAME;
  }

  return window.localStorage.getItem(ADMIN_USERNAME_KEY) ?? DEFAULT_ADMIN_USERNAME;
}
