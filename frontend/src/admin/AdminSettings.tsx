import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/api';

export default function AdminSettings() {
  const { t } = useTranslation();
  const [form, setForm] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/settings').then((res) => setForm(res.data));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await api.patch('/settings', form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!form) return <p>{t('common.loading')}</p>;

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h2>{t('admin.menuSettings')}</h2>
      </div>

      <form onSubmit={handleSubmit} className="admin-form-card">
        <div className="form-field">
          <label>Название сайта</label>
          <input value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} />
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Телефон (шапка/подвал)</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+996 700 000 000" />
          </div>
          <div className="form-field">
            <label>Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>
        <div className="form-field">
          <label>Часы работы</label>
          <input value={form.workingHours} onChange={(e) => setForm({ ...form, workingHours: e.target.value })} />
        </div>
        <div className="form-field">
          <label>Instagram (ссылка)</label>
          <input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} placeholder="https://instagram.com/..." />
        </div>
        <div className="form-field">
          <label>Facebook (ссылка)</label>
          <input value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} placeholder="https://facebook.com/..." />
        </div>
        <div className="form-field">
          <label>WhatsApp (ссылка)</label>
          <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="https://wa.me/996700000000" />
        </div>
        <button type="submit" className="btn btn-primary">
          {saved ? '✓ ' + t('admin.save') : t('admin.save')}
        </button>
      </form>
    </div>
  );
}
