import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/api';
import { Branch } from '../context/BranchContext';

const emptyForm = { name: '', address: '', phone: '', workHours: '', iframeSrc: '', order: 0, isActive: true };

export default function AdminBranches() {
  const { t } = useTranslation();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get('/branches/admin/all')
      .then((res) => setBranches(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (branch: Branch) => {
    setForm(branch);
    setEditingId(branch._id);
    setFormOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await api.patch(`/branches/${editingId}`, form);
    } else {
      await api.post('/branches', form);
    }
    setFormOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.confirmDelete'))) return;
    await api.delete(`/branches/${id}`);
    load();
  };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h2>{t('admin.menuBranches')}</h2>
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
              <th>Адрес</th>
              <th>Телефон</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {branches.map((b) => (
              <tr key={b._id}>
                <td>{b.name}</td>
                <td>{b.address}</td>
                <td>{b.phone}</td>
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
                <label>Название филиала</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="напр. Филиал на Чуй"
                  required
                />
              </div>
              <div className="form-field">
                <label>Адрес</label>
                <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>Телефон</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                </div>
                <div className="form-field">
                  <label>Часы работы</label>
                  <input
                    value={form.workHours}
                    onChange={(e) => setForm({ ...form, workHours: e.target.value })}
                    placeholder="09:00 - 19:00"
                  />
                </div>
              </div>
              <div className="form-field">
                <label>Yandex Map iframe (src)</label>
                <textarea
                  rows={3}
                  value={form.iframeSrc}
                  onChange={(e) => setForm({ ...form, iframeSrc: e.target.value })}
                  placeholder="https://yandex.ru/map-widget/v1/..."
                  required
                />
                <small className="form-hint">
                  На Яндекс.Картах: найдите адрес → «Поделиться» → «Код для сайта» → скопируйте
                  значение атрибута src из тега iframe и вставьте сюда.
                </small>
              </div>
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
