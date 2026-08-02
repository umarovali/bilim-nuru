import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/api';
import ImageUpload from './ImageUpload';

export default function AdminAbout() {
  const { t } = useTranslation();
  const [form, setForm] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/about').then((res) => setForm(res.data));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await api.patch('/about', form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!form) return <p>{t('common.loading')}</p>;

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h2>{t('admin.menuAbout')}</h2>
      </div>

      <form onSubmit={handleSubmit} className="admin-form-card">
        <div className="form-field">
          <label>Заголовок</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="form-field">
          <label>Текст "О нас"</label>
          <textarea rows={5} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
        </div>
        <ImageUpload
          label="Изображение"
          value={form.image}
          onChange={(url) => setForm({ ...form, image: url })}
        />
        <div className="form-row form-row--4">
          <div className="form-field">
            <label>Кол-во студентов</label>
            <input
              type="number"
              value={form.studentsCount}
              onChange={(e) => setForm({ ...form, studentsCount: Number(e.target.value) })}
            />
          </div>
          <div className="form-field">
            <label>Кол-во преподавателей</label>
            <input
              type="number"
              value={form.teachersCount}
              onChange={(e) => setForm({ ...form, teachersCount: Number(e.target.value) })}
            />
          </div>
          <div className="form-field">
            <label>Кол-во курсов</label>
            <input
              type="number"
              value={form.coursesCount}
              onChange={(e) => setForm({ ...form, coursesCount: Number(e.target.value) })}
            />
          </div>
          <div className="form-field">
            <label>Лет на рынке</label>
            <input
              type="number"
              value={form.yearsOnMarket}
              onChange={(e) => setForm({ ...form, yearsOnMarket: Number(e.target.value) })}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          {saved ? '✓ ' + t('admin.save') : t('admin.save')}
        </button>
      </form>
    </div>
  );
}
