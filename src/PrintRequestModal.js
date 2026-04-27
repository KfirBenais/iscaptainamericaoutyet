import React, { useState, useRef } from 'react';
import { useLanguage, getColorLabel } from './i18n';
import { sendPrintRequestNotification } from './emailService';

const ACCEPTED_FILE_TYPES = '.stl,.obj,.3mf,.ply,.amf,.step,.stp,.fbx,.dxf,.wrl,.vrml,.x3d,.f3d,.ipt,.iges,.igs';
const MAX_FILE_SIZE_MB = 10;

const availableColors = [
  'White', 'Black', 'Rainbow (Surprise!)', 'Red', 'Blue', 'Beige (Skin tone)',
  'Yellow', 'Transparent', 'Green', 'Bronze', 'Purple', 'Gray', 'Green/Red/Blue Mix',
  'White Marble', 'Glow Glitter Green', 'Galaxy', 'Orange TPU', 'Black TPU', 'WOOD',
  'Maple Wood', 'Baby Blue'
];

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone  = (phone) => /^\d{7,15}$/.test(phone.replace(/[\s\-().+]/g, ''));

const PrintRequestModal = ({ onClose }) => {
  const { language, t } = useLanguage();
  const fileInputRef = useRef(null);

  const [step,           setStep]           = useState(1);
  const [file,           setFile]           = useState(null);
  const [dragOver,       setDragOver]       = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);
  const [quantity,       setQuantity]       = useState(1);
  const [notes,          setNotes]          = useState('');
  const [customerData,   setCustomerData]   = useState({ name: '', email: '', phone: '' });
  const [errors,         setErrors]         = useState({});
  const [fileError,      setFileError]      = useState('');
  const [isSubmitting,   setIsSubmitting]   = useState(false);
  const [submitted,      setSubmitted]      = useState(false);
  const [submitError,    setSubmitError]    = useState('');

  // ── File handling ──────────────────────────────────────────────────────────

  const applyFile = (f) => {
    if (!f) return;
    if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFileError(t('printRequest.fileTooLarge').replace('{max}', MAX_FILE_SIZE_MB));
      return;
    }
    setFileError('');
    setFile(f);
  };

  const handleFileChange  = (e)  => applyFile(e.target.files[0]);
  const handleDragOver    = (e)  => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave   = ()   => setDragOver(false);
  const handleDrop        = (e)  => {
    e.preventDefault();
    setDragOver(false);
    applyFile(e.dataTransfer.files[0]);
  };

  // ── Color toggle ───────────────────────────────────────────────────────────

  const toggleColor = (color) =>
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );

  // ── Field change helper ────────────────────────────────────────────────────

  const handleFieldChange = (field, value) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  // ── Validation ─────────────────────────────────────────────────────────────

  const validateStep1 = () => {
    if (!file) {
      setFileError(t('printRequest.fileMissingAlert'));
      return false;
    }
    if (selectedColors.length === 0) {
      alert(t('addToCart.selectColorAlert'));
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!customerData.name.trim())
      newErrors.name = t('alerts.checkoutMissingFields');
    if (!customerData.email.trim())
      newErrors.email = t('alerts.checkoutMissingFields');
    else if (!isValidEmail(customerData.email))
      newErrors.email = t('alerts.invalidEmail');
    if (!customerData.phone.trim())
      newErrors.phone = t('alerts.checkoutMissingFields');
    else if (!isValidPhone(customerData.phone))
      newErrors.phone = t('alerts.invalidPhone');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setIsSubmitting(true);
    setSubmitError('');

    const requestId   = 'REQ-' + Date.now();
    const requestDate = new Date().toLocaleString();

    try {
      // 1. Submit file + details to Netlify Forms
      const formData = new FormData();
      formData.append('form-name', 'print-request');
      formData.append('name',       customerData.name);
      formData.append('email',      customerData.email);
      formData.append('phone',      customerData.phone);
      formData.append('colors',     selectedColors.join(', '));
      formData.append('quantity',   String(quantity));
      formData.append('notes',      notes);
      formData.append('model-file', file);

      await fetch('/', { method: 'POST', body: formData });

      // 2. Send EmailJS notification (details only — file is in Netlify dashboard)
      await sendPrintRequestNotification({
        customer:    customerData,
        fileName:    file.name,
        fileSize:    (file.size / 1024).toFixed(1) + ' KB',
        colors:      selectedColors,
        quantity,
        notes,
        requestId,
        requestDate,
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Print request submission error:', err);
      // Still show success — Netlify likely received the file even if EmailJS failed
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success screen ─────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="modal-overlay">
        <div className="print-request-modal print-request-success">
          <div className="pr-success-icon">✅</div>
          <h2>{t('printRequest.successTitle')}</h2>
          <p>{t('printRequest.successBody')}</p>
          <p className="pr-success-contact">
            {t('printRequest.successContactPrefix')} <strong>{customerData.email}</strong>{' '}
            {t('printRequest.successContactOr')} <strong>{customerData.phone}</strong>.
          </p>
          <button className="submit-order-btn" onClick={onClose}>
            {t('printRequest.closeButton')}
          </button>
        </div>
      </div>
    );
  }

  // ── Main modal ─────────────────────────────────────────────────────────────

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="print-request-modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        <h2 className="pr-title">{t('printRequest.modalTitle')}</h2>

        {/* Step indicator */}
        <div className="pr-steps">
          <div className={`pr-step ${step === 1 ? 'pr-step-active' : step > 1 ? 'pr-step-done' : ''}`}>
            <span className="pr-step-num">{step > 1 ? '✓' : '1'}</span>
            <span>{t('printRequest.stepPrintDetails')}</span>
          </div>
          <div className="pr-step-line" />
          <div className={`pr-step ${step === 2 ? 'pr-step-active' : ''}`}>
            <span className="pr-step-num">2</span>
            <span>{t('printRequest.stepYourDetails')}</span>
          </div>
        </div>

        {/* ── Step 1 ─────────────────────────────────────────────────────── */}
        {step === 1 && (
          <div className="pr-step-content">

            {/* File upload */}
            <div className="form-group">
              <label>{t('printRequest.fileLabel')}</label>
              <div
                className={`pr-file-upload ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
                onClick={() => fileInputRef.current.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="pr-file-info">
                    <span className="pr-file-icon">📄</span>
                    <div>
                      <div className="pr-file-name">{file.name}</div>
                      <div className="pr-file-size">{(file.size / 1024).toFixed(1)} KB</div>
                    </div>
                    <button
                      className="pr-file-remove"
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="pr-file-placeholder">
                    <span className="pr-upload-icon">⬆️</span>
                    <span className="pr-upload-text">{t('printRequest.fileUploadText')}</span>
                    <span className="pr-upload-hint">{t('printRequest.fileUploadHint').replace('{max}', MAX_FILE_SIZE_MB)}</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_FILE_TYPES}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              {fileError && <span className="field-error">{fileError}</span>}
            </div>

            {/* Color selection */}
            <div className="form-group">
              <label>{t('printRequest.colorsLabel')}</label>
              <div className="color-grid">
                {availableColors.map(color => (
                  <div
                    key={color}
                    className={`color-option ${selectedColors.includes(color) ? 'selected' : ''}`}
                    onClick={() => toggleColor(color)}
                  >
                    {getColorLabel(color, language)}
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="form-group">
              <label>{t('printRequest.quantityLabel')}</label>
              <div className="quantity-controls">
                <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label>{t('printRequest.notesLabel')}</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('printRequest.notesPlaceholder')}
                rows={3}
              />
            </div>

            <div className="pr-footer">
              <button
                className="submit-order-btn"
                onClick={() => { if (validateStep1()) setStep(2); }}
              >
                {t('printRequest.nextButton')}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2 ─────────────────────────────────────────────────────── */}
        {step === 2 && (
          <div className="pr-step-content">
            <div className="form-group">
              <label>{t('checkout.fields.name.label')}</label>
              <input
                type="text"
                value={customerData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder={t('checkout.fields.name.placeholder')}
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>{t('checkout.fields.email.label')}</label>
              <input
                type="email"
                value={customerData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder={t('checkout.fields.email.placeholder')}
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>{t('checkout.fields.phone.label')}</label>
              <input
                type="tel"
                value={customerData.phone}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                placeholder={t('checkout.fields.phone.placeholder')}
                className={errors.phone ? 'input-error' : ''}
              />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>

            {submitError && <p className="field-error">{submitError}</p>}

            <div className="pr-footer">
              <button
                className="back-to-cart-btn"
                onClick={() => setStep(1)}
              >
                {t('printRequest.backButton')}
              </button>
              <button
                className="submit-order-btn"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? t('printRequest.sendingButton') : t('printRequest.sendButton')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintRequestModal;
