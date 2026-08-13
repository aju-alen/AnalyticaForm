export const USER_ACCESS_KEY = 'dubaiAnalytica-userAccess';

const isTruthyFlag = (value) => value === true || value === 'true';

export function getUserAccess() {
  try {
    const raw = localStorage.getItem(USER_ACCESS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setUserAccess(data) {
  if (!data || typeof data !== 'object') return;
  localStorage.setItem(USER_ACCESS_KEY, JSON.stringify(data));
}

export function clearUserAccess() {
  localStorage.removeItem(USER_ACCESS_KEY);
}

export function isUserAuthenticated() {
  return Boolean(getUserAccess()?.accessToken);
}

export function isUserSuperAdmin() {
  return isTruthyFlag(getUserAccess()?.isSuperAdmin);
}
