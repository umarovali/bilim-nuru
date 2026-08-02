import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/api';
import { Review } from '../api/types';
import CardCarousel from './CardCarousel';

export default function Reviews() {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    api
      .get('/reviews')
      .then((res) => setReviews(res.data))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/reviews', { authorName: name, text, rating });
      setSubmitted(true);
      setName('');
      setText('');
      setRating(5);
    } catch {
      alert(t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="section reviews">
      <div className="container">
        <div className="section-header centered">
          <span className="eyebrow">{t('reviews.eyebrow')}</span>
          <h2 className="section-title">{t('reviews.title')}</h2>
          <p className="section-subtitle">{t('reviews.subtitle')}</p>
          <button className="btn btn-gold reviews__cta" onClick={() => setFormOpen(true)}>
            {t('reviews.leaveReview')}
          </button>
        </div>

        {!loading && reviews.length === 0 && <p className="empty-state">{t('reviews.empty')}</p>}

        {reviews.length > 0 && (
          <CardCarousel slidesDesktop={3} slidesTablet={2}>
            {reviews.map((review) => (
              <div key={review._id} className="review-card">
                <div className="review-card__stars">
                  {'★'.repeat(review.rating)}
                  <span className="review-card__stars-empty">{'★'.repeat(5 - review.rating)}</span>
                </div>
                <p>{review.text}</p>
                <strong className="review-card__author">{review.authorName}</strong>
              </div>
            ))}
          </CardCarousel>
        )}
      </div>

      {formOpen && (
        <div
          className="modal-overlay"
          onClick={() => {
            setFormOpen(false);
            setSubmitted(false);
          }}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal__close"
              onClick={() => {
                setFormOpen(false);
                setSubmitted(false);
              }}
            >
              ×
            </button>

            {submitted ? (
              <div className="form-success">
                <h4>{t('reviews.thankYouTitle')}</h4>
                <p>{t('reviews.thankYouText')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ marginBottom: 20 }}>{t('reviews.leaveReview')}</h3>
                <div className="form-field">
                  <label>{t('reviews.formName')}</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-field">
                  <label>{t('reviews.formRating')}</label>
                  <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {'★'.repeat(r)} ({r})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label>{t('reviews.formText')}</label>
                  <textarea
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%' }}>
                  {submitting ? t('reviews.formSubmitting') : t('reviews.formSubmit')}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
