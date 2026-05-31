import React, { useEffect, useMemo, useRef, useState } from 'react';
import './FloatingIPhoneFolderMenu.css';

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function FloatingIPhoneFolderMenu({
  items,
  storageKey = 'rr88_floating_home_pos',
}) {
  const [open, setOpen] = useState(false);
  const [homeHref, setHomeHref] = useState('https://mb-mm88-link.rr88tino.workers.dev/');
  const [pos, setPos] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const buttonSize = 60;
  const buttonRadius = buttonSize / 2;

  const dragRef = useRef({
    dragging: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    startPosX: 0,
    startPosY: 0,
    moved: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const detect = () => {
      const byWidth = window.matchMedia?.('(max-width: 767px)')?.matches ?? false;
      const byUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

      setHomeHref(
        byWidth || byUA
          ? 'https://mb-mm88-link.rr88tino.workers.dev/'
          : 'https://pc-mm88-link.rr88tino.workers.dev/'
      );
    };

    detect();
    window.addEventListener('resize', detect);
    return () => window.removeEventListener('resize', detect);
  }, []);

  const defaultItems = useMemo(
    () => [
      {
        key: 'CSKH',
        href: 'https://mm88-cskh.pages.dev/',
        iconSrc: '/IconChat.png',
      },
      {
        key: 'tele-vip',
        href: 'https://t.me/Khieunaimm888',
        iconSrc: '/telekhieunai.png',
      },
      {
        key: 'tele-club',
        href: 'https://t.me/quatangmm88',
        iconSrc: '/telequatang.png',
      },
      {
        key: 'nhan-code',
        href: 'https://mm88code.com/',
        iconSrc: '/nhapcode.png',
      },
      {
        key: 'home',
        href: homeHref,
        newTab: false,
        iconSrc: '/home.png',
      },
      {
        key: 'huong-dan',
        href: 'https://mm88ttkm.com/',
        iconSrc: '/khuyenmai.png',
      },
      {
        key: 'fanpage',
        href: 'https://www.facebook.com/congdongmm88vn/',
        iconSrc: '/fanpage.png',
      },
      {
        key: 'kenh-tele',
        href: 'https://t.me/GIAITRIMM88',
        iconSrc: '/tintuc.png',
      },
      {
        key: 'tong-dai',
        href: 'https://mm88gift.com/',
        iconSrc: '/trangquatang.png',
      },
    ],
    [homeHref]
  );

  const list = items?.length ? items : defaultItems;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const w = window.innerWidth;
    const h = window.innerHeight;
    const isDesktopSize = w >= 768;
    const marginX = isDesktopSize ? 40 : 8;
    const marginY = isDesktopSize ? 40 : 16;

    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw);
        if (typeof saved?.x === 'number' && typeof saved?.y === 'number') {
          setPos({
            x: clamp(saved.x, buttonRadius + marginX, w - buttonRadius - marginX),
            y: clamp(saved.y, buttonRadius + marginY, h - buttonRadius - marginY),
          });
          return;
        }
      }
    } catch (error) {}

    setPos({
      x: w - (buttonRadius + marginX),
      y: h - (buttonRadius + marginY),
    });
  }, [buttonRadius, storageKey]);

  useEffect(() => {
    if (typeof window === 'undefined' || !pos) {
      return undefined;
    }

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isDesktopSize = w >= 768;
      const marginX = isDesktopSize ? 40 : 8;
      const marginY = isDesktopSize ? 40 : 16;

      setPos({
        x: clamp(pos.x, buttonRadius + marginX, w - buttonRadius - marginX),
        y: clamp(pos.y, buttonRadius + marginY, h - buttonRadius - marginY),
      });
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [buttonRadius, pos]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const onPointerDown = (event) => {
    if (!pos) {
      return;
    }

    dragRef.current.dragging = true;
    dragRef.current.pointerId = event.pointerId;
    dragRef.current.startX = event.clientX;
    dragRef.current.startY = event.clientY;
    dragRef.current.startPosX = pos.x;
    dragRef.current.startPosY = pos.y;
    dragRef.current.moved = false;

    if (event.currentTarget.setPointerCapture) {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch (error) {}
    }
  };

  const onPointerMove = (event) => {
    if (!dragRef.current.dragging || dragRef.current.pointerId !== event.pointerId) {
      return;
    }

    const dx = event.clientX - dragRef.current.startX;
    const dy = event.clientY - dragRef.current.startY;

    if (!dragRef.current.moved && Math.hypot(dx, dy) > 6) {
      dragRef.current.moved = true;
      setIsDragging(true);
    }

    const w = window.innerWidth;
    const h = window.innerHeight;
    const isDesktopSize = w >= 768;
    const marginX = isDesktopSize ? 40 : 8;
    const marginY = isDesktopSize ? 40 : 16;

    setPos({
      x: clamp(dragRef.current.startPosX + dx, buttonRadius + marginX, w - buttonRadius - marginX),
      y: clamp(dragRef.current.startPosY + dy, buttonRadius + marginY, h - buttonRadius - marginY),
    });
  };

  const onPointerUp = (event) => {
    if (dragRef.current.pointerId !== event.pointerId) {
      return;
    }

    const moved = dragRef.current.moved;
    dragRef.current.dragging = false;
    dragRef.current.pointerId = -1;
    setIsDragging(false);

    if (moved && typeof window !== 'undefined' && pos) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isDesktopSize = w >= 768;
      const marginX = isDesktopSize ? 40 : 8;
      const marginY = isDesktopSize ? 40 : 16;
      const snapX = pos.x < w / 2 ? buttonRadius + marginX : w - buttonRadius - marginX;
      const snapped = {
        x: snapX,
        y: clamp(pos.y, buttonRadius + marginY, h - buttonRadius - marginY),
      };

      setPos(snapped);

      try {
        localStorage.setItem(storageKey, JSON.stringify(snapped));
      } catch (error) {}
    } else {
      if (pos) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(pos));
        } catch (error) {}
      }

      if (!moved) {
        setOpen((value) => !value);
      }
    }

    if (event.currentTarget.releasePointerCapture) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch (error) {}
    }
  };

  if (!pos) {
    return null;
  }

  return (
    <div className="floating-folder-menu">
      <button
        type="button"
        aria-label="Home menu"
        className={`floating-folder-menu__button${isDragging ? ' floating-folder-menu__button--dragging' : ''}`}
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: 'translate(-50%, -50%)',
          WebkitTapHighlightColor: 'transparent',
          transition: isDragging
            ? 'none'
            : 'left 180ms cubic-bezier(0.2, 0.8, 0.2, 1), top 180ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 150ms',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <img src="/home.png" alt="" draggable={false} />
      </button>

      <div className={`floating-folder-menu__overlay${open ? ' floating-folder-menu__overlay--open' : ''}`}>
        <div className="floating-folder-menu__backdrop" onClick={() => setOpen(false)} />

        <div className="floating-folder-menu__center" onClick={() => setOpen(false)}>
          <div
            className={`floating-folder-menu__panel${open ? ' floating-folder-menu__panel--open' : ''}`}
            style={{ backgroundImage: "url('/bgfloatingbutton1.png')" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="floating-folder-menu__grid">
              {list.map((item, index) => {
                const content = (
                  <div
                    className={`floating-folder-menu__item${open ? ' floating-folder-menu__item--open' : ''}`}
                    style={{ transitionDelay: open ? `${index * 28}ms` : '0ms' }}
                  >
                    <div className="floating-folder-menu__tile">
                      {item.iconSrc ? (
                        <img
                          src={item.iconSrc}
                          alt=""
                          className="floating-folder-menu__icon-image"
                        />
                      ) : (
                        <span className="floating-folder-menu__icon-fallback">{item.icon}</span>
                      )}
                    </div>
                  </div>
                );

                if (item.href) {
                  const isExternal = item.href.startsWith('http');
                  const newTab = item.newTab ?? isExternal;

                  return (
                    <a
                      key={item.key}
                      href={item.href}
                      target={newTab ? '_blank' : undefined}
                      rel={newTab ? 'noopener noreferrer' : undefined}
                      onClick={() => setOpen(false)}
                      className="floating-folder-menu__link"
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <button
                    key={item.key}
                    type="button"
                    className="floating-folder-menu__item-button"
                    onClick={() => {
                      setOpen(false);
                      item.onClick?.();
                    }}
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
