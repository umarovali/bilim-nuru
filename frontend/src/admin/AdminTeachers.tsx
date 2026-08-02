import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/api';
import { Teacher } from '../api/types';
import ImageUpload from './ImageUpload';

const emptyForm = { name: '', position: '', bio: '', photo: '', order: 0, isActive: true };

export default function AdminTeachers() {
  const { t } = useTranslation();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get('/teachers/admin/all')
      .then((res) => setTeachers(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (teacher: Teacher) => {
    setForm(teacher);
    setEditingId(teacher._id);
    setFormOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await api.patch(`/teachers/${editingId}`, form);
    } else {
      await api.post('/teachers', form);
    }
    setFormOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.confirmDelete'))) return;
    await api.delete(`/teachers/${id}`);
    load();
  };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h2>{t('admin.menuTeachers')}</h2>
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
              <th>Имя</th>
              <th>Должность</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((tch) => (
              <tr key={tch._id}>
                <td>{tch.name}</td>
                <td>{tch.position}</td>
                <td>
                  <span className={`badge ${tch.isActive ? 'badge-active' : 'badge-inactive'}`}>
                    {tch.isActive ? t('admin.active') : t('admin.inactive')}
                  </span>
                </td>
                <td className="admin-table__actions">
                  <button onClick={() => openEdit(tch)}>{t('admin.edit')}</button>
                  <button className="danger" onClick={() => handleDelete(tch._id)}>
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
                <label>Имя и фамилия</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-field">
                <label>Должность / предмет</label>
                <input
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  required
                />
              </div>
              <div className="form-field">
                <label>Краткая биография</label>
                <textarea
                  rows={4}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  required
                />
              </div>
              <ImageUpload
                label="Фото преподавателя"
                value={form.photo}
                onChange={(url) => setForm({ ...form, photo: url })}
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
