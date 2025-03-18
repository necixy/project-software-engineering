import moment from 'moment';

const minimumTodayDate = moment().startOf('day').toDate();

const maxOneYear = moment().add(1, 'year').startOf('day').toDate();

const minimum120Year = moment().subtract(100, 'years').startOf('day').toDate();
const MAX_DATE = moment().subtract(1, 'days').toDate();

const formatDateBasedOnCountry = ({
  date,
  countryCode,
}: {
  date: string;
  countryCode: string;
}) => {
  // Ensure 'date' is a valid Date object
  const validDate: any = new Date(date);
  console.log(validDate)
  // Check if the date is valid
  if (isNaN(validDate)) {
    throw new Error('Invalid date provided');
  }

  // Create a map of common locales and their associated date formats
  const locales = {
    US: 'en-US', // MM-DD-YYYY (U.S. format)
    GB: 'en-GB', // DD-MM-YYYY (UK format)
    IN: 'en-IN', // DD-MM-YYYY (India format)
    CN: 'zh-CN', // YYYY-MM-DD (China format)
    DE: 'de-DE', // DD.MM.YYYY (Germany format)
    FR: 'fr-FR', // DD/MM/YYYY (France format)
    // Add more countries as needed
  };

  // Use default to 'en-US' if the country code isn't specified or mapped
  const locale = locales.countryCode || 'en-US';

  // Use the Intl.DateTimeFormat API to format the date
  const formatter = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return formatter.format(validDate);
};

export {
  minimumTodayDate,
  maxOneYear,
  minimum120Year,
  MAX_DATE,
  formatDateBasedOnCountry,
};
