import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/api';
import { Course } from '../api/types';
import ImageUpload from './ImageUpload';

const emptyForm = {
  title: '',
  description: '',
  duration: '',
  price: '',
  image: '',
  order: 0,
  isActive: true,
};

export default function AdminCourses() {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get('/courses/admin/all')
      .then((res) => setCourses(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (course: Course) => {
    setForm(course);
    setEditingId(course._id);
    setFormOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await api.patch(`/courses/${editingId}`, form);
    } else {
      await api.post('/courses', form);
    }
    setFormOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.confirmDelete'))) return;
    await api.delete(`/courses/${id}`);
    load();
  };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h2>{t('admin.menuCourses')}</h2>
        <button className="btn btn-primary" onClick={openNew}>
          + {t('admin.add')}
        </button>
      </div>

      {loading ? (
        <p>{t('common.loading')}</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Длительность</th>
              <th>Цена</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c._id}>
                <td>{c.title}</td>
                <td>{c.duration}</td>
                <td>{c.price}</td>
                <td>
                  <span className={`badge ${c.isActive ? 'badge-active' : 'badge-inactive'}`}>
                    {c.isActive ? t('admin.active') : t('admin.inactive')}
                  </span>
                </td>
                <td className="admin-table__actions">
                  <button onClick={() => openEdit(c)}>{t('admin.edit')}</button>
                  <button className="danger" onClick={() => handleDelete(c._id)}>
                    {t('admin.delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {formOpen && (
        <div className="modal-overlay" onClick={() => setFormOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal__close" onClick={() => setFormOpen(false)}>
              ×
            </button>
            <h3>{editingId ? t('admin.edit') : t('admin.add')}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label>Название курса</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-field">
                <label>Описание</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>Длительность</label>
                  <input
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="напр. 3 месяца"
                  />
                </div>
                <div className="form-field">
                  <label>Цена</label>
                  <input
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="напр. 3000 сом/мес"
                  />
                </div>
              </div>
              <ImageUpload
                label="Изображение курса"
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
              />
              <div className="form-row">
                <div className="form-field">
                  <label>Порядок сортировки</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  />
                </div>
                <div className="form-field form-field--checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    />{' '}
                    {t('admin.active')}
                  </label>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                {t('admin.save')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
