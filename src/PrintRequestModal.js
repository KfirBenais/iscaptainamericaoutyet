import React, { useState } from 'react';
import { FileUploaderRegular } from '@uploadcare/react-uploader';
import '@uploadcare/react-uploader/core.css';
import { useLanguage, getColorLabel, getColorStyle } from './i18n';
import { sendPrintRequestNotification } from './emailService';

const UPLOADCARE_PUBLIC_KEY = '27bba8de6958b10322ab';
const ACCEPTED_FILE_TYPES = '.stl,.obj,.3mf,.ply,.amf,.step,.stp,.fbx,.dxf,.wrl,.vrml,.x3d,.f3d,.ipt,.iges,.igs,.zip,.rar,.7z';

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

  const [step,           setStep]           = useState(1);
  const [fileMode,       setFileMode]       = useState('upload'); // 'upload' | 'link'
  const [uploadedFile,   setUploadedFile]   = useState(null);
  const [modelLink,      setModelLink]      = useState('');
  const [modelLinkError, setModelLinkError] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [quantity,       setQuantity]       = useState(1);
  const [notes,          setNotes]          = useState('');
  const [customerData,   setCustomerData]   = useState({ name: '', email: '', phone: '' });
  const [errors,         setErrors]         = useState({});
  const [fileError,      setFileError]      = useState('');
  const [isSubmitting,   setIsSubmitting]   = useState(false);
  const [submitted,      setSubmitted]      = useState(false);

  const handleUploadSuccess = (fileInfo) => {
    setUploadedFile({
      name:   fileInfo.name,
      cdnUrl: fileInfo.cdnUrl,
      size:   fileInfo.size,
    });
    setFileError('');
  };

  const toggleColor = (color) =>
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );

  const handleFieldChange = (field, value) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateStep1 = () => {
    if (fileMode === 'upload') {
      if (!uploadedFile) {
        setFileError(t('printRequest.fileMissingAlert'));
        return false;
      }
    } else {
      if (!modelLink.trim()) {
        setModelLinkError(t('printRequest.linkMissingAlert'));
        return false;
      }
      try { new URL(modelLink); } catch {
        setModelLinkError(t('printRequest.linkInvalidAlert'));
        return false;
      }
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

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setIsSubmitting(true);

    const requestId   = 'REQ-' + Date.now();
    const requestDate = new Date().toLocaleString();

    const fileSource = fileMode === 'upload'
      ? {
          fileName: uploadedFile.name,
          fileSize: uploadedFile.size ? (uploadedFile.size / 1024).toFixed(1) + ' KB' : 'N/A',
          fileUrl:  uploadedFile.cdnUrl,
        }
      : {
          fileName: 'Model Link',
          fileSize: 'N/A',
          fileUrl:  modelLink,
        };

    try {
      const formData = new FormData();
      formData.append('form-name', 'print-request');
      formData.append('name',      customerData.name);
      formData.append('email',     customerData.email);
      formData.append('phone',     customerData.phone);
      formData.append('colors',    selectedColors.join(', '));
      formData.append('quantity',  String(quantity));
      formData.append('notes',     notes);
      formData.append('file-url',  fileSource.fileUrl);
      formData.append('file-name', fileSource.fileName);

      await fetch('/', { method: 'POST', body: formData });

      await sendPrintRequestNotification({
        customer:    customerData,
        fileName:    fileSource.fileName,
        fileSize:    fileSource.fileSize,
        fileUrl:     fileSource.fileUrl,
        colors:      selectedColors,
        quantity,
        notes,
        requestId,
        requestDate,
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Print request submission error:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="print-request-modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        <h2 className="pr-title">{t('printRequest.modalTitle')}</h2>

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

        {step === 1 && (
          <div className="pr-step-content">

            <div className="form-group">
              <label>{t('printRequest.fileLabel')}</label>

              {/* Mode toggle */}
              <div className="pr-mode-tabs">
                <button
                  type="button"
                  className={`pr-mode-tab ${fileMode === 'upload' ? 'active' : ''}`}
                  onClick={() => { setFileMode('upload'); setModelLinkError(''); }}
                >
                  {t('printRequest.fileModeUpload')}
                </button>
                <button
                  type="button"
                  className={`pr-mode-tab ${fileMode === 'link' ? 'active' : ''}`}
                  onClick={() => { setFileMode('link'); setFileError(''); }}
                >
                  {t('printRequest.fileModeLink')}
                </button>
              </div>

              {fileMode === 'upload' && (
                <>
                  <p className="pr-file-hint">
                    {t('printRequest.fileUploadHint').replace('{max}', '500')}
                  </p>
                  <div className="pr-uploadcare-wrapper">
                    <FileUploaderRegular
                      pubkey={UPLOADCARE_PUBLIC_KEY}
                      accept={ACCEPTED_FILE_TYPES}
                      maxLocalFileSizeBytes={500 * 1024 * 1024}
                      onFileUploadSuccess={handleUploadSuccess}
                      sourceList="local, url, dropbox, gdrive"
                      classNameUploader="uc-light"
                    />
                  </div>
                  {uploadedFile && (
                    <div className="pr-file-uploaded">
                      <span className="pr-file-icon">📄</span>
                      <span className="pr-file-name">{uploadedFile.name}</span>
                      <button
                        className="pr-file-remove"
                        onClick={() => setUploadedFile(null)}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  {fileError && <span className="field-error">{fileError}</span>}
                </>
              )}

              {fileMode === 'link' && (
                <>
                  <p className="pr-file-hint">{t('printRequest.linkHint')}</p>
                  <input
                    type="url"
                    className={`pr-link-input${modelLinkError ? ' input-error' : ''}`}
                    value={modelLink}
                    onChange={(e) => { setModelLink(e.target.value); setModelLinkError(''); }}
                    placeholder={t('printRequest.linkPlaceholder')}
                  />
                  {modelLinkError && <span className="field-error">{modelLinkError}</span>}
                </>
              )}
            </div>

            <div className="form-group">
              <label>{t('printRequest.colorsLabel')}</label>
              <div className="color-grid">
                {availableColors.map(color => (
                  <div
                    key={color}
                    className={`color-option ${selectedColors.includes(color) ? 'selected' : ''}`}
                    style={getColorStyle(color)}
                    onClick={() => toggleColor(color)}
                  >
                    {getColorLabel(color, language)}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>{t('printRequest.quantityLabel')}</label>
              <div className="quantity-controls">
                <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>
            </div>

            <div className="form-group">
              <label>{t('printRequest.notesLabel')}</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('printRequest.notesPlaceholder')}
                rows={7}
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
