import { useState, useEffect, useMemo, useCallback } from 'react';
import './PricingCalculator.css';
import {
  PRICING_DEFAULTS,
  WORK_LEVELS,
  WORK_LEVEL_LABELS,
  CONSTANT_LABELS,
  CURRENCY,
  CONSTANTS_STORAGE_KEY,
  UNLOCKED_STORAGE_KEY
} from './pricingConfig';
import { calculatePrice, formatAmount, toNumber } from './pricingFormula';

/** The constants the settings panel can edit - the material price is a per-quote input. */
const editableDefaults = () => ({
  handlingFee: PRICING_DEFAULTS.handlingFee,
  printerHourlyRate: PRICING_DEFAULTS.printerHourlyRate,
  roundToNearest: PRICING_DEFAULTS.roundToNearest,
  glueLevels: { ...PRICING_DEFAULTS.glueLevels },
  paintLevels: { ...PRICING_DEFAULTS.paintLevels },
  extraMaterials: PRICING_DEFAULTS.extraMaterials.map((material) => ({ ...material }))
});

const loadConstants = () => {
  const defaults = editableDefaults();
  try {
    const saved = window.localStorage?.getItem(CONSTANTS_STORAGE_KEY);
    if (!saved) return defaults;
    const parsed = JSON.parse(saved);

    // Labels and the list of materials always come from the config file, so a
    // material added there later shows up even if older prices were saved.
    const savedPrices = {};
    (parsed.extraMaterials || []).forEach((material) => {
      if (material && material.id !== undefined) savedPrices[material.id] = material.price;
    });

    return {
      ...defaults,
      ...parsed,
      glueLevels: { ...defaults.glueLevels, ...parsed.glueLevels },
      paintLevels: { ...defaults.paintLevels, ...parsed.paintLevels },
      extraMaterials: defaults.extraMaterials.map((material) =>
        savedPrices[material.id] !== undefined
          ? { ...material, price: savedPrices[material.id] }
          : material
      )
    };
  } catch (err) {
    return defaults;
  }
};

/** Every extra material starts unticked, at the default quantity. */
const initialExtras = () =>
  PRICING_DEFAULTS.extraMaterials.reduce((acc, material) => {
    acc[material.id] = {
      checked: false,
      quantity: PRICING_DEFAULTS.extraMaterialDefaultQuantity
    };
    return acc;
  }, {});

const sha256Hex = async (text) => {
  const digest = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Optional password curtain. Active only when one of these build-time variables is set:
 *   REACT_APP_PRICING_PASSWORD_SHA256  (preferred - the password itself never ships)
 *   REACT_APP_PRICING_PASSWORD        (plain text fallback)
 * See PRICING_CALCULATOR.md for what this does and does not protect.
 */
function PasswordGate({ children }) {
  const expectedHash = (process.env.REACT_APP_PRICING_PASSWORD_SHA256 || '').trim().toLowerCase();
  const expectedPlain = process.env.REACT_APP_PRICING_PASSWORD || '';
  const gateEnabled = Boolean(expectedHash || expectedPlain);

  const [unlocked, setUnlocked] = useState(() => {
    if (!gateEnabled) return true;
    try {
      return window.sessionStorage?.getItem(UNLOCKED_STORAGE_KEY) === '1';
    } catch (err) {
      return false;
    }
  });
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setChecking(true);
    setError('');
    try {
      let ok;
      if (expectedHash) {
        if (!window.crypto?.subtle) {
          setError('בדיקת הסיסמה דורשת חיבור מאובטח (https או localhost).');
          return;
        }
        ok = (await sha256Hex(value)) === expectedHash;
      } else {
        ok = value === expectedPlain;
      }

      if (!ok) {
        setError('סיסמה שגויה.');
        setValue('');
        return;
      }

      try {
        window.sessionStorage?.setItem(UNLOCKED_STORAGE_KEY, '1');
      } catch (err) {
        // Storage blocked - the unlock just will not survive a refresh.
      }
      setUnlocked(true);
    } finally {
      setChecking(false);
    }
  };

  if (unlocked) return children;

  return (
    <div className="pc-gate">
      <form className="pc-card pc-gate-card" onSubmit={handleSubmit}>
        <h1 className="pc-gate-title">🔒 אזור פרטי</h1>
        <p className="pc-gate-subtitle">הזן סיסמה כדי להמשיך</p>
        <input
          type="password"
          className="pc-input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          autoFocus
          autoComplete="current-password"
          aria-label="סיסמה"
        />
        {error && <span className="pc-error">{error}</span>}
        <button type="submit" className="pc-primary-btn" disabled={checking}>
          {checking ? 'בודק…' : 'כניסה'}
        </button>
      </form>
    </div>
  );
}

