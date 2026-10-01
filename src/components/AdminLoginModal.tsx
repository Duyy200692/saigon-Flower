import React, { useState } from 'react';
import { X, Lock, ShieldCheck, Sparkles, Key } from 'lucide-react';
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

  const handleQuickDemo = () => {
    setPassword('juetsaigon2026');
    login('juetsaigon2026');
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#181917] text-[#ede9df] rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bagerich font-bold uppercase tracking-wider text-white">
            {lang === 'vi' ? 'QUẢN TRỊ VIÊN ATELIER' : 'ADMINISTRATIVE ACCESS'}
          </h3>
          <p className="text-xs text-white/70 font-sans">
            {lang === 'vi'
              ? 'Đăng nhập để chỉnh sửa thông tin tác phẩm, workshop, logo và nén ảnh tự động'
              : 'Sign in to manage catalog, workshops, logo, and automated WebP image optimization'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block text-white/80 font-semibold mb-1 uppercase font-mono text-[10px]">
              {lang === 'vi' ? 'Mật Khẩu Quản Trị' : 'Admin Security Key'}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                autoFocus
                placeholder="Nhập mật khẩu (Mặc định: juetsaigon2026)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white focus:outline-none focus:border-amber-400 font-mono"
              />
              <Key className="w-4 h-4 text-white/40 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {error && (
              <p className="text-red-400 text-[11px] mt-1.5 font-mono">
                {lang === 'vi' ? 'Mật khẩu chưa chính xác. Vui lòng thử lại.' : 'Invalid credentials. Please try again.'}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-400 text-[#141414] font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{lang === 'vi' ? 'Xác Nhận Đăng Nhập' : 'Unlock Dashboard'}</span>
          </button>
        </form>

        {/* Quick Demo Access */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <button
            onClick={handleQuickDemo}
            className="text-[11px] font-mono text-amber-300/80 hover:text-amber-300 hover:underline flex items-center justify-center gap-1 mx-auto"
          >
            <Sparkles className="w-3 h-3" />
            <span>{lang === 'vi' ? 'Đăng nhập nhanh (Mặc định: juetsaigon2026)' : 'Quick access (Pass: juetsaigon2026)'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
