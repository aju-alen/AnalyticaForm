export const CONSENT_RULE_EXIT_ON_NO = 'exit_on_no';
export const CONSENT_RULE_OPTIONAL = 'optional';
export const CONSENT_RULE_MUST_YES = 'must_yes';

export function evaluateConsentProgress(items, selectedValue) {
  const answers = Array.isArray(selectedValue) ? selectedValue : [];
  const getAnswer = (index) => {
    const entry = answers.find((a) => Number(a.index) === index + 1) || answers[index];
    return String(entry?.answer || entry?.value || '').trim();
  };

  let shouldExit = false;
  let missingMandatory = false;

  (items || []).forEach((item, index) => {
    const answer = getAnswer(index);
    const rule = item.rule || CONSENT_RULE_OPTIONAL;

    if (rule === CONSENT_RULE_EXIT_ON_NO) {
      if (!answer) missingMandatory = true;
      else if (answer === 'No') shouldExit = true;
    } else if (rule === CONSENT_RULE_MUST_YES) {
      if (answer !== 'Yes') missingMandatory = true;
    }
  });

  return {
    canProceed: !shouldExit && !missingMandatory,
    shouldExit,
    missingMandatory,
  };
}

const QUAL_CONSENT_TYPES = new Set(['QualitativeConsentForm', 'DynamicQualitativeConsentForm']);

/**
 * Returns whether a Zoom meeting should be created for this submission.
 */
export function shouldCreateZoomForResponse(surveyForms, userResponse) {
  const responses = Array.isArray(userResponse) ? userResponse : [];
  const forms = Array.isArray(surveyForms) ? surveyForms : [];

  for (const formDef of forms) {
    if (!QUAL_CONSENT_TYPES.has(formDef.formType)) continue;
    const answered =
      responses.find((r) => r.id && r.id === formDef.id) ||
      responses.find((r) => r.formType === formDef.formType);

    if (!answered) continue;

    const items = Array.isArray(formDef.items) ? formDef.items : [];
    const progress = evaluateConsentProgress(items, answered.selectedValue || []);
    if (!progress.canProceed || progress.shouldExit) continue;

    const wantsZoom = items.some((item, index) => {
      if (!item.showsZoomOnYes) return false;
      const entry =
        (answered.selectedValue || []).find((a) => Number(a.index) === index + 1) ||
        (answered.selectedValue || [])[index];
      return String(entry?.answer || '').trim() === 'Yes';
    });

    if (wantsZoom) return { ok: true, formDef, answered };
  }

  return { ok: false };
}
