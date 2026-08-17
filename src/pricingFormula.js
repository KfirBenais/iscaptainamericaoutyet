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
 * Sums the ticked extra materials, and describes what was picked.
 *
 * @param {object} selection  { [id]: { checked, quantity } }
 * @param {Array}  catalog    [{ id, label, price }]
 */
export function calculateExtras(selection, catalog) {
  const picked = (catalog || [])
    .map((material) => {
      const chosen = (selection || {})[material.id];
      if (!chosen || !chosen.checked) return null;
      const quantity = toNumber(chosen.quantity);
      return { ...material, quantity, amount: toNumber(material.price) * quantity };
    })
    .filter(Boolean);

  return {
    picked,
    amount: picked.reduce((sum, material) => sum + material.amount, 0)
  };
}

/**
 * Builds a full price breakdown.
 *
 * @param {object} inputs    { materialPricePerKg, grams, hours, glue, paint, extras }
 * @param {object} constants { handlingFee, printerHourlyRate, glueLevels, paintLevels,
 *                             extraMaterials, roundToNearest }
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
  const extras = calculateExtras(inputs.extras, constants.extraMaterials);

  const lines = [
    {
      key: 'material',
      label: 'חומר',
      detail: `${grams} גרם × ${pricePerKg} ₪ לק״ג`,
      amount: materialCost
    },
    {
      key: 'extras',
      label: 'חומרים נוספים',
      detail: extras.picked.length
        ? extras.picked
            .map((material) => `${material.label} ×${material.quantity}`)
            .join(' · ')
        : 'לא נבחרו',
      amount: extras.amount
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

/** Trims floating point noise and formats an amount for display (6, 1.5, 0.25). */
export const formatAmount = (amount) => String(Math.round(amount * 100) / 100);
