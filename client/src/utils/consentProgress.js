export const CONSENT_RULE_EXIT_ON_NO = 'exit_on_no';
export const CONSENT_RULE_OPTIONAL = 'optional';
export const CONSENT_RULE_MUST_YES = 'must_yes';

/**
 * @param {Array<{ id: string, label: string, rule: string }>} items
 * @param {Array<{ question?: string, answer?: string, value?: string, index?: number }>} selectedValue
 * @returns {{ canProceed: boolean, shouldExit: boolean, missingMandatory: boolean }}
 */
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
    // optional: never blocks
  });

  const canProceed = !shouldExit && !missingMandatory;
  return { canProceed, shouldExit, missingMandatory };
}

export function buildSelectedValueForItems(items, answersByIndex) {
  return (items || []).map((item, index) => {
    const answer = answersByIndex[index] || '';
    return {
      question: item.label,
      answer,
      value: answer,
      index: index + 1,
    };
  });
}
