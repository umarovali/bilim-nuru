import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/api';
import { Blog } from '../api/types';
import ImageUpload from './ImageUpload';

const emptyForm = { title: '', excerpt: '', content: '', coverImage: '', isActive: true };

export default function AdminBlogs() {
  const { t } = useTranslation();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get('/blogs/admin/all')
      .then((res) => setBlogs(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (blog: Blog) => {
    setForm(blog);
    setEditingId(blog._id);
    setFormOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await api.patch(`/blogs/${editingId}`, form);
    } else {
      await api.post('/blogs', form);
    }
    setFormOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.confirmDelete'))) return;
    await api.delete(`/blogs/${id}`);
    load();
  };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h2>{t('admin.menuBlogs')}</h2>
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
              <th>Заголовок</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((b) => (
              <tr key={b._id}>
                <td>{b.title}</td>
                <td>
                  <span className={`badge ${b.isActive ? 'badge-active' : 'badge-inactive'}`}>
                    {b.isActive ? t('admin.active') : t('admin.inactive')}
                  </span>
                </td>
                <td className="admin-table__actions">
                  <button onClick={() => openEdit(b)}>{t('admin.edit')}</button>
                  <button className="danger" onClick={() => handleDelete(b._id)}>
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
                <label>Заголовок</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-field">
                <label>Краткое описание (для карточки)</label>
                <textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  required
                />
              </div>
              <div className="form-field">
                <label>Полный текст статьи</label>
                <textarea
                  rows={6}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  required
                />
              </div>
              <ImageUpload
                label="Обложка статьи"
                value={form.coverImage}
                onChange={(url) => setForm({ ...form, coverImage: url })}
              />
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