function Calculator() {
  const [constants, setConstants] = useState(loadConstants);
  const [inputs, setInputs] = useState({
    materialPricePerKg: PRICING_DEFAULTS.materialPricePerKg,
    grams: '',
    hours: '',
    glue: 'none',
    paint: 'none',
    extras: initialExtras()
  });
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    try {
      window.localStorage?.setItem(CONSTANTS_STORAGE_KEY, JSON.stringify(constants));
    } catch (err) {
      // Storage blocked - tweaks stay for this session only.
    }
  }, [constants]);

  const setInput = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setConstant = useCallback((field, value) => {
    setConstants((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setLevel = useCallback((group, level, value) => {
    setConstants((prev) => ({ ...prev, [group]: { ...prev[group], [level]: value } }));
  }, []);

  const setExtra = useCallback((id, patch) => {
    setInputs((prev) => ({
      ...prev,
      extras: { ...prev.extras, [id]: { ...prev.extras[id], ...patch } }
    }));
  }, []);

  const setExtraPrice = useCallback((id, price) => {
    setConstants((prev) => ({
      ...prev,
      extraMaterials: prev.extraMaterials.map((material) =>
        material.id === id ? { ...material, price } : material
      )
    }));
  }, []);

  const { lines, subtotal, total, roundingDiff } = useMemo(
    () => calculatePrice(inputs, constants),
    [inputs, constants]
  );

  const resetConstants = () => setConstants(editableDefaults());

  const resetInputs = () =>
    setInputs({
      materialPricePerKg: PRICING_DEFAULTS.materialPricePerKg,
      grams: '',
      hours: '',
      glue: 'none',
      paint: 'none',
      extras: initialExtras()
    });

  const levelOptions = (group) =>
    WORK_LEVELS.map((level) => {
      const price = toNumber(constants[group][level]);
      return (
        <option key={level} value={level}>
          {WORK_LEVEL_LABELS[level]}
          {price > 0 ? ` (+${formatAmount(price)} ${CURRENCY})` : ''}
        </option>
      );
    });

  const levelInputs = (group) =>
    WORK_LEVELS.filter((level) => level !== 'none').map((level) => (
      <label className="pc-field pc-field-compact" key={`${group}-${level}`}>
        <span className="pc-label">{WORK_LEVEL_LABELS[level]}</span>
        <input
          type="number"
          className="pc-input"
          inputMode="decimal"
          min="0"
          step="1"
          value={constants[group][level]}
          onChange={(event) => setLevel(group, level, event.target.value)}
        />
      </label>
    ));

  return (
    <div className="pc-page" dir="rtl">
      <header className="pc-header">
        <h1 className="pc-title">מחשבון תמחור</h1>
        <p className="pc-subtitle">כלי פנימי — לא מקושר מהאתר</p>
      </header>

      <main className="pc-main">
        <section className="pc-card">
          <h2 className="pc-card-title">פרטי ההדפסה</h2>

          <label className="pc-field">
            <span className="pc-label">מחיר חומר לק״ג ({CURRENCY})</span>
            <input
              type="number"
              className="pc-input"
              inputMode="decimal"
              min="0"
              step="1"
              value={inputs.materialPricePerKg}
              onChange={(event) => setInput('materialPricePerKg', event.target.value)}
            />
          </label>

          <label className="pc-field">
            <span className="pc-label">כמות חומר (גרם)</span>
            <input
              type="number"
              className="pc-input"
              inputMode="decimal"
              min="0"
              step="1"
              placeholder="0"
              value={inputs.grams}
              onChange={(event) => setInput('grams', event.target.value)}
            />
          </label>

          <label className="pc-field">
            <span className="pc-label">זמן הדפסה (שעות)</span>
            <input
              type="number"
              className="pc-input"
              inputMode="decimal"
              min="0"
              step="0.5"
              placeholder="0"
              value={inputs.hours}
              onChange={(event) => setInput('hours', event.target.value)}
            />
          </label>

          <label className="pc-field">
            <span className="pc-label">עבודת הדבקה</span>
            <select
              className="pc-input pc-select"
              value={inputs.glue}
              onChange={(event) => setInput('glue', event.target.value)}
            >
              {levelOptions('glueLevels')}
            </select>
          </label>

          <label className="pc-field">
            <span className="pc-label">עבודת צביעה</span>
            <select
              className="pc-input pc-select"
              value={inputs.paint}
              onChange={(event) => setInput('paint', event.target.value)}
            >
              {levelOptions('paintLevels')}
            </select>
          </label>

          <fieldset className="pc-fieldset">
            <legend className="pc-label">חומרים נוספים</legend>
            {constants.extraMaterials.map((material) => {
              const chosen = inputs.extras[material.id] || {};
              return (
                <div
                  className={`pc-extra ${chosen.checked ? 'is-checked' : ''}`}
                  key={material.id}
                >
                  <label className="pc-extra-choice">
                    <input
                      type="checkbox"
                      className="pc-checkbox"
                      checked={Boolean(chosen.checked)}
                      onChange={(event) => setExtra(material.id, { checked: event.target.checked })}
                    />
                    <span className="pc-extra-text">
                      <span className="pc-extra-name">{material.label}</span>
                      <span className="pc-extra-price">
                        {formatAmount(toNumber(material.price))} {CURRENCY} ליח׳
                      </span>
                    </span>
                  </label>
                  <input
                    type="number"
                    className="pc-input pc-extra-quantity"
                    inputMode="numeric"
                    min="0"
                    step="1"
                    aria-label={`כמות — ${material.label}`}
                    disabled={!chosen.checked}
                    value={chosen.quantity ?? ''}
                    onChange={(event) => setExtra(material.id, { quantity: event.target.value })}
                  />
                </div>
              );
            })}
          </fieldset>

          <button type="button" className="pc-ghost-btn" onClick={resetInputs}>
            נקה שדות
          </button>
        </section>

        <section className="pc-card pc-result-card">
          <h2 className="pc-card-title">פירוט המחיר</h2>

          <div className="pc-breakdown">
            {lines.map((line) => (
              <div className="pc-row" key={line.key}>
                <div className="pc-row-info">
                  <span className="pc-row-label">{line.label}</span>
                  {line.detail && <span className="pc-row-detail">{line.detail}</span>}
                </div>
                <span className="pc-row-amount">
                  {formatAmount(line.amount)} {CURRENCY}
                </span>
              </div>
            ))}

            <div className="pc-row pc-row-subtotal">
              <span className="pc-row-label">סכום ביניים</span>
              <span className="pc-row-amount">
                {formatAmount(subtotal)} {CURRENCY}
              </span>
            </div>

            {toNumber(constants.roundToNearest) > 0 && (
              <div className="pc-row pc-row-rounding">
                <span className="pc-row-label">
                  עיגול ל־{formatAmount(toNumber(constants.roundToNearest))} {CURRENCY}
                </span>
                <span className="pc-row-amount">
                  {roundingDiff >= 0 ? '+' : '−'}
                  {formatAmount(Math.abs(roundingDiff))} {CURRENCY}
                </span>
              </div>
            )}
          </div>

          <div className="pc-total">
            <span className="pc-total-label">מחיר סופי</span>
            <span className="pc-total-amount">
              {formatAmount(total)} {CURRENCY}
            </span>
          </div>
        </section>

        <section className="pc-card">
          <button
            type="button"
            className="pc-settings-toggle"
            onClick={() => setShowSettings((prev) => !prev)}
            aria-expanded={showSettings}
          >
            <span>⚙️ קבועי תמחור</span>
            <span className="pc-chevron">{showSettings ? '▲' : '▼'}</span>
          </button>

          {showSettings && (
            <div className="pc-settings">
              <p className="pc-hint">
                שינויים כאן משפיעים מיד על המחיר ונשמרים בדפדפן. ברירות המחדל נמצאות ב־
                <code>src/pricingConfig.js</code>.
              </p>

              <label className="pc-field">
                <span className="pc-label">
                  {CONSTANT_LABELS.handlingFee} ({CURRENCY})
                </span>
                <input
                  type="number"
                  className="pc-input"
                  inputMode="decimal"
                  min="0"
                  step="1"
                  value={constants.handlingFee}
                  onChange={(event) => setConstant('handlingFee', event.target.value)}
                />
              </label>

              <label className="pc-field">
                <span className="pc-label">
                  {CONSTANT_LABELS.printerHourlyRate} ({CURRENCY} לשעה)
                </span>
                <input
                  type="number"
                  className="pc-input"
                  inputMode="decimal"
                  min="0"
                  step="0.5"
                  value={constants.printerHourlyRate}
                  onChange={(event) => setConstant('printerHourlyRate', event.target.value)}
                />
              </label>

              <label className="pc-field">
                <span className="pc-label">
                  {CONSTANT_LABELS.roundToNearest} ({CURRENCY})
                </span>
                <input
                  type="number"
                  className="pc-input"
                  inputMode="decimal"
                  min="0"
                  step="1"
                  value={constants.roundToNearest}
                  onChange={(event) => setConstant('roundToNearest', event.target.value)}
                />
              </label>

              <h3 className="pc-settings-title">עבודת הדבקה ({CURRENCY})</h3>
              <div className="pc-level-grid">{levelInputs('glueLevels')}</div>

              <h3 className="pc-settings-title">עבודת צביעה ({CURRENCY})</h3>
              <div className="pc-level-grid">{levelInputs('paintLevels')}</div>

              <h3 className="pc-settings-title">חומרים נוספים ({CURRENCY} ליח׳)</h3>
              {constants.extraMaterials.map((material) => (
                <label className="pc-field pc-field-inline" key={`price-${material.id}`}>
                  <span className="pc-label">{material.label}</span>
                  <input
                    type="number"
                    className="pc-input"
                    inputMode="decimal"
                    min="0"
                    step="0.5"
                    value={material.price}
                    onChange={(event) => setExtraPrice(material.id, event.target.value)}
                  />
                </label>
              ))}

              <button type="button" className="pc-ghost-btn" onClick={resetConstants}>
                שחזר ברירות מחדל
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default function PricingCalculatorPage() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'מחשבון תמחור';
    document.documentElement.lang = 'he';
    document.documentElement.dir = 'rtl';

    // Belt and braces: the page is unlinked, and it also asks crawlers to skip it.
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow, noarchive';
    document.head.appendChild(meta);

    return () => {
      document.title = previousTitle;
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <PasswordGate>
      <Calculator />
    </PasswordGate>
  );
}
