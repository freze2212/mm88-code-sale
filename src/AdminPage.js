import React, { useMemo, useState } from 'react';
import {
  loadAdminPassword,
  loadAdminUsername,
  loadPrizeConfigs,
  normalizeAccountId,
  savePrizeConfigs,
} from './utils/prizeConfig';
import './AdminPage.css';

function AdminPage() {
  const [adminUsername] = useState(() => loadAdminUsername());
  const [adminPassword] = useState(() => loadAdminPassword());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [configs, setConfigs] = useState(() => loadPrizeConfigs());
  const [accountId, setAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const sortedConfigs = useMemo(() => {
    return [...configs].sort((left, right) => left.accountId.localeCompare(right.accountId));
  }, [configs]);

  const handleLogin = (event) => {
    event.preventDefault();

    if (loginUsername.trim() !== adminUsername || loginPassword !== adminPassword) {
      setMessage('Tài khoản hoặc mật khẩu admin không đúng.');
      return;
    }

    setIsAuthenticated(true);
    setLoginUsername('');
    setLoginPassword('');
    setMessage('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedAccountId = normalizeAccountId(accountId);
    const parsedAmount = Number(amount);

    if (!normalizedAccountId) {
      setMessage('Vui lòng nhập tài khoản.');
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setMessage('Vui lòng nhập số tiền hợp lệ.');
      return;
    }

    const nextConfigs = [...configs];
    const existingIndex = nextConfigs.findIndex((item) => item.accountId === normalizedAccountId);
    const nextItem = { accountId: normalizedAccountId, amount: Math.floor(parsedAmount) };

    if (existingIndex >= 0) {
      nextConfigs[existingIndex] = nextItem;
    } else {
      nextConfigs.push(nextItem);
    }

    savePrizeConfigs(nextConfigs);
    setConfigs(nextConfigs);
    setAccountId('');
    setAmount('');
    setMessage(`Đã lưu cấu hình cho tài khoản ${normalizedAccountId}.`);
  };

  const handleDelete = (targetAccountId) => {
    const nextConfigs = configs.filter((item) => item.accountId !== targetAccountId);
    savePrizeConfigs(nextConfigs);
    setConfigs(nextConfigs);
    setMessage(`Đã xóa cấu hình của tài khoản ${targetAccountId}.`);
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-page">
        <div className="admin-wrap" style={{ maxWidth: 560 }}>
          <div className="admin-card">
            <p className="admin-kicker">Admin Login</p>
            <h1 className="admin-title">Đăng nhập admin</h1>

            <form onSubmit={handleLogin} className="admin-form" style={{ marginTop: 24 }}>
              <label className="admin-label">
                <span>Tài khoản</span>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(event) => setLoginUsername(event.target.value)}
                  autoComplete="username"
                />
              </label>

              <label className="admin-label">
                <span>Mật khẩu</span>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  autoComplete="current-password"
                />
              </label>

              <button type="submit" className="admin-btn">
                Vào trang admin
              </button>
            </form>

            {message ? <p className="admin-message" style={{ marginTop: 16 }}>{message}</p> : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-wrap">
        <div className="admin-card admin-header">
          <div>
            <p className="admin-kicker">Admin Prize Config</p>
            <h1 className="admin-title">Cấu hình thưởng theo tài khoản</h1>
          </div>
          <a href="/" className="admin-link">
            Về trang nhận code
          </a>
        </div>

        <div className="admin-grid">
          <form onSubmit={handleSubmit} className="admin-card admin-form">
            <h2 className="admin-title" style={{ fontSize: 22 }}>Thêm hoặc cập nhật</h2>
            <label className="admin-label">
              <span>Tài khoản</span>
              <input
                type="text"
                value={accountId}
                onChange={(event) => setAccountId(event.target.value)}
                placeholder="Ví dụ: player01"
              />
            </label>

            <label className="admin-label">
              <span>Số tiền nhận</span>
              <input
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Ví dụ: 888"
              />
            </label>

            <button type="submit" className="admin-btn">
              Lưu cấu hình
            </button>

            {message ? <p className="admin-message">{message}</p> : null}
          </form>

          <div className="admin-card">
            <div className="admin-list-head">
              <h2 className="admin-title" style={{ fontSize: 22 }}>Danh sách cấu hình</h2>
              <span className="admin-count">{sortedConfigs.length} tài khoản</span>
            </div>

            <div className="admin-list">
              {sortedConfigs.length ? (
                sortedConfigs.map((item) => (
                  <div key={item.accountId} className="admin-item">
                    <div>
                      <p className="admin-item-label">Tài khoản</p>
                      <p className="admin-item-value">{item.accountId}</p>
                    </div>
                    <div>
                      <p className="admin-item-label">Tiền nhận</p>
                      <p className="admin-item-value admin-item-amount">{item.amount}</p>
                    </div>
                    <button
                      type="button"
                      className="admin-btn-danger"
                      onClick={() => handleDelete(item.accountId)}
                    >
                      Xóa
                    </button>
                  </div>
                ))
              ) : (
                <div className="admin-empty">
                  Chưa có cấu hình nào. Tài khoản không có trong danh sách sẽ random điểm mặc định (188–888).
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
