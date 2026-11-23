// https://app.curator.io/organize

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const PROFILE_URL = "https://www.instagram.com/bilimnuru.academy/";
const FEED_URL =
  "https://api.curator.io/v1.3/feeds/54435e0c-a74d-4039-9b3b-14e2640013da/posts?limit=6&hasPoweredBy=true";

type InstagramPost = {
  id: number;
  url: string;
  image?: string;
  image_large?: string;
  thumbnail?: string;
  video?: string;
  source_created_at?: string;
};

type FeedState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; posts: InstagramPost[] };

const lastGlowPaint = new WeakMap<HTMLVideoElement, number>();

function paintVideoGlow(video: HTMLVideoElement, force = false) {
  if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || video.seeking)
    return;

  const now = performance.now();
  if (
    !force &&
    (now - (lastGlowPaint.get(video) ?? -Infinity) < 250 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  )
    return;

  const canvas = video
    .closest(".instagram-feed__card")
    ?.querySelector<HTMLCanvasElement>(".instagram-feed__glow");
  const context = canvas?.getContext("2d");
  if (!canvas || !context) return;

  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  lastGlowPaint.set(video, now);
}

function refreshVideoGlow(video: HTMLVideoElement) {
  const paint = () => paintVideoGlow(video, true);
  window.requestAnimationFrame(paint);
  video.requestVideoFrameCallback?.(paint);
}

function resetVideoGlow(video: HTMLVideoElement) {
  lastGlowPaint.delete(video);

  const canvas = video
    .closest(".instagram-feed__card")
    ?.querySelector<HTMLCanvasElement>(".instagram-feed__glow");

  if (canvas)
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
}

export default function Blogs() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language || "en";
  const dateFormat = new Intl.DateTimeFormat(language, {
    day: "numeric",
    month: "long",
  });

  const trackRef = useRef<HTMLUListElement>(null);
  const [feed, setFeed] = useState<FeedState>({ status: "loading" });
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const posts = feed.status === "ready" ? feed.posts : [];
  const postCount = posts.length;

  useEffect(() => {
    const controller = new AbortController();

    async function loadPosts() {
      try {
        const response = await fetch(FEED_URL, { signal: controller.signal });
        if (!response.ok) throw new Error(`Curator HTTP ${response.status}`);

        const result: { data?: InstagramPost[] } = await response.json();
        if (!Array.isArray(result.data))
          throw new Error("Invalid Curator response");

        if (!controller.signal.aborted) {
          setFeed({ status: "ready", posts: result.data.slice(0, 6) });
        }
      } catch {
        if (!controller.signal.aborted) setFeed({ status: "error" });
      }
    }

    void loadPosts();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateArrows = () => {
      const scrollEnd = track.scrollWidth - track.clientWidth;

      setCanGoBack(track.scrollLeft > 2);
      setCanGoForward(track.scrollLeft < scrollEnd - 2);
    };

    const resizeObserver = new ResizeObserver(updateArrows);
    resizeObserver.observe(track);
    track.addEventListener("scroll", updateArrows, { passive: true });
    updateArrows();

    return () => {
      resizeObserver.disconnect();
      track.removeEventListener("scroll", updateArrows);
    };
  }, [postCount]);

  function moveTrack(direction: -1 | 1) {
    const track = trackRef.current;
    const firstCard = track?.children.item(0);
    const secondCard = track?.children.item(1);

    if (!track || !firstCard || !secondCard) return;

    const cardStep =
      secondCard.getBoundingClientRect().left -
      firstCard.getBoundingClientRect().left;
    const visibleCards = Number(
      getComputedStyle(track).getPropertyValue("--visible-cards"),
    );
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    track.scrollBy({
      left: direction * cardStep * visibleCards,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  return (
    <section
      id="blogs"
      className="section instagram-feed"
      aria-labelledby="instagram-title"
      lang={language}
    >
      <div className="container">
        <div className="instagram-feed__panel">
          <header className="instagram-feed__header">
            <div>
              <span className="instagram-feed__handle">@bilimnuru.academy</span>
              <h2 id="instagram-title">{t("instagram.title")}</h2>
            </div>

            {postCount > 1 && (
              <div className="instagram-feed__controls">
                <button
                  type="button"
                  aria-label={t("instagram.previous")}
                  aria-controls="instagram-track"
                  disabled={!canGoBack}
                  onClick={() => moveTrack(-1)}
                >
                  <span aria-hidden="true">←</span>
                </button>
                <button
                  type="button"
                  aria-label={t("instagram.next")}
                  aria-controls="instagram-track"
                  disabled={!canGoForward}
                  onClick={() => moveTrack(1)}
                >
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            )}
          </header>

          {feed.status === "loading" && (
            <p className="instagram-feed__status" role="status">
              {t("instagram.loading")}
            </p>
          )}

          {feed.status === "error" && (
            <p className="instagram-feed__status" role="status">
              {t("instagram.error")}
            </p>
          )}

          {feed.status === "ready" && postCount === 0 && (
            <p className="instagram-feed__status" role="status">
              {t("instagram.empty")}
            </p>
          )}

          {postCount > 0 && (
            <ul
              id="instagram-track"
              ref={trackRef}
              className="instagram-feed__track"
              aria-label={t("instagram.feedLabel")}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.target !== event.currentTarget) return;

                if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                  event.preventDefault();
                  moveTrack(event.key === "ArrowLeft" ? -1 : 1);
                }
              }}
            >
              {posts.map((post, index) => {
                const image = post.image_large || post.image || post.thumbnail;
                const poster = post.thumbnail || image;
                const date = post.source_created_at
                  ? new Date(post.source_created_at)
                  : null;
                const number = index + 1;

                return (
                  <li key={post.id} className="instagram-feed__card">
                    <div className="instagram-feed__media">
                      {post.video ? (
                        <video
                          src={post.video}
                          poster={poster}
                          controls
                          playsInline
                          preload="none"
                          aria-label={t("instagram.videoLabel", { number })}
                          onLoadedData={(event) =>
                            refreshVideoGlow(event.currentTarget)
                          }
                          onSeeked={(event) =>
                            refreshVideoGlow(event.currentTarget)
                          }
                          onTimeUpdate={(event) =>
                            paintVideoGlow(event.currentTarget)
                          }
                          onEmptied={(event) =>
                            resetVideoGlow(event.currentTarget)
                          }
                        />
                      ) : image ? (
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={t("instagram.postLabel", { number })}
                        >
                          <img
                            src={image}
                            alt=""
                            loading="lazy"
                            decoding="async"
                          />
                        </a>
                      ) : null}
                    </div>

                    <a
                      className="instagram-feed__post-link"
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t("instagram.postLabel", { number })}
                    >
                      <span>
                        {date && Number.isFinite(date.getTime()) && (
                          <time dateTime={date.toISOString()}>
                            {dateFormat.format(date)}
                          </time>
                        )}
                        {t("instagram.openPost")}
                      </span>
                      <span
                        className="instagram-feed__external"
                        aria-hidden="true"
                      >
                        ↗
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="instagram-feed__footer">
            <a
              className="instagram-feed__profile"
              href={PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("instagram.openProfile")} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
