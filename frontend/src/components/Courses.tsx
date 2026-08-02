import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/api';
import { Course } from '../api/types';
import CardCarousel from './CardCarousel';

export default function Courses() {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/courses')
      .then((res) => setCourses(res.data))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="courses" className="section courses">
      <div className="container">
        <div className="section-header centered">
          <span className="eyebrow">{t('courses.eyebrow')}</span>
          <h2 className="section-title">{t('courses.title')}</h2>
          <p className="section-subtitle">{t('courses.subtitle')}</p>
        </div>

        {!loading && courses.length === 0 && (
          <p className="empty-state">{t('courses.empty')}</p>
        )}

        {courses.length > 0 && (
          <CardCarousel slidesDesktop={3} slidesTablet={2}>
            {courses.map((course) => (
              <div key={course._id} className="course-card">
                <div className="course-card__image">
                  {course.image ? (
                    <img src={course.image} alt={course.title} />
                  ) : (
                    <div className="course-card__image-placeholder" />
                  )}
                </div>
                <div className="course-card__body">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className="course-card__meta">
                    {course.duration && (
                      <span>
                        <strong>{t('courses.duration')}:</strong> {course.duration}
                      </span>
                    )}
                    {course.price && (
                      <span>
                        <strong>{t('courses.price')}:</strong> {course.price}
                      </span>
                    )}
                  </div>
                  <a href="#contacts" className="btn btn-outline course-card__cta">
                    {t('courses.more')}
                  </a>
                </div>
              </div>
            ))}
          </CardCarousel>
        )}
      </div>
    </section>
  );
}
