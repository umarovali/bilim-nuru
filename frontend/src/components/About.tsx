import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/api';
import { About as AboutType } from '../api/types';

export default function About() {
  const { t } = useTranslation();
  const [about, setAbout] = useState<AboutType | null>(null);

  useEffect(() => {
    api
      .get('/about')
      .then((res) => setAbout(res.data))
      .catch(() => setAbout(null));
  }, []);

  return (
    <section id="about" className="section about">
      <div className="container about__grid">
        <div className="about__image">
          {about?.image ? (
            <img src={about.image} alt={about.title || 'Билим Нуру'} />
          ) : (
            <div className="about__image-placeholder">
              <span>Билим Нуру</span>
            </div>
          )}
        </div>
        <div className="about__content">
          <span className="eyebrow">{t('about.eyebrow')}</span>
          <h2 className="section-title">{about?.title || t('about.title')}</h2>
          <p className="about__text">{about?.text || t('about.defaultText')}</p>

          <div className="about__stats">
            <div className="about__stat">
              <strong>{about?.studentsCount ?? 500}+</strong>
              <span>{t('hero.statStudents')}</span>
            </div>
            <div className="about__stat">
              <strong>{about?.coursesCount ?? 12}+</strong>
              <span>{t('hero.statCourses')}</span>
            </div>
            <div className="about__stat">
              <strong>{about?.teachersCount ?? 20}+</strong>
              <span>{t('hero.statTeachers')}</span>
            </div>
            <div className="about__stat">
              <strong>{about?.yearsOnMarket ?? 5}+</strong>
              <span>{t('hero.statYears')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
