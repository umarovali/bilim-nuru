import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/api';
import { Blog } from '../api/types';
import CardCarousel from './CardCarousel';

export default function Blogs() {
  const { t } = useTranslation();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [openBlog, setOpenBlog] = useState<Blog | null>(null);

  useEffect(() => {
    api
      .get('/blogs')
      .then((res) => setBlogs(res.data))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="blogs" className="section blogs">
      <div className="container">
        <div className="section-header centered">
          <span className="eyebrow">{t('blogs.eyebrow')}</span>
          <h2 className="section-title">{t('blogs.title')}</h2>
          <p className="section-subtitle">{t('blogs.subtitle')}</p>
        </div>

        {!loading && blogs.length === 0 && <p className="empty-state">{t('blogs.empty')}</p>}

        {blogs.length > 0 && (
          <CardCarousel slidesDesktop={3} slidesTablet={2}>
            {blogs.map((blog) => (
              <article key={blog._id} className="blog-card">
                <div className="blog-card__image">
                  {blog.coverImage ? (
                    <img src={blog.coverImage} alt={blog.title} />
                  ) : (
                    <div className="blog-card__image-placeholder" />
                  )}
                </div>
                <div className="blog-card__body">
                  {blog.publishedAt && (
                    <time className="blog-card__date">
                      {new Date(blog.publishedAt).toLocaleDateString()}
                    </time>
                  )}
                  <h3>{blog.title}</h3>
                  <p>{blog.excerpt}</p>
                  <button className="blog-card__link" onClick={() => setOpenBlog(blog)}>
                    {t('blogs.readMore')} →
                  </button>
                </div>
              </article>
            ))}
          </CardCarousel>
        )}
      </div>

      {openBlog && (
        <div className="modal-overlay" onClick={() => setOpenBlog(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal__close" onClick={() => setOpenBlog(null)}>
              ×
            </button>
            {openBlog.coverImage && <img src={openBlog.coverImage} alt={openBlog.title} className="modal__image" />}
            <h3>{openBlog.title}</h3>
            <p className="modal__content-text">{openBlog.content}</p>
          </div>
        </div>
      )}
    </section>
  );
}
