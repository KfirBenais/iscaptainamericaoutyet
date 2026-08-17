/**
 * Configuration for the internal pricing calculator.
 *
 * This is a private, unlisted page - it is not linked from the site, not in the
 * menu, not in the footer. Everything the calculator uses is defined here so the
 * numbers can be tuned without touching the component code.
 */

/**
 * The unlisted route the calculator lives on.
 * Reachable as both a real path and a hash route:
 *   https://<site>/x/27d16ba9b5ac9e6d
 *   https://<site>/#/x/27d16ba9b5ac9e6d      (works without any host redirect rules)
 * Change this string to rotate the address.
 */
export const SECRET_PATH = '/x/27d16ba9b5ac9e6d';

/** Every price component of the formula, in shekels. */
export const PRICING_DEFAULTS = {
  /** Seed value for the "material price per kg" input - editable per quote. */
  materialPricePerKg: 60,
  /** Fixed per-item handling: prep, removing from the printer, cleaning the base. */
  handlingFee: 8,
  /** Printer running cost per hour (electricity + wear, hobby rates - not commercial). */
  printerHourlyRate: 2,
  /** Gluing work by difficulty. */
  glueLevels: { none: 0, light: 5, medium: 10, hard: 15 },
  /** Painting work by difficulty. */
  paintLevels: { none: 0, light: 10, medium: 20, hard: 30 },
  /** The final price is rounded to the nearest multiple of this. */
  roundToNearest: 5
};

/** Order the difficulty options are rendered in. */
export const WORK_LEVELS = ['none', 'light', 'medium', 'hard'];

/** Hebrew labels for the difficulty options. */
export const WORK_LEVEL_LABELS = {
  none: 'אין',
  light: 'קלה',
  medium: 'בינונית',
  hard: 'קשה'
};

/** Hebrew labels for the editable constants, used by the settings panel. */
export const CONSTANT_LABELS = {
  handlingFee: 'דמי טיפול קבועים לפריט',
  printerHourlyRate: 'עלות שעת מדפסת',
  roundToNearest: 'עיגול מחיר סופי'
};

export const CURRENCY = '₪';

/** localStorage key for constants tweaked live in the settings panel. */
export const CONSTANTS_STORAGE_KEY = 'pricingCalculator.constants.v1';

/** sessionStorage key remembering that the password gate was passed. */
export const UNLOCKED_STORAGE_KEY = 'pricingCalculator.unlocked.v1';
