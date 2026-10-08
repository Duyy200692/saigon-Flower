import React, { useState } from 'react';
import { X, Lock, ShieldCheck, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { useAtelier } from '../context/AtelierContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lang: 'vi' | 'en';
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  lang,
  theme = 'light',
  onToggleTheme
}) => {
  const { login } = useAtelier();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setError(false);
      setPassword('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-60 backdrop-blur-2xl flex items-center justify-center p-4 animate-fadeIn transition-colors duration-300 ${
        isDark ? 'bg-black/80' : 'bg-[#141414]/45'
      }`}
    >
      <div
        className={`relative w-full max-w-md rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 shadow-2xl border transition-colors duration-300 ${
          isDark
            ? 'bg-[#181917] border-white/20 text-[#ede9df]'
            : 'bg-[#f4f1ea] border-[#141414]/15 text-[#141414]'
        }`}
      >
        {/* Theme Toggle Button */}
        {onToggleTheme && (
          <button
            type="button"
            onClick={onToggleTheme}
            className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[11px] font-mono font-semibold uppercase flex items-center gap-1.5 border transition-colors ${
              isDark
                ? 'bg-white/10 hover:bg-white/20 text-amber-300 border-white/15'
                : 'bg-white hover:bg-[#141414] text-[#141414] hover:text-[#f7f5f0] border-[#141414]/15 shadow-sm'
            }`}
            title={isDark ? 'Chuyển sang chế độ Sáng (Light Mode)' : 'Chuyển sang chế độ Tối (Dark Mode)'}
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </>
            )}
          </button>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`spring-press absolute top-4 right-4 p-2 rounded-full transition-colors border ${
            isDark
              ? 'text-white/60 hover:text-white hover:bg-white/10 border-white/10'
              : 'text-[#141414]/60 hover:text-[#141414] hover:bg-black/5 border-[#141414]/15 bg-white/60'
          }`}
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6 mt-2">
          <div
            className={`w-12 h-12 rounded-[18px] border flex items-center justify-center mx-auto mb-3 shadow-sm ${
              isDark
                ? 'bg-amber-400/10 border-amber-400/30 text-amber-300'
                : 'bg-[#141414] border-[#141414] text-amber-300'
            }`}
          >
            <Lock className="w-6 h-6" />
          </div>
          <h3
            className={`text-xl font-bagerich font-bold uppercase tracking-wider ${
              isDark ? 'text-white' : 'text-[#141414]'
            }`}
          >
            {lang === 'vi' ? 'QUẢN TRỊ VIÊN ATELIER' : 'ADMINISTRATIVE ACCESS'}
          </h3>
          <p className={`text-xs font-sans ${isDark ? 'text-white/70' : 'text-[#141414]/70'}`}>
            {lang === 'vi'
              ? 'Xác thực mật khẩu bảo mật để truy cập bảng điều khiển quản trị'
              : 'Enter admin security key to access atelier management portal'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div>
            <label
              className={`block font-semibold mb-1.5 uppercase font-mono text-[10px] tracking-wider ${
                isDark ? 'text-white/80' : 'text-[#141414]/80'
              }`}
            >
              {lang === 'vi' ? 'Mật Khẩu Quản Trị' : 'Admin Security Password'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                placeholder={lang === 'vi' ? 'Nhập mật khẩu quản trị viên' : 'Enter admin password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className={`w-full pl-4 pr-11 py-3 border rounded-[20px] focus:outline-none font-mono transition-colors ${
                  isDark
                    ? 'bg-black/60 border-white/20 text-white focus:border-amber-400 placeholder:text-white/30'
                    : 'bg-white border-[#141414]/20 text-[#141414] focus:border-[#141414] placeholder:text-[#141414]/40 shadow-inner'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors p-1 ${
                  isDark ? 'text-white/50 hover:text-amber-300' : 'text-[#141414]/50 hover:text-[#141414]'
                }`}
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <p
                className={`text-[11px] mt-2 font-mono flex items-center gap-1.5 ${
                  isDark ? 'text-red-400' : 'text-red-600 font-semibold'
                }`}
              >
                <span>⚠️</span>
                <span>
                  {lang === 'vi'
                    ? 'Mật khẩu chưa chính xác. Vui lòng kiểm tra lại.'
                    : 'Invalid credentials. Please try again.'}
                </span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`spring-press w-full py-3.5 rounded-[22px] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md ${
              isDark
                ? 'bg-amber-400 text-[#141414] hover:bg-amber-300'
                : 'bg-[#141414] text-[#f7f5f0] hover:bg-[#2b2a28]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{lang === 'vi' ? 'Xác Nhận Đăng Nhập' : 'Unlock Dashboard'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
