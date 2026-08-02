import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/api';
import { ContactRequest } from '../api/types';

export default function AdminContacts() {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get('/contacts')
      .then((res) => setContacts(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleMarkRead = async (id: string) => {
    await api.patch(`/contacts/${id}/read`);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.confirmDelete'))) return;
    await api.delete(`/contacts/${id}`);
    load();
  };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h2>{t('admin.menuContacts')}</h2>
      </div>

      {loading ? (
        <p>{t('common.loading')}</p>
      ) : contacts.length === 0 ? (
        <p>{t('admin.noData')}</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Сообщение</th>
              <th>Филиал</th>
              <th>Дата</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c._id} className={c.isRead ? '' : 'row-unread'}>
                <td>{c.name}</td>
                <td>
                  <a href={`tel:${c.phone.replace(/\s/g, '')}`}>{c.phone}</a>
                </td>
                <td>{c.email}</td>
                <td>{c.message}</td>
                <td>{c.branch}</td>
                <td>{c.createdAt && new Date(c.createdAt).toLocaleDateString()}</td>
                <td className="admin-table__actions">
                  {!c.isRead && <button onClick={() => handleMarkRead(c._id)}>{t('admin.markRead')}</button>}
                  <button className="danger" onClick={() => handleDelete(c._id)}>
                    {t('admin.delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
