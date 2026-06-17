
import { alpha } from '@mui/material/styles';
import { GridApiPro, GridApi } from '@mui/x-data-grid-pro';
import dayjs from 'dayjs';
import { ILanguage } from 'types';
function toCamelCase(key, value) {
  if (value && typeof value === "object") {
    for (const k in value) {
      if (/^[A-Z]/.test(k) && Object.hasOwnProperty.call(value, k)) {
        value[k.charAt(0).toLowerCase() + k.substring(1)] = value[k];
        delete value[k];
      }
    }
  }
  return value;
}
export const validateEmail = (email: string) => {
  if (!/\S+@\S+\.\S+/.test(email)) {
    return false;
  }
  return true;
}
export const findItemInArray = (array, value, key = "key") => {
  return array.find((item) =>
    typeof item === "object" ? item[key] === value : item === value
  );
};
export const findItemsInArray = (array, value, key = "key") => {
  if (Array.isArray(value))
    return array.filter((item) =>
      typeof item === "object"
        ? value.indexOf(item[key]) !== -1
        : value.indexOf(item) !== -1
    );
  return array.filter((item) =>
    typeof item === "object" ? item[key] === value : item === value
  );
};
export const debounce = (func, timeout = 300) => {
  let timer;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      func.apply(debounce, args);
    }, timeout);
  };
};
export const updateRow = (
  api: React.MutableRefObject<GridApiPro> | GridApi,
  rowId,
  data
) => {
  const app = api["current"] ? (api as React.MutableRefObject<GridApiPro>).current : api as GridApi;
  //
  const newRows = app.getAllRowIds().map((id) => {
    const row = app.getRow(id);
    if (id === rowId) return { ...row, ...data };
    return { ...row };
  });
  app.updateRows(newRows);
};
export const date2Srting = (date: Date | string, locale: ILanguage) => {
  if (!date) return "";

  const d = dayjs(date);
  if (d.format("YYYY-MM-DD") === "1911-01-01") return "";

  if (locale === "EN") return d.format("DD MMM YYYY");
  return d.format("DD/MM/YYYY");
};
export const datetime2Srting = (date: Date | string, locale: ILanguage) => {
  if (!date) return "";

  const d = dayjs(date);
  if (d.format("YYYY-MM-DD HH:mm") === "1911-01-01") return "";

  if (locale === "EN") return d.format("DD MMM YYYY - HH:mm");
  return d.format("DD/MM/YYYY HH:mm");
};
export const number2String = (
  value: number | null,
  decimalPlace = 0,
  locale = "en-Us",
  type: 'subtract' | 'normal' = 'normal',
) => {
  value = value ?? 0;
  return value >= 0
    ? value.toLocaleString(locale, {
      maximumFractionDigits: decimalPlace,
    })
    : type === 'subtract' ? `-${Math.abs(value).toLocaleString(locale, {
      maximumFractionDigits: decimalPlace,
    })} ` : `(${Math.abs(value).toLocaleString(locale, {
      maximumFractionDigits: decimalPlace,
    })})`;
};
export const toTitleCase = (str: string): string => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
export const parseJSON = (data: string, out: any = null) => {
  try {
    const value = JSON.parse(data, toCamelCase);
    return value;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return out;
  }
};

