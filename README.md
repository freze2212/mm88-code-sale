# User Code Verification with Google reCAPTCHA

Ứng dụng React để xác thực mã code với Google reCAPTCHA.

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env` trong thư mục gốc:
```env
# API Configuration
REACT_APP_API_URL=http://localhost:1234

# Port Configuration (optional - for development server)
PORT=3000

# Environment
NODE_ENV=development

# Google reCAPTCHA (optional - if you want to override in .env)
REACT_APP_RECAPTCHA_SITE_KEY=6LdCOawrAAAAADXBh2w0jyCAqYLVNk4xlTfEOitw
```

3. Đặt ảnh background vào thư mục `public/images/`:
   - `background.png` - Ảnh nền chính
   - `form-bg.png` - Ảnh nền form
   - `logorr88.png` - Logo header

4. **Tạo favicon cho RR88** (khuyến nghị):
   - Tạo file `favicon.ico` (16x16, 32x32, 48x48) - đặt trong `public/`
   - Tạo các icon PNG: `favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png`
   - Tạo Apple touch icon: `apple-touch-icon.png` (180x180)
   - Tạo Android icons: `android-chrome-192x192.png`, `android-chrome-512x512.png`
   
   **Công cụ tạo favicon:**
   - [Favicon.io](https://favicon.io/) - Tạo từ text, emoji, hoặc hình ảnh
   - [RealFaviconGenerator.net](https://realfavicongenerator.net/) - Tạo đầy đủ các kích thước
   - [Favicon Generator](https://www.favicon-generator.org/) - Tạo từ logo có sẵn

## Chạy ứng dụng

### Sử dụng port mặc định (3000):
```bash
npm start
```

### Sử dụng port tùy chỉnh từ file .env:
```bash
npm run start:env
```

### Sử dụng port cụ thể:
```bash
npm run start:custom
```

## Cấu hình

### Thay đổi port API:
Chỉnh sửa `REACT_APP_API_URL` trong file `.env`:
```env
REACT_APP_API_URL=http://localhost:8080
```

### Thay đổi port development server:
Chỉnh sửa `PORT` trong file `.env`:
```env
PORT=8080
```

## Cấu trúc dự án

```
├── public/
│   ├── images/
│   │   ├── background.png
│   │   ├── form-bg.png
│   │   └── logorr88.png
│   └── index.html
├── src/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   ├── index.css
│   └── utils/
│       └── apiHelper.js
├── .env
├── .env.example
└── package.json
```

## Lưu ý quan trọng

- **File `.env` phải được tạo trong thư mục gốc của dự án**
- **Tất cả biến môi trường phải bắt đầu bằng `REACT_APP_` để React có thể đọc được**
- **Sau khi thay đổi `.env`, bạn cần restart development server**
- **File `.env` không nên commit lên git (thêm vào `.gitignore`)**

## Troubleshooting

### Nếu port không hoạt động:
1. Kiểm tra file `.env` có đúng định dạng không
2. Đảm bảo port không bị sử dụng bởi ứng dụng khác
3. Restart development server sau khi thay đổi `.env`

### Nếu API không kết nối được:
1. Kiểm tra `REACT_APP_API_URL` trong `.env`
2. Đảm bảo API server đang chạy
3. Kiểm tra console để xem log API URL
