import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import PricingCalculator from './PricingCalculator';
import { CALCULATOR_PATH } from './pricingConfig';

const normalize = (value) => (value || '').replace(/\/+$/, '').toLowerCase() || '/';

/**
 * The pricing calculator is an unlisted page. It answers on the real path and on
 * the equivalent hash route, so it also works on hosts without SPA rewrite rules.
 */
const isPricingRoute = () => {
  const target = normalize(CALCULATOR_PATH);
  return (
    normalize(window.location.pathname) === target ||
    normalize(window.location.hash.replace(/^#/, '')) === target
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {isPricingRoute() ? <PricingCalculator /> : <App />}
  </React.StrictMode>
);
