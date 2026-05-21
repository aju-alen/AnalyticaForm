const SCHEDULER_BASE_URL =
  import.meta.env.VITE_PHD_SUCCESS_SCHEDULER_URL || 'https://scheduler.phdsuccess.ae/';

export const getSchedulerRedirectUrl = (email) => {
  const url = new URL(SCHEDULER_BASE_URL);
  url.searchParams.set('formType', 'consultation');
  url.searchParams.set('email', email || '');
  url.searchParams.set('success', 'true');
  return url.toString();
};

/** Navigate the top-level window (breaks out of WordPress iframe embeds). */
export const redirectOutsideEmbed = (email) => {
  const url = getSchedulerRedirectUrl(email);
  try {
    if (window.top && window.top !== window.self) {
      window.top.location.href = url;
      return;
    }
  } catch {
    // cross-origin access blocked; fall through
  }
  window.location.href = url;
};
