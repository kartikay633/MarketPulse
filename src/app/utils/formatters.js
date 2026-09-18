// ROADMAP: Section 5 & 28 — Indian Number & Currency Formatters

/**
 * Format currency in Indian Rupees (₹) with Indian numbering (Lakhs/Crores)
 * e.g. 1000000 -> ₹10,00,000.00
 */
export function formatINR(val, options = {}) {
  if (val === null || val === undefined || isNaN(val)) return '₹0.00';
  const num = Number(val);
  const { decimals = 2, compact = false } = options;

  if (compact) {
    if (Math.abs(num) >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    if (Math.abs(num) >= 100000) {
      return `₹${(num / 100000).toFixed(2)} L`;
    }
    if (Math.abs(num) >= 1000) {
      return `₹${(num / 1000).toFixed(2)} K`;
    }
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format volume in Indian Lakhs/Crores or K/M
 */
export function formatVolume(val) {
  if (!val || isNaN(val)) return '0';
  const num = Number(val);
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    return `${(num / 100000).toFixed(2)} L`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)} K`;
  }
  return num.toLocaleString('en-IN');
}

/**
 * Format percentage change with + or - sign
 * e.g. 1.25 -> +1.25%
 */
export function formatPercent(val, decimals = 2) {
  if (val === null || val === undefined || isNaN(val)) return '0.00%';
  const num = Number(val);
  const sign = num > 0 ? '+' : '';
  return `${sign}${num.toFixed(decimals)}%`;
}

/**
 * Format plain number with Indian comma separators
 */
export function formatNumber(val, decimals = 2) {
  if (val === null || val === undefined || isNaN(val)) return '0';
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number(val));
}

export const formatIndianCurrency = formatINR;
export const formatIndianNumber = formatNumber;
