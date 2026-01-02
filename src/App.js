import React, { useState, useRef, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { api } from './utils/apiHelper';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    username: '',
    code: ''
  });
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rewardPoint, setRewardPoint] = useState(0);
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

    if (!captchaValue) {
      toast.warning('Vui lòng xác thực reCAPTCHA', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

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

    setIsSubmitting(true);

         try {
       // Gọi API sử dụng helper function
       const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:1234';
       const fullApiUrl = `${apiUrl}/codes/use-code-public`;
       
       const response = await api.post(fullApiUrl, {
         username: formData.username,
         code: formData.code,
         captchaToken: captchaValue
       }, {
         headers: {
           'Accept': 'application/json',
           'Accept-Language': 'en-US,en;q=0.9'
         }
       });

       const result = response.data; 
       console.log("result", result);

        if (result.message === "Thành công") {
          const points = result?.data?.pointsAdded || 0;
          setRewardPoint(points);
          const successContent = (
            <span>
              Chúc mừng{' '}
              <span style={{ color: '#3fff0a', fontWeight: 600 }}>{formData.username}</span>{' '}
              đã nhận thành công{' '}
              <span style={{ color: '#ffff00', fontWeight: 600 }}>{points}</span> điểm
            </span>
          );
            toast.success(successContent, {
              position: "top-center",
              autoClose: 8000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
            // Không reset gì cả khi thành công
                   } else {
         // Xử lý response error - chỉ hiển thị message
         const errorMessage = result.message || 'Xác thực thất bại, vui lòng kiểm tra lại thông tin.';
         
         toast.error(errorMessage, {
           position: "top-center",
           autoClose: 10000,
           hideProgressBar: false,
           closeOnClick: true,
           pauseOnHover: true,
           draggable: true,
         });
       }

         } catch (error) {
       console.error('API Error:', error);
       
               // Xử lý error từ helper function - chỉ hiển thị message
        if (error.data) {
          // Nếu có error data từ API
          const errorMessage = error.data.message || 'Xác thực thất bại, vui lòng kiểm tra lại thông tin.';
          
          toast.error(errorMessage, {
            position: "top-center",
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else if (error.message.includes('Failed to fetch')) {
         toast.error('Không thể kết nối đến server, vui lòng kiểm tra kết nối mạng.', {
           position: "top-center",
           autoClose: 8000,
           hideProgressBar: false,
           closeOnClick: true,
           pauseOnHover: true,
           draggable: true,
         });
       } else {
         toast.error('Có lỗi xảy ra, vui lòng thử lại sau.', {
           position: "top-center",
           autoClose: 8000,
           hideProgressBar: false,
           closeOnClick: true,
           pauseOnHover: true,
           draggable: true,
         });
       }
                    } finally {
                      setIsSubmitting(false);
                      // Reset Turnstile (or reCAPTCHA if still present) and clear token
                      try {
                        if (window.turnstile && widgetIdRef.current !== null) {
                          window.turnstile.reset(widgetIdRef.current);
                        } else if (window.grecaptcha) {
                          window.grecaptcha.reset();
                        }
                      } catch (e) {}
                      setCaptchaValue(null);
                    }
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
          <a href='https://pc-mm88-link.rr88tino.workers.dev'
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="nav-item nav-home">
              <img src="/images/icon-home.png" alt="Home" className="nav-icon" />
              <span>Trang chủ</span>
            </div> 
          </a>
          <div className="logo">
            <img src="/images/logomm881.png" alt="Logo" className="logo-img" />
          </div>
          <div className="nav-items">
            <a href='https://pc-mm88-link.rr88tino.workers.dev'
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="nav-item">
                <img src="/images/icon-home.png" alt="Home" className="nav-icon" />
                <span>Trang chủ</span>
              </div>
            </a>
            <a href='https://mm88-cskh.pages.dev'
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="nav-item">
                <img src="/images/headphone.png" alt="Support" className="nav-icon" />
                <span>CSKH 24/7</span>
              </div>
            </a>
          </div>
          <a href='https://mm88-cskh.pages.dev'
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="nav-item nav-cskh">
              <img src="/images/headphone.png" alt="Support" className="nav-icon" />
              <span>CSKH 24/7</span>
            </div>
          </a>
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
