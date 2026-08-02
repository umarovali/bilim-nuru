import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/api';
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

export default function Footer() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    api
      .get('/settings')
      .then((res) => setSettings(res.data))
      .catch(() => setSettings(null));
  }, []);

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <span className="site-footer__logo">Билим Нуру</span>
          <p>{t('hero.subtitle')}</p>
          {(settings?.instagram || settings?.facebook || settings?.whatsapp) && (
            <div className="site-footer__social">
              {settings?.instagram && (
                <a href={settings.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              )}
              {settings?.facebook && (
                <a href={settings.facebook} target="_blank" rel="noreferrer">
                  Facebook
                </a>
              )}
              {settings?.whatsapp && (
                <a href={settings.whatsapp} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              )}
            </div>
          )}
        </div>

        <div className="site-footer__col">
          <h5>{t('footer.quickLinks')}</h5>
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <a href={item.href}>{t(`nav.${item.key}`)}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__col">
          <h5>{t('footer.contactsTitle')}</h5>
          <ul>
            {settings?.phone && (
              <li>
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a>
              </li>
            )}
            {settings?.email && (
              <li>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
            )}
            {settings?.workingHours && <li>{settings.workingHours}</li>}
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom">
        <div className="container">
          <span>© {new Date().getFullYear()} Билим Нуру. {t('footer.rights')}</span>
        </div>
      </div>
    </footer>
  );
}
