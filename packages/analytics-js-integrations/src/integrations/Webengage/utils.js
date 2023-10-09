import { logger } from '@rudderstack/analytics-js-common/v1.1/utils/logUtil';
import { getDefinedTraits } from '../../utils/utils';

function setSystemAttributes(webengage, message, config) {
  const { email, firstName, lastName, phone } = getDefinedTraits(message);
  const allowedGenders = ['male', 'female', 'other'];
  const { context, traits } = message;
  const { gender, company, emailOptIn, smsOptIn, whatsappOptIn } = context.traits || traits;
  if (email) {
    if (!config.hashEmail) {
      webengage.user.setAttribute('we_email', email);
    } else {
      webengage.user.setAttribute('we_hashed_email', email);
    }
  }
  if (firstName) {
    webengage.user.setAttribute('we_first_name', firstName);
  }
  if (lastName) {
    webengage.user.setAttribute('we_last_name', lastName);
  }
  if (phone) {
    if (!config.hashPhone) {
      webengage.user.setAttribute('we_phone', phone);
    } else {
      webengage.user.setAttribute('we_hashed_phone', phone);
    }
  }
  if (gender) {
    if (allowedGenders.includes(gender)) {
      webengage.user.setAttribute('we_gender', gender);
    } else {
      logger.warn('Webengage only supports gender values are male, female and other.');
    }
  }
  if (company) {
    webengage.user.setAttribute('we_company', company);
  }
  if (emailOptIn) {
    webengage.user.setAttribute('we_email_opt_in', emailOptIn);
  }
  if (smsOptIn) {
    webengage.user.setAttribute('we_sms_opt_in', smsOptIn);
  }
  if (whatsappOptIn) {
    webengage.user.setAttribute('we_whatsapp_opt_in', whatsappOptIn);
  }
}

function setCustomAttributes(webengage, message) {
  const STANDARD_ATTRIBUTES = [
    'email',
    'firstName',
    'lastName',
    'phone',
    'gender',
    'company',
    'emailOptIn',
    'smsOptIn',
    'whatsappOptIn',
  ];
  const { context, traits } = message;
  const customAttributes = Object.keys(context.traits || traits).filter(
    key => !STANDARD_ATTRIBUTES.includes(key),
  );
  customAttributes.forEach(key => {
    webengage.user.setAttribute(key, context.traits[key] || traits[key]);
  });
}

export { setSystemAttributes, setCustomAttributes };
