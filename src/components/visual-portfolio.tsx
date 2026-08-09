"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, ChevronLeft, ChevronRight, Close, Play } from "@/components/icons";
import { MediaPlaceholder } from "@/components/media-placeholder";
import type { Photograph, VideoProject } from "@/data/portfolio";

type VisualPortfolioProps = {
  photographs: Photograph[];
  videos: VideoProject[];
  activeTab: "photography" | "videography" | null;
};

function photographTone(index: number): "cyan" | "blue" | "violet" | "slate" {
  return (["cyan", "blue", "violet", "slate"] as const)[index % 4];
}

export function VisualPortfolio({ photographs, videos, activeTab }: VisualPortfolioProps) {
  const [photoCount, setPhotoCount] = useState(6);
  const [videoCount, setVideoCount] = useState(3);
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  const [videoIndex, setVideoIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const touchStart = useRef<number | null>(null);

  const closeModal = useCallback(() => {
    setPhotoIndex(null);
    setVideoIndex(null);
    window.requestAnimationFrame(() => returnFocusRef.current?.focus());
  }, []);

  const movePhoto = useCallback((direction: number) => {
    setPhotoIndex((current) => current === null ? null : (current + direction + photographs.length) % photographs.length);
  }, [photographs.length]);

  useEffect(() => {
    if (photoIndex === null) return;
    const next = photographs[(photoIndex + 1) % photographs.length]?.src;
    const previous = photographs[(photoIndex - 1 + photographs.length) % photographs.length]?.src;
    [next, previous].forEach((src) => {
      if (src) {
        const image = new window.Image();
        image.src = src;
      }
    });
  }, [photoIndex, photographs]);

  useEffect(() => {
    const isOpen = photoIndex !== null || videoIndex !== null;
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
      if (photoIndex !== null && event.key === "ArrowLeft") movePhoto(-1);
      if (photoIndex !== null && event.key === "ArrowRight") movePhoto(1);

      if (event.key === "Tab" && modalRef.current) {
        const focusable = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], iframe'),
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal, movePhoto, photoIndex, videoIndex]);

  const openPhoto = (index: number, trigger: HTMLElement) => {
    returnFocusRef.current = trigger;
    setPhotoIndex(index);
  };

  const openVideo = (index: number, trigger: HTMLElement) => {
    returnFocusRef.current = trigger;
    setVideoIndex(index);
  };

  const activePhoto = photoIndex === null ? null : photographs[photoIndex];
  const activeVideo = videoIndex === null ? null : videos[videoIndex];
  const videoUrl = activeVideo?.videoId
    ? activeVideo.provider === "youtube"
      ? `https://www.youtube-nocookie.com/embed/${activeVideo.videoId}`
      : `https://player.vimeo.com/video/${activeVideo.videoId}`
    : null;

  return (
    <>
      <div
        className="experience-creative-panel"
        id="experience-creative-photography-panel"
        role="tabpanel"
        aria-labelledby="experience-creative-photography-tab"
        hidden={activeTab !== "photography"}
      >
        <div className="photo-masonry">
          {photographs.slice(0, photoCount).map((photo, index) => (
            <button
              className={`photo-tile photo-tile--${photo.orientation}`}
              key={photo.id}
              type="button"
              onClick={(event) => openPhoto(index, event.currentTarget)}
              aria-label={`Open ${photo.caption} in full view`}
            >
              {photo.src ? (
                // Native img keeps future local or hosted portfolio assets flexible.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo.src} alt={photo.alt} loading="lazy" />
              ) : (
                <MediaPlaceholder label="Photo ready to add" tone={photographTone(index)}>
                  <Camera />
                </MediaPlaceholder>
              )}
              <span className="photo-tile__caption">
                <strong>{photo.caption}</strong>
                <small>{photo.location ?? photo.year}</small>
              </span>
            </button>
          ))}
        </div>
        {photoCount < photographs.length ? (
          <button className="load-more" type="button" onClick={() => setPhotoCount((count) => Math.min(count + 3, photographs.length))}>
            Load more photographs
          </button>
        ) : null}
      </div>

      <div
        className="experience-creative-panel"
        id="experience-creative-videography-panel"
        role="tabpanel"
        aria-labelledby="experience-creative-videography-tab"
        hidden={activeTab !== "videography"}
      >
        <div className="video-grid">
          {videos.slice(0, videoCount).map((video, index) => (
            <article className="video-card" key={video.id}>
              <button
                className="video-card__media"
                type="button"
                onClick={(event) => openVideo(index, event.currentTarget)}
                aria-label={`Open ${video.title}`}
              >
                {video.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={video.thumbnail} alt="" loading="lazy" />
                ) : (
                  <MediaPlaceholder label="Video ready to link" tone={photographTone(index + 1)} />
                )}
                <span className="video-card__play"><Play /></span>
              </button>
              <div className="video-card__content">
                <div className="card-meta"><span>{video.year}</span>{video.duration ? <span>{video.duration}</span> : null}</div>
                <h3>{video.title}</h3>
                <p>{video.description}</p>
              </div>
            </article>
          ))}
        </div>
        {videoCount < videos.length ? (
          <button className="load-more" type="button" onClick={() => setVideoCount((count) => Math.min(count + 3, videos.length))}>
            Load more videos
          </button>
        ) : null}
      </div>

      {(activePhoto || activeVideo) ? (
        <div
          className="lightbox-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div
            ref={modalRef}
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={activePhoto ? `${activePhoto.caption}, full view` : `${activeVideo?.title}, video player`}
            onTouchStart={(event) => {
              touchStart.current = event.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              if (!activePhoto || touchStart.current === null) return;
              const distance = event.changedTouches[0].clientX - touchStart.current;
              if (Math.abs(distance) > 50) movePhoto(distance < 0 ? 1 : -1);
              touchStart.current = null;
            }}
          >
            <div className="lightbox__top">
              <span>{activePhoto ? `${(photoIndex ?? 0) + 1} / ${photographs.length}` : "Videography"}</span>
              <button ref={closeRef} type="button" onClick={closeModal} aria-label="Close full view"><Close /></button>
            </div>

            {activePhoto ? (
              <>
                <div className="lightbox__media">
                  {activePhoto.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={activePhoto.src} alt={activePhoto.alt} />
                  ) : (
                    <MediaPlaceholder label="Replace with your photograph" tone={photographTone(photoIndex ?? 0)}>
                      <Camera />
                    </MediaPlaceholder>
                  )}
                  <button className="lightbox__previous" type="button" onClick={() => movePhoto(-1)} aria-label="Previous photograph"><ChevronLeft /></button>
                  <button className="lightbox__next" type="button" onClick={() => movePhoto(1)} aria-label="Next photograph"><ChevronRight /></button>
                </div>
                <div className="lightbox__caption">
                  <strong>{activePhoto.caption}</strong>
                  <span>{[activePhoto.location, activePhoto.year].filter(Boolean).join(" · ")}</span>
                </div>
              </>
            ) : activeVideo ? (
              <>
                <div className="lightbox__video">
                  {videoUrl ? (
                    <iframe
                      src={videoUrl}
                      title={activeVideo.title}
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <MediaPlaceholder label="Add a YouTube or Vimeo ID to play this work" tone="violet"><Play /></MediaPlaceholder>
                  )}
                </div>
                <div className="lightbox__caption">
                  <strong>{activeVideo.title}</strong>
                  <span>{activeVideo.description}</span>
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
