import { blogPosts, formatBlogDate, getBlogPost, type BlogPost } from "../data/blog";
import { translate } from "../i18n";
import type { Locale } from "../types";
import { ArrowUpRight } from "./Icons";
import { LanguageSelect } from "./LanguageSelect";

interface BlogProps {
  locale: Locale;
  slug?: string;
  onChangeLocale: (locale: Locale) => void;
}

export function BlogCard({ post, locale }: { post: BlogPost; locale: Locale }) {
  const content = post.content[locale];
  const articleLocale = locale === "zh" ? "zh-CN" : locale;
  return (
    <article className="blog-card">
      <a className="blog-card__image" href={`#/blog/${post.slug}`} aria-label={content.title} lang={articleLocale}>
        <img src={post.cover} alt="" width={post.coverWidth} height={post.coverHeight} loading="lazy" />
      </a>
      <div className="blog-card__copy">
        <p className="blog-meta"><span>{content.category}</span><span aria-hidden="true">·</span><time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt, locale)}</time></p>
        <div lang={articleLocale}>
          <h2><a href={`#/blog/${post.slug}`}>{content.title}</a></h2>
          <p className="blog-card__excerpt">{content.excerpt}</p>
        </div>
        <a className="text-link" href={`#/blog/${post.slug}`}>
          {translate(locale, "Read story")}<ArrowUpRight />
        </a>
      </div>
    </article>
  );
}

export function LatestWriting({ locale }: { locale: Locale }) {
  const latest = blogPosts[0];
  if (!latest) return null;
  return (
    <section className="home-blog" aria-labelledby="latest-writing-title">
      <div className="section-heading">
        <div><p className="eyebrow">{translate(locale, "Notes beyond the work.")}</p><h2 id="latest-writing-title">{translate(locale, "Latest writing")}</h2></div>
        <a className="text-link" href="#/blog">{translate(locale, "View all posts")}<ArrowUpRight /></a>
      </div>
      <BlogCard post={latest} locale={locale} />
    </section>
  );
}

export function Blog({ locale, slug, onChangeLocale }: BlogProps) {
  if (slug === undefined) {
    return (
      <section className="page-section blog-page" aria-labelledby="blog-title">
        <header className="page-heading">
          <p className="section-kicker">{translate(locale, "Notes beyond the work.")}</p>
          <h1 id="blog-title">{translate(locale, "Blog")}</h1>
          <p>{translate(locale, "Personal reflections on music, culture, and the moments in between.")}</p>
        </header>
        <div className="blog-list" aria-label={translate(locale, "Blog posts")}>
          {blogPosts.map((post) => <BlogCard key={post.slug} post={post} locale={locale} />)}
        </div>
      </section>
    );
  }

  const post = getBlogPost(slug);
  if (!post) {
    return (
      <section className="page-section" aria-labelledby="missing-post-title">
        <header className="page-heading">
          <h1 id="missing-post-title">{translate(locale, "Post not found")}</h1>
          <p>{translate(locale, "This article could not be found. Explore the blog for more writing.")}</p>
        </header>
        <a className="text-link" href="#/blog">{translate(locale, "Back to blog")}<ArrowUpRight /></a>
      </section>
    );
  }

  const content = post.content[locale];
  const articleLocale = locale === "zh" ? "zh-CN" : locale;
  return (
    <section className="page-section blog-article-page">
      <div className="blog-article-toolbar">
        <a className="text-link blog-back" href="#/blog"><span aria-hidden="true">←</span>{translate(locale, "Back to blog")}</a>
        <div className="blog-language">
          <span>{translate(locale, "Article language")}</span>
          <LanguageSelect locale={locale} onChange={onChangeLocale} label={translate(locale, "Article language")} />
        </div>
      </div>
      <article className="blog-article" lang={articleLocale} aria-labelledby="post-title">
        <header className="blog-article__heading">
          <p className="section-kicker">{content.category}</p>
          <h1 id="post-title">{content.title}</h1>
          <p className="blog-article__intro">{content.excerpt}</p>
          <div className="blog-meta" lang={locale === "zh" ? "zh-CN" : locale}>
            <span>{post.author}</span><span aria-hidden="true">·</span>
            <span>{translate(locale, "Published")} <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt, locale)}</time></span>
            <span aria-hidden="true">·</span><span>{translate(locale, "2 min read")}</span>
          </div>
          <p className="blog-article__venue">{content.venue}{post.concertDate && <> <span aria-hidden="true">·</span> <time dateTime={post.concertDate}>{formatBlogDate(post.concertDate, locale)}</time></>}</p>
        </header>
        <figure className="blog-article__cover">
          <img src={post.cover} alt={content.coverAlt} width={post.coverWidth} height={post.coverHeight} fetchPriority="high" />
          <figcaption>{content.coverCaption}</figcaption>
        </figure>
        <div className="blog-prose">
          {content.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          <p className="blog-prose__closing">{content.closing}</p>
          <div className={`blog-gallery${post.gallery.length > 1 ? " blog-gallery--multiple" : ""}`}>
            {post.gallery.map((photo, index) => (
              <figure key={photo.src}>
                <img src={photo.src} alt={content.gallery[index].alt} width={photo.width} height={photo.height} loading="lazy" />
                <figcaption>{content.gallery[index].caption}</figcaption>
              </figure>
            ))}
          </div>
          <ul className="tag-list blog-tags">
            {content.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
          <div className="blog-article__source" lang={locale === "zh" ? "zh-CN" : locale}>
            <p>{translate(locale, "Originally written in Chinese.")}</p>
            {post.source && <a className="text-link" href={post.source.url} target="_blank" rel="noreferrer">{post.source.label}<ArrowUpRight size={14} /></a>}
          </div>
        </div>
      </article>
    </section>
  );
}
