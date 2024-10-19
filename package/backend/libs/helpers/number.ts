import {
  CountryCode,
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumber,
} from 'libphonenumber-js';
import { ECountryCodeP } from '~libs/entities/enums';

export const malysiaNumberPrefixes = [
  '60',
  '01',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '10',
];

export function formatCurrency(amount: number, currency = 'MYR') {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: currency,
  });
}

export function buildPhoneNumber(
  countryCode: ECountryCodeP,
  phoneNumber: string,
) {
  const enumCountryCode = Object.values(ECountryCodeP);
  if (!enumCountryCode.includes(countryCode)) {
    return phoneNumber;
  }
  const formattedphoneNumber = formatPhoneNumberByCountryCode(
    phoneNumber,
    countryCode as CountryCode,
  );
  return `${formattedphoneNumber.extension}${formattedphoneNumber.phoneNumber}`;
}

function formatPhoneNumberByCountryCode(
  phoneNumber: string,
  countryCode: CountryCode,
): { extension: string; phoneNumber: string } {
  const countryExtension = getCountryCallingCode(countryCode);
  const parsedPhoneNumber = formatSystemPhoneNumber(
    `${countryExtension}${phoneNumber}`,
  );
  return {
    extension: countryExtension,
    phoneNumber: !parsedPhoneNumber?.error
      ? phoneNumber
      : parsedPhoneNumber.phone,
  };
}

export function formatSystemPhoneNumber(phoneNumber: string): {
  phone: string;
  countryExtension?: string;
  countryCode?: CountryCode;
  error?: string;
} {
  if (!/^[+\d]/.test(phoneNumber)) return;

  phoneNumber = phoneNumber.toString().replace(/\D/g, '');

  const extractedPhoneNumber = extractPhoneNumberPrefixNCode(
    phoneNumber.trim(),
  );

  if (extractedPhoneNumber?.countryCode?.length > 0) {
    return {
      phone: extractedPhoneNumber.phone,
      countryCode: extractedPhoneNumber.countryCode,
      countryExtension: extractedPhoneNumber.countryExtension,
    };
  } else {
    return {
      phone: phoneNumber,
      countryCode: null,
      countryExtension: null,
      error: 'Invalid Phone Number Format',
    };
  }
}

function extractPhoneNumberPrefixNCode(phoneNumber: string): {
  phone: string;
  countryExtension: string;
  countryCode: CountryCode;
} {
  if (
    phoneNumber === null ||
    phoneNumber === undefined ||
    phoneNumber?.length === 0
  )
    return;
  if (phoneNumber.startsWith('+')) {
    phoneNumber = phoneNumber.substring(1);
  }
  //TBC Country Code
  let countryExtension = '';
  let countryCode = '';
  let countryCodeLength = 0;

  if (malysiaNumberPrefixes.some((prefix) => phoneNumber.startsWith(prefix))) {
    countryExtension = '60';
    countryCode = 'MY';
    countryCodeLength = phoneNumber.startsWith('60')
      ? 2
      : phoneNumber.startsWith('1')
      ? 0
      : 1;
  } else if (phoneNumber.startsWith('65')) {
    countryExtension = '65';
    countryCode = 'SG';
    countryCodeLength = countryExtension.length;
  } else if (phoneNumber.startsWith('86')) {
    countryExtension = '86';
    countryCode = 'CN';
    countryCodeLength = countryExtension.length;
  } else if (phoneNumber.startsWith('62')) {
    countryExtension = '62';
    countryCode = 'ID';
    countryCodeLength = countryExtension.length;
  } else if (phoneNumber.startsWith('852')) {
    countryExtension = '852';
    countryCode = 'HK';
    countryCodeLength = countryExtension.length;
  } else if (phoneNumber.startsWith('886')) {
    countryExtension = '886';
    countryCode = 'TW';
    countryCodeLength = countryExtension.length;
  } else if (phoneNumber.startsWith('63')) {
    countryExtension = '63';
    countryCode = 'PH';
    countryCodeLength = countryExtension.length;
  } else if (phoneNumber.startsWith('61')) {
    countryExtension = '61';
    countryCode = 'AU';
    countryCodeLength = countryExtension.length;
  } else if (phoneNumber.startsWith('91')) {
    countryExtension = '91';
    countryCode = 'IN';
    countryCodeLength = countryExtension.length;
  } else if (phoneNumber.startsWith('64')) {
    countryExtension = '64';
    countryCode = 'NZ';
    countryCodeLength = countryExtension.length;
  } else if (phoneNumber.startsWith('673')) {
    countryExtension = '673';
    countryCode = 'BN';
    countryCodeLength = countryExtension.length;
  } else {
    // check phone no is number

    phoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

    const isValid = isValidPhoneNumber(phoneNumber);

    if (!isValid) return;

    const parsedNumber = parsePhoneNumber(phoneNumber);

    if (parsedNumber) {
      countryExtension = parsedNumber?.countryCallingCode;
      countryCode = parsedNumber?.country;
      countryCodeLength = countryExtension?.length;
    } else {
      return;
    }
  }

  return {
    countryExtension,
    countryCode: countryCode as CountryCode,
    phone: phoneNumber.substring(countryCodeLength),
  };
}
