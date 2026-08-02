import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/api";
import Logo from "../images/logo.jpg";
import { About } from "../api/types";

export default function Hero() {
  const { t } = useTranslation();
  const [about, setAbout] = useState<About | null>(null);

  useEffect(() => {
    api
      .get("/about")
      .then((res) => setAbout(res.data))
      .catch(() => setAbout(null));
  }, []);

  return (
    <section id="home" className="hero">
      <div className="hero__bg" />
      <div className="container hero__inner">
        <div className="hero__content">
          <span className="eyebrow">{t("hero.eyebrow")}</span>
          <h1 className="hero__title">{t("hero.title")}</h1>
          <p className="hero__subtitle">{t("hero.subtitle")}</p>
          <div className="hero__actions">
            <a href="#courses" className="btn btn-gold">
              {t("hero.cta")}
            </a>
            <a href="#contacts" className="btn btn-outline on-dark">
              {t("hero.ctaSecondary")}
            </a>
          </div>

          <div className="hero__stats">
            <div className="hero__stat">
              <strong>{about?.studentsCount ?? 500}+</strong>
              <span>{t("hero.statStudents")}</span>
            </div>
            <div className="hero__stat">
              <strong>{about?.coursesCount ?? 12}+</strong>
              <span>{t("hero.statCourses")}</span>
            </div>
            <div className="hero__stat">
              <strong>{about?.teachersCount ?? 20}+</strong>
              <span>{t("hero.statTeachers")}</span>
            </div>
            <div className="hero__stat">
              <strong>{about?.yearsOnMarket ?? 5}+</strong>
              <span>{t("hero.statYears")}</span>
            </div>
          </div>
        </div>

        <div className="hero__emblem">
          <img src={Logo} alt="" />
        </div>
      </div>
    </section>
  );
}