export const getAvatarColor = () => {
  const colors = [
    "#ff5252", //red
    "#508D43", //green
    "#00b4d8", //blue
    "#7554AE", //purple
    "brown",
    "#DAB600", // "yellow",
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};


export const countries = [
  { id: 'AD', text: 'Andorra' },
  { id: 'AE', text: 'United Arab Emirates' },
  { id: 'AF', text: 'Afghanistan' },
  { id: 'AG', text: 'Antigua And Barbuda' },
  { id: 'AI', text: 'Anguilla' },
  { id: 'AL', text: 'Albania' },
  { id: 'AM', text: 'Armenia' },
  { id: 'AN', text: 'Netherlands Antilles' },
  { id: 'AO', text: 'Angola' },
  { id: 'AQ', text: 'Antarctica' },
  { id: 'AR', text: 'Argentina' },
  { id: 'AS', text: 'American Samoa' },
  { id: 'AT', text: 'Austria' },
  { id: 'AU', text: 'Australia' },
  { id: 'AW', text: 'Aruba' },
  { id: 'AZ', text: 'Azerbaijan' },
  { id: 'BA', text: 'Bosnia And Herzegowina' },
  { id: 'BB', text: 'Barbados' },
  { id: 'BD', text: 'Bangladesh' },
  { id: 'BE', text: 'Belgium' },
  { id: 'BF', text: 'Burkina Faso' },
  { id: 'BG', text: 'Bulgaria' },
  { id: 'BH', text: 'Bahrain' },
  { id: 'BI', text: 'Burundi' },
  { id: 'BJ', text: 'Benin' },
  { id: 'BM', text: 'Bermuda' },
  { id: 'BN', text: 'Brunei Darussalam' },
  { id: 'BO', text: 'Bolivia' },
  { id: 'BR', text: 'Brazil' },
  { id: 'BS', text: 'Bahamas' },
  { id: 'BT', text: 'Bhutan' },
  { id: 'BV', text: 'Bouvet Island' },
  { id: 'BW', text: 'Botswana' },
  { id: 'BY', text: 'Belarus' },
  { id: 'BZ', text: 'Belize' },
  { id: 'CA', text: 'Canada' },
  { id: 'CC', text: 'Cocos (Keeling) Islands' },
  { id: 'CD', text: 'Congo, The Drc' },
  { id: 'CF', text: 'Central African Republic' },
  { id: 'CG', text: 'Congo' },
  { id: 'CH', text: 'Switzerland' },
  { id: 'CI', text: 'Cote DIvoire' },
  { id: 'CK', text: 'Cook Islands' },
  { id: 'CL', text: 'Chile' },
  { id: 'CM', text: 'Cameroon' },
  { id: 'CN', text: 'China' },
  { id: 'CO', text: 'Colombia' },
  { id: 'CR', text: 'Costa Rica' },
  { id: 'CU', text: 'Cuba' },
  { id: 'CV', text: 'Cape Verde' },
  { id: 'CX', text: 'Christmas Island' },
  { id: 'CY', text: 'Cyprus' },
  { id: 'CZ', text: 'Czech Republic' },
  { id: 'DE', text: 'Germany' },
  { id: 'DJ', text: 'Djibouti' },
  { id: 'DK', text: 'Denmark' },
  { id: 'DM', text: 'Dominica' },
  { id: 'DO', text: 'Dominican Republic' },
  { id: 'DZ', text: 'Algeria' },
  { id: 'EC', text: 'Ecuador' },
  { id: 'EE', text: 'Estonia' },
  { id: 'EG', text: 'Egypt' },
  { id: 'EH', text: 'Western Sahara' },
  { id: 'ER', text: 'Eritrea' },
  { id: 'ES', text: 'Spain' },
  { id: 'ET', text: 'Ethiopia' },
  { id: 'FI', text: 'Finland' },
  { id: 'FJ', text: 'Fiji' },
  { id: 'FK', text: 'Falkland Islands (Malvinas)' },
  { id: 'FM', text: 'Micronesia, Federated States Of' },
  { id: 'FO', text: 'Faroe Islands' },
  { id: 'FR', text: 'France' },
  { id: 'FX', text: 'France, Metropolitan' },
  { id: 'GA', text: 'Gabon' },
  { id: 'GB', text: 'United Kingdom' },
  { id: 'GD', text: 'Grenada' },
  { id: 'GE', text: 'Georgia' },
  { id: 'GF', text: 'French Guiana' },
  { id: 'GH', text: 'Ghana' },
  { id: 'GI', text: 'Gibraltar' },
  { id: 'GL', text: 'Greenland' },
  { id: 'GM', text: 'Gambia' },
  { id: 'GN', text: 'Guinea' },
  { id: 'GP', text: 'Guadeloupe' },
  { id: 'GQ', text: 'Equatorial Guinea' },
  { id: 'GR', text: 'Greece' },
  { id: 'GS', text: 'South Georgia And South S.S.' },
  { id: 'GT', text: 'Guatemala' },
  { id: 'GU', text: 'Guam' },
  { id: 'GW', text: 'Guiissau' },
  { id: 'GY', text: 'Guyana' },
  { id: 'HK', text: 'Hong Kong' },
  { id: 'HM', text: 'Heard And Mc Donald Islands' },
  { id: 'HN', text: 'Honduras' },
  { id: 'HR', text: 'Croatia (Local Name: Hrvatska)' },
  { id: 'HT', text: 'Haiti' },
  { id: 'HU', text: 'Hungary' },
  { id: 'ID', text: 'Indonesia' },
  { id: 'IE', text: 'Ireland' },
  { id: 'IL', text: 'Israel' },
  { id: 'IN', text: 'India' },
  { id: 'IO', text: 'British Indian Ocean Territory' },
  { id: 'IQ', text: 'Iraq' },
  { id: 'IR', text: 'Iran (Islamic Republic Of)' },
  { id: 'IS', text: 'Iceland' },
  { id: 'IT', text: 'Italy' },
  { id: 'JM', text: 'Jamaica' },
  { id: 'JO', text: 'Jordan' },
  { id: 'JP', text: 'Japan' },
  { id: 'KE', text: 'Kenya' },
  { id: 'KG', text: 'Kyrgyzstan' },
  { id: 'KH', text: 'Cambodia' },
  { id: 'KI', text: 'Kiribati' },
  { id: 'KM', text: 'Comoros' },
  { id: 'KN', text: 'Saint Kitts And Nevis' },
  { id: 'KP', text: 'Korea, D.P.R.O.' },
  { id: 'KR', text: 'Korea, Republic Of' },
  { id: 'KW', text: 'Kuwait' },
  { id: 'KY', text: 'Cayman Islands' },
  { id: 'KZ', text: 'Kazakhstan' },
  { id: 'LA', text: 'Laos' },
  { id: 'LB', text: 'Lebanon' },
  { id: 'LC', text: 'Saint Lucia' },
  { id: 'LI', text: 'Liechtenstein' },
  { id: 'LK', text: 'Sri Lanka' },
  { id: 'LR', text: 'Liberia' },
  { id: 'LS', text: 'Lesotho' },
  { id: 'LT', text: 'Lithuania' },
  { id: 'LU', text: 'Luxembourg' },
  { id: 'LV', text: 'Latvia' },
  { id: 'LY', text: 'Libyan Arab Jamahiriya' },
  { id: 'MA', text: 'Morocco' },
  { id: 'MC', text: 'Monaco' },
  { id: 'MD', text: 'Moldova, Republic Of' },
  { id: 'MG', text: 'Madagascar' },
  { id: 'MH', text: 'Marshall Islands' },
  { id: 'MK', text: 'Macedonia' },
  { id: 'ML', text: 'Mali' },
  { id: 'MM', text: 'Myanmar (Burma)' },
  { id: 'MN', text: 'Mongolia' },
  { id: 'MO', text: 'Macau' },
  { id: 'MP', text: 'Northern Mariana Islands' },
  { id: 'MQ', text: 'Martinique' },
  { id: 'MR', text: 'Mauritania' },
  { id: 'MS', text: 'Montserrat' },
  { id: 'MT', text: 'Malta' },
  { id: 'MU', text: 'Mauritius' },
  { id: 'MV', text: 'Maldives' },
  { id: 'MW', text: 'Malawi' },
  { id: 'MX', text: 'Mexico' },
  { id: 'MY', text: 'Malaysia' },
  { id: 'MZ', text: 'Mozambique' },
  { id: 'NA', text: 'Namibia' },
  { id: 'NC', text: 'New Caledonia' },
  { id: 'NE', text: 'Niger' },
  { id: 'NF', text: 'Norfolk Island' },
  { id: 'NG', text: 'Nigeria' },
  { id: 'NI', text: 'Nicaragua' },
  { id: 'NL', text: 'Netherlands' },
  { id: 'NO', text: 'Norway' },
  { id: 'NP', text: 'Nepal' },
  { id: 'NR', text: 'Nauru' },
  { id: 'NU', text: 'Niue' },
  { id: 'NZ', text: 'New Zealand' },
  { id: 'OM', text: 'Oman' },
  { id: 'PA', text: 'Panama' },
  { id: 'PE', text: 'Peru' },
  { id: 'PF', text: 'French Polynesia' },
  { id: 'PG', text: 'Papua New Guinea' },
  { id: 'PH', text: 'Philippines' },
  { id: 'PK', text: 'Pakistan' },
  { id: 'PL', text: 'Poland' },
  { id: 'PM', text: 'St. Pierre And Miquelon' },
  { id: 'PN', text: 'Pitcairn' },
  { id: 'PR', text: 'Puerto Rico' },
  { id: 'PT', text: 'Portugal' },
  { id: 'PW', text: 'Palau' },
  { id: 'PY', text: 'Paraguay' },
  { id: 'QA', text: 'Qatar' },
  { id: 'RE', text: 'Reunion' },
  { id: 'RO', text: 'Romania' },
  { id: 'RU', text: 'Russian Federation' },
  { id: 'RW', text: 'Rwanda' },
  { id: 'SA', text: 'Saudi Arabia' },
  { id: 'SB', text: 'Solomon Islands' },
  { id: 'SC', text: 'Seychelles' },
  { id: 'SD', text: 'Sudan' },
  { id: 'SE', text: 'Sweden' },
  { id: 'SG', text: 'Singapore' },
  { id: 'SH', text: 'St. Helena' },
  { id: 'SI', text: 'Slovenia' },
  { id: 'SJ', text: 'Svalbard And Jan Mayen Islands' },
  { id: 'SK', text: 'Slovakia (Slovak Republic)' },
  { id: 'SL', text: 'Sierra Leone' },
  { id: 'SM', text: 'San Marino' },
  { id: 'SN', text: 'Senegal' },
  { id: 'SO', text: 'Somalia' },
  { id: 'SR', text: 'Suriname' },
  { id: 'ST', text: 'Sao Tome And Principe' },
  { id: 'SV', text: 'El Salvador' },
  { id: 'SY', text: 'Syrian Arab Republic' },
  { id: 'SZ', text: 'Swaziland' },
  { id: 'TC', text: 'Turks And Caicos Islands' },
  { id: 'TD', text: 'Chad' },
  { id: 'TF', text: 'French Southern Territories' },
  { id: 'TG', text: 'Togo' },
  { id: 'TH', text: 'Thailand' },
  { id: 'TJ', text: 'Tajikistan' },
  { id: 'TK', text: 'Tokelau' },
  { id: 'TM', text: 'Turkmenistan' },
  { id: 'TN', text: 'Tunisia' },
  { id: 'TO', text: 'Tonga' },
  { id: 'TP', text: 'East Timor' },
  { id: 'TR', text: 'Turkey' },
  { id: 'TT', text: 'Trinidad And Tobago' },
  { id: 'TV', text: 'Tuvalu' },
  { id: 'TW', text: 'Taiwan, Province Of China' },
  { id: 'TZ', text: 'Tanzania, United Republic Of' },
  { id: 'UA', text: 'Ukraine' },
  { id: 'UG', text: 'Uganda' },
  { id: 'UM', text: 'U.S. Minor Islands' },
  { id: 'US', text: 'United States' },
  { id: 'UY', text: 'Uruguay' },
  { id: 'UZ', text: 'Uzbekistan' },
  { id: 'VA', text: 'Holy See (Vatican City State)' },
  { id: 'VC', text: 'Saint Vincent And The Grenadines' },
  { id: 'VE', text: 'Venezuela' },
  { id: 'VG', text: 'Virgin Islands (British)' },
  { id: 'VI', text: 'Virgin Islands (U.S.)' },
  { id: 'VN', text: 'Viet Nam' },
  { id: 'VU', text: 'Vanuatu' },
  { id: 'WF', text: 'Wallis And Futuna Islands' },
  { id: 'WS', text: 'Samoa' },
  { id: 'YE', text: 'Yemen' },
  { id: 'YT', text: 'Mayotte' },
  { id: 'YU', text: 'Yugoslavia (Serbia And Montenegro)' },
  { id: 'ZA', text: 'South Africa' },
  { id: 'ZM', text: 'Zambia' },
  { id: 'ZW', text: 'Zimbabwe' },
];
export const currencies = [
  { id: 'AUD', text: 'Australian Dollar' },
  { id: 'CAD', text: 'Canadian Dollar' },
  { id: 'CHF', text: 'Swiss Franc' },
  { id: 'CNY', text: 'Yuan Renminbi' },
  { id: 'DKK', text: 'Danish Krone' },
  { id: 'EUR', text: 'Euro' },
  { id: 'GBP', text: 'Pound Sterling' },
  { id: 'HKD', text: 'Hongkong Dollar' },
  { id: 'INR', text: 'Indian Rupee' },
  { id: 'JPY', text: 'Yen' },
  { id: 'KRW', text: 'Korean Won' },
  { id: 'KWD', text: 'Kuwaiti Dinar' },
  { id: 'MYR', text: 'Malaysian Ringgit' },
  { id: 'NOK', text: 'Norwegian Kroner' },
  { id: 'RUB', text: 'Russian Ruble' },
  { id: 'SAR', text: 'Saudi Rial' },
  { id: 'SEK', text: 'Swedish Krona' },
  { id: 'SGD', text: 'Singapore Dollar' },
  { id: 'THB', text: 'Thailand Baht' },
  { id: 'USD', text: 'Us Dollar' },
  { id: 'VND', text: 'Viet Nam Dong' },
];

export const languages = [
  { id: ILanguage.EN, text: 'languages.EN' },
  { id: ILanguage.VN, text: 'languages.VN' },
]

export const mergeCellSubtotal = (dataRow: any[], cellIdx: number) => {
  //Merge cells until the first non-null value
  if (cellIdx > 0) return 1;
  let count = 0;
  for (let i = cellIdx; i < dataRow.length; i++) {
    if (dataRow[i] === null) {
      count++;
    } else {
      if (count > 0) break;
    }
  }
  return count + 1;
};

export const isMergeCellSubtotal = (dataRow: any[], cellIdx: number) => {
  const mergeStart = 0;
  const mergeEnd = mergeCellSubtotal(dataRow, mergeStart);
  if (cellIdx >= mergeStart && cellIdx < mergeEnd) {
    return true;
  }
  return false;
};

export function withAlpha(color, opacity) {
  // Case 1: normal color (hex, rgb, hsl…)
  if (/^#|rgb|hsl|color/i.test(color)) {
    return alpha(color, opacity);
  }

  // Case 2: CSS Var: var(--mui-palette-xxx) or var(--palette-xxx, #hex)
  if (color.startsWith('var(')) {
    // inject "Channel" *before the closing parenthesis of the var name only*
    return color.replace(/(--[a-zA-Z0-9-]+)(.*)\)/, `$1Channel$2)`).replace(/^var\((.+)\)$/, `rgba(var($1) / ${opacity})`);
  }

  // Fallback
  return color;
}
export function getColors(theme, color) {
  switch (color) {
    case 'grey':
      return theme.palette.grey;
    case 'secondary':
      return theme.palette.secondary;
    case 'error':
      return theme.palette.error;
    case 'warning':
      return theme.palette.warning;
    case 'info':
      return theme.palette.info;
    case 'success':
      return theme.palette.success;
    default:
      return theme.palette.primary;
  }
}

export function getShadow(theme, shadow) {
  switch (shadow) {
    case 'secondary':
      return theme.customShadows.secondary;
    case 'error':
      return theme.customShadows.error;
    case 'warning':
      return theme.customShadows.warning;
    case 'info':
      return theme.customShadows.info;
    case 'success':
      return theme.customShadows.success;
    // case 'primaryButton':
    //   return theme.customShadows.primaryButton;
    // case 'secondaryButton':
    //   return theme.customShadows.secondaryButton;
    case 'errorButton':
      return theme.customShadows.errorButton;
    case 'warningButton':
      return theme.customShadows.warningButton;
    case 'infoButton':
      return theme.customShadows.infoButton;
    case 'successButton':
      return theme.customShadows.successButton;
    // default:
    //   return theme.customShadows.primary;
  }
}
