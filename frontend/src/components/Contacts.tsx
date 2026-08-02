import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/api';
import { useBranches } from '../context/BranchContext';

export default function Contacts() {
  const { t } = useTranslation();
  const { branches, setBranches, activeBranchId, setActiveBranchId, activeBranch } = useBranches();

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    api
      .get('/branches')
      .then((res) => {
        setBranches(res.data);
        if (res.data.length > 0 && !activeBranchId) {
          setActiveBranchId(res.data[0]._id);
        }
      })
      .catch(() => setBranches([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/contacts', {
        name,
        phone,
        email,
        message,
        branch: activeBranch?.name || '',
      });
      setSubmitted(true);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch {
      alert(t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contacts" className="section contacts">
      <div className="container">
        <div className="section-header centered">
          <span className="eyebrow">{t('contacts.eyebrow')}</span>
          <h2 className="section-title">{t('contacts.title')}</h2>
          <p className="section-subtitle">{t('contacts.subtitle')}</p>
        </div>

        {branches.length > 1 && (
          <div className="branch-switch">
            {branches.map((b) => (
              <button
                key={b._id}
                className={`branch-switch__btn ${activeBranchId === b._id ? 'is-active' : ''}`}
                onClick={() => setActiveBranchId(b._id)}
              >
                {b.name}
              </button>
            ))}
          </div>
        )}

        <div className="contacts__grid">
          <div className="contacts__map">
            {activeBranch?.iframeSrc ? (
              <iframe
                src={activeBranch.iframeSrc}
                width="100%"
                height="420"
                frameBorder="0"
                title={`map-${activeBranch._id}`}
                loading="lazy"
              />
            ) : (
              <div className="contacts__map-placeholder">
                {/* Вставьте сюда iframe с Яндекс.Картами через админ-панель → Филиалы */}
                <span>Карта появится после добавления филиала в админ-панели</span>
              </div>
            )}
          </div>

          <div className="contacts__info-form">
            {activeBranch && (
              <div className="contacts__info">
                <h4>{activeBranch.name}</h4>
                <p>
                  <strong>{t('contacts.address')}:</strong> {activeBranch.address}
                </p>
                <p>
                  <strong>{t('contacts.phone')}:</strong>{' '}
                  <a href={`tel:${activeBranch.phone.replace(/\s/g, '')}`}>{activeBranch.phone}</a>
                </p>
                {activeBranch.workHours && (
                  <p>
                    <strong>{t('contacts.workHours')}:</strong> {activeBranch.workHours}
                  </p>
                )}
              </div>
            )}

            {submitted ? (
              <div className="form-success">
                <h4>{t('contacts.formSuccessTitle')}</h4>
                <p>{t('contacts.formSuccessText')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contacts__form">
                <div className="form-field">
                  <label>{t('contacts.formName')}</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-field">
                  <label>{t('contacts.formPhone')}</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div className="form-field">
                  <label>{t('contacts.formEmail')}</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-field">
                  <label>{t('contacts.formMessage')}</label>
                  <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%' }}>
                  {submitting ? t('contacts.formSubmitting') : t('contacts.formSubmit')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
