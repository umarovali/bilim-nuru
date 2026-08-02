import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/api';
import { Review, ReviewStatus } from '../api/types';

const TABS: { key: ReviewStatus; label: string }[] = [
  { key: 'pending', label: 'statusPending' },
  { key: 'approved', label: 'statusApproved' },
  { key: 'rejected', label: 'statusRejected' },
];

export default function AdminReviews() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<ReviewStatus>('pending');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get(`/reviews/admin/all?status=${tab}`)
      .then((res) => setReviews(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, [tab]);

  const handleApprove = async (id: string) => {
    await api.patch(`/reviews/${id}/approve`);
    load();
  };

  const handleReject = async (id: string) => {
    await api.patch(`/reviews/${id}/reject`);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.confirmDelete'))) return;
    await api.delete(`/reviews/${id}`);
    load();
  };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h2>{t('admin.menuReviews')}</h2>
      </div>

      <div className="admin-tabs">
        {TABS.map((tb) => (
          <button
            key={tb.key}
            className={tab === tb.key ? 'is-active' : ''}
            onClick={() => setTab(tb.key)}
          >
            {t(`admin.${tb.label}`)}
          </button>
        ))}
      </div>

      {loading ? (
        <p>{t('common.loading')}</p>
      ) : reviews.length === 0 ? (
        <p>{t('admin.noData')}</p>
      ) : (
        <div className="admin-reviews-list">
          {reviews.map((r) => (
            <div key={r._id} className="admin-review-card">
              <div className="admin-review-card__head">
                <strong>{r.authorName}</strong>
                <span>{'★'.repeat(r.rating)}</span>
              </div>
              <p>{r.text}</p>
              {r.branch && <span className="admin-review-card__branch">{r.branch}</span>}
              <div className="admin-review-card__actions">
                {tab !== 'approved' && (
                  <button onClick={() => handleApprove(r._id)}>{t('admin.approve')}</button>
                )}
                {tab !== 'rejected' && (
                  <button onClick={() => handleReject(r._id)}>{t('admin.reject')}</button>
                )}
                <button className="danger" onClick={() => handleDelete(r._id)}>
                  {t('admin.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
