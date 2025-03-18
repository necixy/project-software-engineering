function getCurrencySymbol(currency?: string) {
  try {
    return (0)
      .toLocaleString('en', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      .replace(/\d/g, '')
      .trim();
  } catch (error) {
    return '£';
  }
}

export {getCurrencySymbol};
