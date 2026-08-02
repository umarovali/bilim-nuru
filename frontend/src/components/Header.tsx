import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import api from '../api/api';
import Logo from '../images/logo.jpg';
import { SiteSettings } from '../api/types';

const NAV_ITEMS = [
  { key: 'home', href: '#home' },
  { key: 'about', href: '#about' },
  { key: 'courses', href: '#courses' },
  { key: 'blogs', href: '#blogs' },
  { key: 'teachers', href: '#teachers' },
  { key: 'reviews', href: '#reviews' },
  { key: 'contacts', href: '#contacts' },
];

export default function Header() {
  const { t } = useTranslation();
  const { lang, setLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    api
      .get('/settings')
      .then((res) => setSettings(res.data))
      .catch(() => setSettings(null));
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container site-header__inner">
        <a href="#home" className="site-header__logo">
          <img src={Logo} alt="" />
        </a>

        <nav className={`site-nav ${menuOpen ? 'is-open' : ''}`}>
          {NAV_ITEMS.map((item) => (
            <a key={item.key} href={item.href} onClick={() => setMenuOpen(false)}>
              {t(`nav.${item.key}`)}
            </a>
          ))}
          <div className="site-nav__mobile-extra">
            <LangSwitcher lang={lang} setLang={setLang} />
          </div>
        </nav>

        <div className="site-header__actions">
          <div className="lang-switcher lang-switcher--desktop">
            <LangSwitcher lang={lang} setLang={setLang} />
          </div>
          {settings?.phone && (
            <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="btn btn-gold site-header__call">
              {t('header.callUs')}
            </a>
          )}
          <button
            className="site-header__burger"
            aria-label={t('header.menu')}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}

function LangSwitcher({
  lang,
  setLang,
}: {
  lang: string;
  setLang: (l: any) => void;
}) {
  return (
    <div className="lang-switcher__buttons">
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          className={`lang-switcher__btn ${lang === l.code ? 'is-active' : ''}`}
          onClick={() => setLang(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
