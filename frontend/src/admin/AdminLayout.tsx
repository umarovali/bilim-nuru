import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';

const MENU = [
  { key: 'menuCourses', path: '/admin' },
  { key: 'menuBlogs', path: '/admin/blogs' },
  { key: 'menuTeachers', path: '/admin/teachers' },
  { key: 'menuReviews', path: '/admin/reviews' },
  { key: 'menuContacts', path: '/admin/contacts' },
  { key: 'menuBranches', path: '/admin/branches' },
  { key: 'menuAbout', path: '/admin/about' },
  { key: 'menuSettings', path: '/admin/settings' },
];

export default function AdminLayout() {
  const { t } = useTranslation();
  const { lang, setLang } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('bn_admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">Билим Нуру</div>
        <nav>
          {MENU.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => (isActive ? 'is-active' : '')}
            >
              {t(`admin.${item.key}`)}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar__lang">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              className={lang === l.code ? 'is-active' : ''}
              onClick={() => setLang(l.code)}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="admin-sidebar__footer">
          <a href="/" target="_blank" rel="noreferrer">
            {t('admin.backToSite')}
          </a>
          <button onClick={handleLogout}>{t('admin.logout')}</button>
        </div>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
