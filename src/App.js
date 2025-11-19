import React, { useState, useRef, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    username: '',
    code: ''
  });
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra input đã nhập chưa
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

    // Tự động thành công, không gọi API
    setTimeout(() => {
      toast.success('Thành công', {
        position: "top-center",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="App">
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
      
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="nav-item nav-home">
            <img src="/images/icon-home.png" alt="Home" className="nav-icon" />
            <span>Trang chủ</span>
          </div>
          <div className="logo">
            <img src="/images/logomm881.png" alt="Logo" className="logo-img" />
          </div>
          <div className="nav-items">
            <div className="nav-item">
              <img src="/images/icon-home.png" alt="Home" className="nav-icon" />
              <span>Trang chủ</span>
            </div>
            <div className="nav-item">
              <img src="/images/headphone.png" alt="Support" className="nav-icon" />
              <span>CSKH 24/7</span>
            </div>
          </div>
          <div className="nav-item nav-cskh">
            <img src="/images/headphone.png" alt="Support" className="nav-icon" />
            <span>CSKH 24/7</span>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="container-content">
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="username">Tên tài khoản:</label>
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
              <label htmlFor="code">Mã code:</label>
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
              <label>Xác thực:</label>
              <div className="captcha-container">
                {/* Cloudflare Turnstile will render here */}
                <div ref={turnstileRef} />
              </div>
            </div>
          </form>

          {/* Nút Nhận tách riêng */}
          <div className="submit-button-container">
            <img
              src="/images/btn.webp"
              alt="Nhận"
              className={`submit-btn ${isSubmitting ? 'disabled' : ''}`}
              onClick={isSubmitting ? undefined : handleSubmit}
              style={{
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.6 : 1
              }}
            />
          </div>
        </div>
      </div>
      
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
    </div>
  );
}

export default App;
