import React, { useState, useRef, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FloatingIPhoneFolderMenu from './FloatingIPhoneFolderMenu';
import './App.css';

function App() {
  // Random các số từ 188 tới 6888, chia đều, kết thúc là số có 6 hoặc 8 ở đuôi
  const POINTS = [
    188, 208, 268, 288, 338, 388, 468, 488, 528, 588, 658, 688, 768, 788, 828, 888, 948, 988,
    1688, 2688, 3688, 4888, 5888, 6688
  ];
  const [formData, setFormData] = useState({
    username: '',
    code: ''
  });
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'username' ? value.toLowerCase() : value
    }));
  };

  useEffect(() => {
    const SITEKEY = (
      process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ||
      process.env.REACT_APP_CLOUDFLARE_TURNSTILE_SITE_KEY ||
      ''
    );

    function renderWidget() {
      if (!window.turnstile || !turnstileRef.current) return;
      try {
        if (widgetIdRef.current !== null) {
          window.turnstile.reset(widgetIdRef.current);
          return;
        }

        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: SITEKEY,
          callback: (token) => setCaptchaValue(token),
          'expired-callback': () => setCaptchaValue(null),
        });
      } catch (e) {
        console.error('Turnstile render error', e);
      }
    }

    const scriptSrc = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    const existing = document.querySelector(`script[src="${scriptSrc}"]`);
    if (!existing) {
      const s = document.createElement('script');
      s.src = scriptSrc;
      s.async = true;
      s.defer = true;
      s.onload = renderWidget;
      document.body.appendChild(s);
    } else {
      if (window.turnstile) renderWidget();
      else existing.addEventListener('load', renderWidget);
    }

    return () => {
      try {
        if (window.turnstile && widgetIdRef.current !== null) {
          window.turnstile.reset(widgetIdRef.current);
        }
      } catch (e) {}
    };
  }, []);

  useEffect(() => {
    if (!isProgramModalOpen) return;
    const onKeyDown = (ev) => {
      if (ev.key === 'Escape') setIsProgramModalOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isProgramModalOpen]);

  const getRandomPoint = () => {
    if (!POINTS.length) return 0;
    const randomIndex = Math.floor(Math.random() * POINTS.length);
    return POINTS[randomIndex];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      toast.warning('Vui lòng nhập tên tài khoản', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (!formData.code.trim()) {
      toast.warning('Vui lòng nhập mã code', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setIsSubmitting(true);
    const rewardPoint = getRandomPoint();

    setTimeout(() => {
      toast.success(
        <span>
          Chúc mừng{' '}
          <span style={{ color: '#3fff0a', fontWeight: 600 }}>{formData.username}</span>{' '}
          đã nhận thành công{' '}
          <span style={{ color: '#ffff00', fontWeight: 600 }}>{rewardPoint}</span> điểm
        </span>,
        {
          position: "top-center",
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="App">
      <video
        className="bg-video-desktop"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      >
        <source src="/images/bg-pc-wc.mp4" type="video/mp4" />
      </video>

      <video
        className="bg-video-mobile"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      >
        <source src="/images/bg-mb-wc.mp4" type="video/mp4" />
      </video>

      {/* Đồng tiền animation */}
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      
      {/* Header (tạm ẩn)
      <header className="header">
        <div className="header-content">
          <div className="header-section header-section--left">
            ...
          </div>
        </div>
      </header>
      */}

      <div className="container">
        <div className="container-content">
          <img
            src="/images/logomm881.png"
            alt="MM88"
            className="modal-logo-mm88"
          />
          <img
            src="/images/text-title.png"
            alt="Nhập Code Khuyến Mãi"
            className="modal-title-img"
          />
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="username" className="field-label">Tên tài khoản:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Nhập tên người dùng"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="code" className="field-label">Mã code:</label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="Nhập mã code"
                required
              />
            </div>

            <div className="form-group">
              <label className="field-label">Xác thực:</label>
              <div className="captcha-container">
                {/* Cloudflare Turnstile will render here */}
                <div ref={turnstileRef} />
              </div>
            </div>
          </form>

          {/* Nút Nhận tách riêng */}
          <div className="submit-button-container">
            <img
              src="/images/btn-check.png"
              alt="Kiểm tra ngay"
              className={`submit-btn ${isSubmitting ? 'disabled' : ''}`}
              onClick={isSubmitting ? undefined : handleSubmit}
              style={{
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.6 : 1
              }}
            />
          </div>

          <div className="program-links">
            <a
              className="program-link"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsProgramModalOpen(true);
              }}
            >
              Thông tin chương trình
              <img className="program-link-arrow" src="/images/arrow.png" alt="" aria-hidden="true" />
            </a>
            <a
              className="program-link"
              href="https://t.me/code_mm88"
              target="_blank"
              rel="noreferrer"
            >
              Trang phát code
              <img className="program-link-arrow" src="/images/arrow.png" alt="" aria-hidden="true" />
            </a>
          </div>

          <div className="follow-row">
            <span className="follow-text">Theo dõi thêm:</span>
            <div className="follow-icons">
              <a
                className="follow-icon"
                href="https://t.me/GIAITRIMM88"
                target="_blank"
                rel="noreferrer"
                aria-label="Telegram"
              >
                <img src="/images/tele-icon.png" alt="" aria-hidden="true" />
              </a>
              <a
                className="follow-icon"
                href="https://www.facebook.com/congdongmm88vn/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <img src="/images/fb-icon.png" alt="" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {isProgramModalOpen && (
        <div
          className="overlay"
          role="presentation"
          onClick={() => setIsProgramModalOpen(false)}
        >
          <div
            className="overlay-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Thông tin chương trình"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src="/images/logo-event.png"
              alt=""
              aria-hidden="true"
              className="overlay-logo"
            />
            <button
              type="button"
              className="overlay-close"
              onClick={() => setIsProgramModalOpen(false)}
              aria-label="Đóng"
            >
              ×
            </button>
            <div className="overlay-body">
              <div className="event-link-row">
                <img
                  src="/images/text-1.png"
                  alt=""
                  aria-hidden="true"
                  className="event-link-img"
                />
                <div className="event-link-text">
                  <span>LINK SỰ KIỆN:</span>{' '}
                  <a className="event-link-domain" href="https://mm88mega.com" target="_blank" rel="noreferrer">
                    MM88MEGA.COM
                  </a>
                </div>
              </div>

              <picture className="overlay-frame-picture">
                <source media="(max-width: 768px)" srcSet="/images/text-frame-1-mb.png" />
                <img
                  src="/images/text-frame-1.png"
                  alt=""
                  aria-hidden="true"
                  className="overlay-frame-img"
                />
              </picture>

              <div className="overlay-bullets">
                <div className="overlay-bullet">
                  <span className="overlay-pin" aria-hidden="true">📌</span>
                  <span>
                    Kênh LIVE STREAM – VUI NGAY, TRÚNG NGAY{' '}
                    <a className="overlay-link" href="https://live.kjc20250.com" target="_blank" rel="noreferrer">
                      (https://live.kjc20250.com)
                    </a>
                  </span>
                </div>
                <div className="overlay-bullet">
                  <span className="overlay-pin" aria-hidden="true">📌</span>
                  <span>
                    MM88 – CODE FREE HÀNG NGÀY{' '}
                    <a className="overlay-link" href="https://t.me/code_mm88" target="_blank" rel="noreferrer">
                      (https://t.me/code_mm88)
                    </a>
                  </span>
                </div>
                <div className="overlay-bullet">
                  <span className="overlay-pin" aria-hidden="true">📌</span>
                  <span>
                    MM88 – NƠI VẬN MAY ĐÓN CHỜ&nbsp;
                    <a className="overlay-handle" href="https://t.me/GIAITRIMM88" target="_blank" rel="noreferrer">(https://t.me/GIAITRIMM88)</a>
                  </span>
                </div>
              </div>

              <picture className="overlay-frame-picture">
                <source media="(max-width: 768px)" srcSet="/images/text-frame-2-mb-new.png" />
                <img
                  src="/images/text-frame-2-new.png"
                  alt=""
                  aria-hidden="true"
                  className="overlay-frame-img"
                />
              </picture>

              <div className="overlay-access-section">
                <img
                  src="/images/head-link-truy-cap.png"
                  alt=""
                  aria-hidden="true"
                  className="overlay-access-head"
                />
                <div className="overlay-access-lines">
                  <div className="overlay-bullet">
                    <span className="overlay-pin" aria-hidden="true">📌</span>
                    <span className="overlay-access-link-text" style={{ color: '#fff' }}>
                      LINK PC :{' '}
                      <a
                        href="https://mm88a1.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="overlay-link"
                        style={{ color: '#d3b864' }}
                      >
                        mm88a1.com
                      </a>
                    </span>
                  </div>
                  <div className="overlay-bullet">
                    <span className="overlay-pin" aria-hidden="true">📌</span>
                    <span className="overlay-access-link-text" style={{ color: '#fff' }}>
                      LINK MB :{' '}
                      <a
                        href="https://88833.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="overlay-link"
                        style={{ color: '#d3b864' }}
                      >
                        88833.COM
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={8000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '500',
        }}
      />

      <FloatingIPhoneFolderMenu />
    </div>
  );
}

export default App;
