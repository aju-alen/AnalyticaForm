const SCHEDULER_BASE_URL =
  import.meta.env.VITE_PHD_SUCCESS_SCHEDULER_URL || 'https://scheduler.phdsuccess.ae/';

export const getSchedulerRedirectUrl = (email) => {
  const url = new URL(SCHEDULER_BASE_URL);
  url.searchParams.set('formType', 'consultation');
  url.searchParams.set('email', email || '');
  url.searchParams.set('success', 'true');
  return url.toString();
};

/**
 * Open scheduler in a new tab. Call synchronously on submit (user click) so the
 * browser allows the pop-up and loads the URL immediately. Do not pass noopener —
 * it returns null and prevents navigating the new tab from the opener.
 */
export const openSchedulerInNewTab = (email) => {
  const url = getSchedulerRedirectUrl(email);
  const tab = window.open(url, '_blank');
  return Boolean(tab);
};
