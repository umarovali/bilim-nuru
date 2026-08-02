import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/api';
import { Teacher } from '../api/types';
import CardCarousel from './CardCarousel';

export default function Teachers() {
  const { t } = useTranslation();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/teachers')
      .then((res) => setTeachers(res.data))
      .catch(() => setTeachers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="teachers" className="section teachers">
      <div className="container">
        <div className="section-header centered">
          <span className="eyebrow">{t('teachers.eyebrow')}</span>
          <h2 className="section-title">{t('teachers.title')}</h2>
          <p className="section-subtitle">{t('teachers.subtitle')}</p>
        </div>

        {!loading && teachers.length === 0 && (
          <p className="empty-state">{t('teachers.empty')}</p>
        )}

        {teachers.length > 0 && (
          <CardCarousel slidesDesktop={4} slidesTablet={2}>
            {teachers.map((teacher) => (
              <div key={teacher._id} className="teacher-card">
                <div className="teacher-card__photo">
                  {teacher.photo ? (
                    <img src={teacher.photo} alt={teacher.name} />
                  ) : (
                    <div className="teacher-card__photo-placeholder">
                      {teacher.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3>{teacher.name}</h3>
                <span className="teacher-card__position">{teacher.position}</span>
                <p>{teacher.bio}</p>
              </div>
            ))}
          </CardCarousel>
        )}
      </div>
    </section>
  );
}
