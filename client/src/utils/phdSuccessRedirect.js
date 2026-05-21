const SCHEDULER_BASE_URL =
  import.meta.env.VITE_PHD_SUCCESS_SCHEDULER_URL || 'https://scheduler.phdsuccess.ae/';

export const getSchedulerRedirectUrl = (email) => {
  const url = new URL(SCHEDULER_BASE_URL);
  url.searchParams.set('formType', 'consultation');
  url.searchParams.set('email', email || '');
  url.searchParams.set('success', 'true');
  return url.toString();
};

/** Open a blank tab immediately (call synchronously on submit click). */
export const openSchedulerTabPlaceholder = () =>
  window.open('about:blank', '_blank', 'noopener,noreferrer');

/** Navigate a tab opened via openSchedulerTabPlaceholder to the scheduler URL. */
export const navigateSchedulerTab = (tab, email) => {
  if (!tab) return false;
  const url = getSchedulerRedirectUrl(email);
  try {
    tab.location.href = url;
    tab.focus?.();
    return true;
  } catch {
    return false;
  }
};

/** Open scheduler in a new browser tab (does not navigate the iframe). */
export const openSchedulerInNewTab = (email) => {
  const tab = openSchedulerTabPlaceholder();
  return navigateSchedulerTab(tab, email);
};
