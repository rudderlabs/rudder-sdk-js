// Source: ISO 4217 active currency minor units published by SIX Group.
// https://www.six-group.com/en/products-services/financial-information/data-standards.html
const CURRENCY_CODES =
  ' AED AFN ALL AMD ANG AOA ARS AUD AWG AZN BAM BBD BDT BGN BHD BIF BMD BND BOB BOV BRL BSD BTN BWP BYN BZD CAD CDF CHE CHF CHW CLF CLP CNY COP COU CRC CUC CUP CVE CZK DJF DKK DOP DZD EGP ERN ETB EUR FJD FKP GBP GEL GHS GIP GMD GNF GTQ GYD HKD HNL HTG HUF IDR ILS INR IQD IRR ISK JMD JOD JPY KES KGS KHR KMF KPW KRW KWD KYD KZT LAK LBP LKR LRD LSL LYD MAD MDL MGA MKD MMK MNT MOP MRU MUR MVR MWK MXN MXV MYR MZN NAD NGN NIO NOK NPR NZD OMR PAB PEN PGK PHP PKR PLN PYG QAR RON RSD RUB RWF SAR SBD SCR SDG SEK SGD SHP SLE SLL SOS SRD SSP STN SVC SYP SZL THB TJS TMT TND TOP TRY TTD TWD TZS UAH UGX USD USN UYI UYU UYW UZS VED VES VND VUV WST XAF XCD XOF XPF YER ZAR ZMW ZWL ';
const ZERO_DECIMAL_CURRENCIES = ' BIF CLP DJF GNF ISK JPY KMF KRW PYG RWF UGX UYI VND VUV XAF XOF XPF ';
const THREE_DECIMAL_CURRENCIES = ' BHD IQD JOD KWD LYD OMR TND ';
const FOUR_DECIMAL_CURRENCIES = ' CLF UYW ';

// eslint-disable-next-line compat/compat
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;

const normalizeCurrency = currency => {
  if (typeof currency !== 'string') {
    return undefined;
  }
  const normalized = currency.trim().toUpperCase();
  return CURRENCY_CODES.includes(` ${normalized} `) ? normalized : undefined;
};

const getCurrencyExponent = currency => {
  const currencyKey = ` ${currency} `;
  if (ZERO_DECIMAL_CURRENCIES.includes(currencyKey)) {
    return 0;
  }
  if (THREE_DECIMAL_CURRENCIES.includes(currencyKey)) {
    return 3;
  }
  return FOUR_DECIMAL_CURRENCIES.includes(currencyKey) ? 4 : 2;
};

const toDecimalString = amount => {
  if (typeof amount === 'number') {
    if (!Number.isFinite(amount)) {
      return undefined;
    }
    return String(amount);
  }
  if (typeof amount === 'string') {
    const trimmed = amount.trim();
    return trimmed || undefined;
  }
  return undefined;
};

const toMinorUnits = (amount, currency) => {
  const normalizedCurrency = normalizeCurrency(currency);
  if (!normalizedCurrency) {
    return undefined;
  }

  const decimalString = toDecimalString(amount);
  if (!decimalString || !/^\d+(\.\d+)?$/.test(decimalString)) {
    return undefined;
  }

  const exponent = getCurrencyExponent(normalizedCurrency);
  const decimalParts = decimalString.split('.');
  const integerPart = decimalParts[0];
  const fractionPart = decimalParts[1] || '';
  const normalizedFractionPart = fractionPart.replace(/0+$/, '');

  if (normalizedFractionPart.length > exponent) {
    return undefined;
  }

  const paddedFraction = normalizedFractionPart.padEnd(exponent, '0');
  const minorUnitMultiplier = Math.pow(10, exponent);
  const minorUnits = Number(integerPart) * minorUnitMultiplier + Number(paddedFraction || '0');

  return Number.isInteger(minorUnits) && Math.abs(minorUnits) <= MAX_SAFE_INTEGER
    ? minorUnits
    : undefined;
};

export { normalizeCurrency, toMinorUnits };
