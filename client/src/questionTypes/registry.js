import { lazy } from 'react';

const load = (importer) => lazy(importer);

function defineType({
  label,
  component,
  displayOnly = false,
  alwaysMandatory = false,
  consent = false,
  saveKind = 'point',
  wrap = true,
}) {
  return { label, displayOnly, alwaysMandatory, consent, saveKind, wrap, Component: component };
}

export const QUESTION_TYPES = {
  SinglePointForm: defineType({ label: 'Single choice', component: load(() => import('../components/SelectSingleRadio')) }),
  SingleCheckForm: defineType({ label: 'Multiple choice', component: load(() => import('../components/SelectSingleCheckBox')), saveKind: 'check' }),
  IntroductionForm: defineType({ label: 'Introduction', component: load(() => import('../components/IntroductionForm')), displayOnly: true }),
  MultiScalePoint: defineType({ label: 'Multi scale (single)', component: load(() => import('../components/SelectMultiScalePoint')), saveKind: 'multiscale' }),
  MultiScaleCheckBox: defineType({ label: 'Multi scale (multiple)', component: load(() => import('../components/SelectMultiScaleCheckBox')), saveKind: 'check' }),
  MultiSpreadsheet: defineType({ label: 'Spreadsheet', component: load(() => import('../components/SelectMultiSpreadsheet')), saveKind: 'check', wrap: false }),
  MapForm: defineType({ label: 'Map', component: load(() => import('../components/MapForm')) }),
  SelectDropDownForm: defineType({ label: 'Dropdown', component: load(() => import('../components/SelectDropdownMenu')) }),
  CommentBoxForm: defineType({ label: 'Comment box', component: load(() => import('../components/CommentBox')), saveKind: 'multiscale' }),
  SingleRowTextForm: defineType({ label: 'Single row text', component: load(() => import('../components/SingleRowText')), saveKind: 'multiscale' }),
  EmailAddressForm: defineType({ label: 'Email address', component: load(() => import('../components/EmailAddress')), saveKind: 'multiscale' }),
  ContactInformationForm: defineType({ label: 'Contact information', component: load(() => import('../components/ContactInformation')), saveKind: 'multiscale' }),
  StarRatingForm: defineType({ label: 'Star rating', component: load(() => import('../components/StarRating')), saveKind: 'multiscale' }),
  SmileyRatingForm: defineType({ label: 'Smiley rating', component: load(() => import('../components/SmileyRating')), saveKind: 'multiscale' }),
  ThumbUpDownForm: defineType({ label: 'Thumbs up/down', component: load(() => import('../components/ThumbsUpDown')), saveKind: 'multiscale' }),
  SliderTextForm: defineType({ label: 'Slider text', component: load(() => import('../components/SliderText')), saveKind: 'multiscale' }),
  NumericSliderForm: defineType({ label: 'Numeric slider', component: load(() => import('../components/NumericSlider')), saveKind: 'multiscale' }),
  SelectOneImageForm: defineType({ label: 'Select one image', component: load(() => import('../components/SelectOneImage')), saveKind: 'multiscale' }),
  SelectMultipleImageForm: defineType({ label: 'Select multiple images', component: load(() => import('../components/SelectMultipleImage')), saveKind: 'multiscale' }),
  RankOrderForm: defineType({ label: 'Rank order', component: load(() => import('../components/RankOrder')), saveKind: 'multiscale' }),
  ConstantSumForm: defineType({ label: 'Constant sum', component: load(() => import('../components/ConstantSum')), saveKind: 'multiscale' }),
  PickAndRankForm: defineType({ label: 'Pick and rank', component: load(() => import('../components/PickAndRank')), saveKind: 'multiscale' }),
  PresentationTextForm: defineType({ label: 'Presentation text', component: load(() => import('../components/PresentationText')), displayOnly: true, saveKind: 'multiscale' }),
  SectionHeadingForm: defineType({ label: 'Section heading', component: load(() => import('../components/SectionHeading')), displayOnly: true, saveKind: 'multiscale' }),
  SectionSubHeadingForm: defineType({ label: 'Section subheading', component: load(() => import('../components/SectionSubHeading')), displayOnly: true, saveKind: 'multiscale' }),
  DateTimeForm: defineType({ label: 'Date & time', component: load(() => import('../components/DateTime')), saveKind: 'multiscale' }),
  GoogleRecaptchaForm: defineType({ label: 'reCAPTCHA', component: load(() => import('../components/GoogleRecaptcha')), saveKind: 'multiscale' }),
  CalenderForm: defineType({ label: 'Calendar', component: load(() => import('../components/Calender')), saveKind: 'multiscale' }),
  RankOrderImage: defineType({ label: 'Rank order (images)', component: load(() => import('../components/RankOrderImage')), saveKind: 'multiscale' }),
  RankOrderImageForm: defineType({ label: 'Rank order (images)', component: load(() => import('../components/RankOrderImage')), saveKind: 'multiscale' }),
  ConsentForm: defineType({
    label: 'Form Consent',
    component: load(() => import('../components/ConsentForm')),
    alwaysMandatory: true,
    consent: true,
  }),
  QualitativeConsentForm: defineType({
    label: 'Interview Consent',
    component: load(() => import('../components/QualitativeConsentForm')),
    alwaysMandatory: true,
    consent: true,
  }),
  DynamicConsentForm: defineType({
    label: 'Dynamic Consent (Quantitative)',
    component: load(() => import('../components/DynamicConsentForm')),
    alwaysMandatory: true,
    consent: true,
  }),
  DynamicQualitativeConsentForm: defineType({
    label: 'Dynamic Consent (Qualitative)',
    component: load(() => import('../components/DynamicQualitativeConsentForm')),
    alwaysMandatory: true,
    consent: true,
  }),
};

export const BUILDER_COMPONENTS = Object.fromEntries(
  Object.entries(QUESTION_TYPES).map(([key, value]) => [key, value.Component])
);

export const DISPLAY_ONLY_FORM_TYPES = new Set(
  Object.entries(QUESTION_TYPES).filter(([, value]) => value.displayOnly).map(([key]) => key)
);

export const ALWAYS_MANDATORY_FORM_TYPES = new Set(
  Object.entries(QUESTION_TYPES).filter(([, value]) => value.alwaysMandatory).map(([key]) => key)
);

export const CONSENT_FORM_TYPES = new Set(
  Object.entries(QUESTION_TYPES).filter(([, value]) => value.consent).map(([key]) => key)
);

export const FORM_TYPE_LABELS = Object.fromEntries(
  Object.entries(QUESTION_TYPES).map(([key, value]) => [key, value.label])
);

export function getQuestionType(formType) {
  return QUESTION_TYPES[formType] || null;
}
