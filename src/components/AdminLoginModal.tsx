import React, { useState } from 'react';
import { X, Lock, ShieldCheck, Key, Eye, EyeOff } from 'lucide-react';
import { useAtelier } from '../context/AtelierContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lang: 'vi' | 'en';
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  lang
}) => {
  const { login } = useAtelier();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

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
    <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-2xl flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-md glass-frost-dark squircle-2xl rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 shadow-soft-3 border border-white/20 text-[#ede9df]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="spring-press absolute top-4 right-4 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-xl border border-white/10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-[18px] bg-amber-400/10 border border-amber-400/30 text-amber-300 flex items-center justify-center mx-auto mb-3 shadow-soft-1">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bagerich font-bold uppercase tracking-wider text-white">
            {lang === 'vi' ? 'QUẢN TRỊ VIÊN ATELIER' : 'ADMINISTRATIVE ACCESS'}
          </h3>
          <p className="text-xs text-white/70 font-sans">
            {lang === 'vi'
              ? 'Xác thực mật khẩu bảo mật để truy cập bảng điều khiển quản trị'
              : 'Enter admin security key to access atelier management portal'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block text-white/80 font-semibold mb-1.5 uppercase font-mono text-[10px] tracking-wider">
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
                className="w-full pl-4 pr-11 py-3 bg-black/60 border border-white/20 rounded-[20px] text-white focus:outline-none focus:border-amber-400 font-mono backdrop-blur-xl placeholder:text-white/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-amber-300 transition-colors p-1"
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <p className="text-red-400 text-[11px] mt-2 font-mono flex items-center gap-1.5">
                <span>⚠️</span>
                <span>{lang === 'vi' ? 'Mật khẩu chưa chính xác. Vui lòng kiểm tra lại.' : 'Invalid credentials. Please try again.'}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="spring-press w-full py-3.5 rounded-[22px] bg-amber-400 text-[#141414] font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all flex items-center justify-center gap-2 shadow-soft-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{lang === 'vi' ? 'Xác Nhận Đăng Nhập' : 'Unlock Dashboard'}</span>
          </button>
        </form>

      </div>
    </div>
  );
};
