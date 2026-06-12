export const formatCurrency = (value: number, currency = 'LSL') =>
  new Intl.NumberFormat('en-LS', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value)
