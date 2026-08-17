import { calculatePrice, roundToStep, toNumber } from './pricingFormula';
import { PRICING_DEFAULTS } from './pricingConfig';

const constants = {
  handlingFee: PRICING_DEFAULTS.handlingFee,
  printerHourlyRate: PRICING_DEFAULTS.printerHourlyRate,
  roundToNearest: PRICING_DEFAULTS.roundToNearest,
  glueLevels: PRICING_DEFAULTS.glueLevels,
  paintLevels: PRICING_DEFAULTS.paintLevels
};

const amountOf = (result, key) => result.lines.find((line) => line.key === key).amount;

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

test('breaks a quote down into its five components', () => {
  const result = calculatePrice(
    { materialPricePerKg: 60, grams: 100, hours: 4, glue: 'light', paint: 'medium' },
    constants
  );

  expect(amountOf(result, 'material')).toBeCloseTo(6);
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
    { materialPricePerKg: 60, grams: '', hours: '', glue: 'none', paint: 'none' },
    constants
  );

  expect(result.subtotal).toBe(8);
  expect(result.total).toBe(10);
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
