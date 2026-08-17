import { calculatePrice, calculateExtras, roundToStep, toNumber } from './pricingFormula';
import { PRICING_DEFAULTS } from './pricingConfig';

const constants = {
  handlingFee: PRICING_DEFAULTS.handlingFee,
  printerHourlyRate: PRICING_DEFAULTS.printerHourlyRate,
  roundToNearest: PRICING_DEFAULTS.roundToNearest,
  glueLevels: PRICING_DEFAULTS.glueLevels,
  paintLevels: PRICING_DEFAULTS.paintLevels,
  extraMaterials: PRICING_DEFAULTS.extraMaterials
};

const amountOf = (result, key) => result.lines.find((line) => line.key === key).amount;

const detailOf = (result, key) => result.lines.find((line) => line.key === key).detail;

const noExtras = { clicker: { checked: false, quantity: 1 } };

test('toNumber falls back to 0 for blank and invalid values', () => {
  expect(toNumber('')).toBe(0);
  expect(toNumber('abc')).toBe(0);
  expect(toNumber('-5')).toBe(0);
  expect(toNumber('12.5')).toBe(12.5);
});

test('roundToStep rounds to the nearest multiple, and is a no-op for step 0', () => {
  expect(roundToStep(42, 5)).toBe(40);
  expect(roundToStep(43, 5)).toBe(45);
  expect(roundToStep(42.5, 5)).toBe(45);
  expect(roundToStep(42, 0)).toBe(42);
});

test('breaks a quote down into its components', () => {
  const result = calculatePrice(
    {
      materialPricePerKg: 60,
      grams: 100,
      hours: 4,
      glue: 'light',
      paint: 'medium',
      extras: noExtras
    },
    constants
  );

  expect(amountOf(result, 'material')).toBeCloseTo(6);
  expect(amountOf(result, 'extras')).toBe(0);
  expect(amountOf(result, 'handling')).toBe(8);
  expect(amountOf(result, 'printer')).toBe(8);
  expect(amountOf(result, 'glue')).toBe(5);
  expect(amountOf(result, 'paint')).toBe(20);
  expect(result.subtotal).toBeCloseTo(47);
  expect(result.total).toBe(45);
  expect(result.roundingDiff).toBeCloseTo(-2);
});

test('an empty form still charges the fixed handling fee', () => {
  const result = calculatePrice(
    { materialPricePerKg: 60, grams: '', hours: '', glue: 'none', paint: 'none', extras: {} },
    constants
  );

  expect(result.subtotal).toBe(8);
  expect(result.total).toBe(10);
});

test('sums only the ticked extra materials, times their quantity', () => {
  const extras = calculateExtras(
    {
      clicker: { checked: true, quantity: 2 },   // 1.5 x 2 = 3
      magnet: { checked: false, quantity: 10 },  // ignored
      keyring: { checked: true, quantity: 1 }    // 2 x 1 = 2
    },
    PRICING_DEFAULTS.extraMaterials
  );

  expect(extras.amount).toBeCloseTo(5);
  expect(extras.picked.map((material) => material.id)).toEqual(['clicker', 'keyring']);
});

test('extra materials land on their own breakdown line and reach the total', () => {
  const inputs = {
    materialPricePerKg: 60,
    grams: 100,
    hours: 4,
    glue: 'none',
    paint: 'none',
    extras: {
      clicker: { checked: true, quantity: 2 },
      keyring: { checked: true, quantity: 1 }
    }
  };
  const result = calculatePrice(inputs, constants);

  // 6 material + 5 extras + 8 handling + 8 printer = 27 -> 25
  expect(amountOf(result, 'extras')).toBeCloseTo(5);
  expect(detailOf(result, 'extras')).toBe('קליקר ×2 · מחזיק מפתחות (טבעת) ×1');
  expect(result.subtotal).toBeCloseTo(27);
  expect(result.total).toBe(25);

  // The same quote without the extras is 5 cheaper before rounding.
  const without = calculatePrice({ ...inputs, extras: {} }, constants);
  expect(without.subtotal).toBeCloseTo(22);
  expect(detailOf(without, 'extras')).toBe('לא נבחרו');
});

test('extra material prices can be overridden at runtime', () => {
  const result = calculatePrice(
    {
      materialPricePerKg: 60,
      grams: '',
      hours: '',
      glue: 'none',
      paint: 'none',
      extras: { magnet: { checked: true, quantity: 4 } }
    },
    {
      ...constants,
      extraMaterials: [{ id: 'magnet', label: 'מגנט', price: '2.5' }]
    }
  );

  expect(amountOf(result, 'extras')).toBeCloseTo(10);
});

test('honours constants edited at runtime', () => {
  const result = calculatePrice(
    { materialPricePerKg: 80, grams: 250, hours: 10, glue: 'hard', paint: 'hard' },
    { ...constants, handlingFee: '12', printerHourlyRate: '3', roundToNearest: '10' }
  );

  // 20 material + 12 handling + 30 printer + 15 glue + 30 paint = 107
  expect(result.subtotal).toBeCloseTo(107);
  expect(result.total).toBe(110);
});
