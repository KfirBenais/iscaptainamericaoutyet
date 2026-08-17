/**
 * The pricing formula, kept pure so it can be tested on its own.
 * All the numbers it works with come from the caller (see pricingConfig.js).
 */

/** Parses a form value into a non-negative number; blank / garbage becomes 0. */
export const toNumber = (value) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

/** Rounds to the nearest `step` shekels. A step of 0 means no rounding. */
export const roundToStep = (amount, step) => {
  if (!Number.isFinite(step) || step <= 0) return amount;
  return Math.round(amount / step) * step;
};

/**
 * Builds a full price breakdown.
 *
 * @param {object} inputs    { materialPricePerKg, grams, hours, glue, paint }
 * @param {object} constants { handlingFee, printerHourlyRate, glueLevels, paintLevels, roundToNearest }
 * @returns {{ lines: Array, subtotal: number, total: number, roundingDiff: number }}
 */
export function calculatePrice(inputs, constants) {
  const grams = toNumber(inputs.grams);
  const hours = toNumber(inputs.hours);
  const pricePerKg = toNumber(inputs.materialPricePerKg);

  const materialCost = (grams / 1000) * pricePerKg;
  const handlingFee = toNumber(constants.handlingFee);
  const printerCost = hours * toNumber(constants.printerHourlyRate);
  const glueCost = toNumber(constants.glueLevels[inputs.glue]);
  const paintCost = toNumber(constants.paintLevels[inputs.paint]);

  const lines = [
    {
      key: 'material',
      label: 'חומר',
      detail: `${grams} גרם × ${pricePerKg} ₪ לק״ג`,
      amount: materialCost
    },
    {
      key: 'handling',
      label: 'דמי טיפול',
      detail: 'הכנה, הסרה מהמדפסת, ניקוי בייס',
      amount: handlingFee
    },
    {
      key: 'printer',
      label: 'זמן מדפסת',
      detail: `${hours} שעות × ${toNumber(constants.printerHourlyRate)} ₪ לשעה`,
      amount: printerCost
    },
    {
      key: 'glue',
      label: 'הדבקה',
      detail: null,
      amount: glueCost
    },
    {
      key: 'paint',
      label: 'צביעה',
      detail: null,
      amount: paintCost
    }
  ];

  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
  const total = roundToStep(subtotal, toNumber(constants.roundToNearest));

  return { lines, subtotal, total, roundingDiff: total - subtotal };
}

/** Trims floating point noise and formats an amount for display. */
export const formatAmount = (amount) => {
  const rounded = Math.round(amount * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
};
