import React, { useState } from 'react';
import { ShieldCheck, Users, UserPlus, Trash2, Check, AlertCircle } from 'lucide-react';
import { useAtelier, OWNER_EMAIL, StaffMember } from '../context/AtelierContext';

const ROLE_LABELS: Record<StaffMember['role'] | 'owner', string> = {
  owner: 'Chủ hệ thống',
  manager: 'Quản lý',
  sales: 'Bán hàng',
  florist: 'Thợ hoa'
};

const ROLE_DESCRIPTIONS: Record<StaffMember['role'] | 'owner', string> = {
  owner: 'Toàn quyền, quản lý nhân sự, xóa đơn và dữ liệu',
  manager: 'Sửa hoa, workshop, thương hiệu, vật tư; xử lý đơn hàng và đăng ký workshop',
  sales: 'Xem và xử lý đơn hàng, đăng ký workshop; xem vật tư',
  florist: 'Xem đơn, cập nhật tiến độ sản xuất; dùng vật tư'
};

export const StaffManagementPanel: React.FC = () => {
  const { staffRole, staffEmail, staffList, saveStaffMember, removeStaffMember } = useAtelier();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<StaffMember['role']>('sales');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const isOwner = staffRole === 'owner';

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await saveStaffMember({ email, role, displayName: name, active: true });
    setBusy(false);
    setMsg({ text: res.message, isError: !res.success });
    if (res.success) {
      setEmail('');
      setName('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-xl font-bagerich font-bold uppercase text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span>NHÂN SỰ & PHÂN QUYỀN</span>
        </h3>
        <p className="text-xs text-white/60 font-sans mt-0.5">
          Đăng nhập bằng tài khoản Google. Mỗi người một vai trò, có thể thu hồi quyền bất cứ lúc nào.
        </p>
      </div>

      <div className="p-4 bg-black/40 rounded-xl border border-amber-500/20 space-y-2 text-xs">
        <div className="flex justify-between items-center py-1.5 border-b border-white/10">
          <span className="text-white/60">Tài khoản đang đăng nhập:</span>
          <span className="font-mono text-white font-bold">{staffEmail || '—'}</span>
        </div>
        <div className="flex justify-between items-center py-1.5">
          <span className="text-white/60">Vai trò:</span>
          <span className="font-mono text-amber-300 font-bold">
            {staffRole ? ROLE_LABELS[staffRole] : '—'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {(['owner', 'manager', 'sales', 'florist'] as const).map((r) => (
          <div key={r} className="p-3 rounded-xl bg-black/30 border border-white/10">
            <div className="font-mono font-bold uppercase text-amber-300">{ROLE_LABELS[r]}</div>
            <p className="text-white/65 mt-1 leading-relaxed">{ROLE_DESCRIPTIONS[r]}</p>
          </div>
        ))}
      </div>

      {!isOwner ? (
        <p className="text-xs text-white/60">Chỉ chủ hệ thống mới thêm hoặc thu hồi quyền nhân sự.</p>
      ) : (
        <>
          <form onSubmit={handleAdd} className="p-5 bg-[#141513] rounded-xl border border-white/15 space-y-4">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-300 uppercase">
              <UserPlus className="w-4 h-4" />
              <span>Thêm / cập nhật nhân sự</span>
            </div>

            {msg && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  msg.isError
                    ? 'bg-red-500/15 border-red-500/40 text-red-300'
                    : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                }`}
              >
                {msg.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
                <span>{msg.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] text-white/70 block mb-1">Email Google</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nhanvien@gmail.com"
                  className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-lg text-white font-mono focus:border-amber-400 focus:outline-none text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-white/70 block mb-1">Tên hiển thị (không bắt buộc)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-lg text-white font-mono focus:border-amber-400 focus:outline-none text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-white/70 block mb-1">Vai trò</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as StaffMember['role'])}
                  className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-lg text-white font-mono focus:border-amber-400 focus:outline-none text-xs"
                >
                  <option value="manager">{ROLE_LABELS.manager}</option>
                  <option value="sales">{ROLE_LABELS.sales}</option>
                  <option value="florist">{ROLE_LABELS.florist}</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-white/10">
              <button
                type="submit"
                disabled={busy}
                className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#141414] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{busy ? 'Đang lưu...' : 'Lưu nhân sự'}</span>
              </button>
            </div>
          </form>

          <div className="p-5 bg-[#141513] rounded-xl border border-white/15 space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-300 uppercase">
              <Users className="w-4 h-4" />
              <span>Danh sách nhân sự ({staffList.length})</span>
            </div>

            <div className="text-[11px] text-white/50 font-mono">
              Chủ hệ thống: {OWNER_EMAIL} (cố định, không thể thu hồi)
            </div>

            {staffList.length === 0 ? (
              <p className="text-xs text-white/55">Chưa có nhân sự nào. Thêm email Google của nhân viên ở biểu mẫu phía trên.</p>
            ) : (
              <ul className="divide-y divide-white/10">
                {staffList.map((m) => (
                  <li key={m.email} className="py-3 flex flex-wrap items-center gap-3 justify-between text-xs">
                    <div className="min-w-0">
                      <div className="font-mono text-white truncate">{m.email}</div>
                      <div className="text-white/55">
                        {m.displayName ? `${m.displayName} · ` : ''}
                        {ROLE_LABELS[m.role]}
                        {!m.active ? ' · Đã tạm khóa' : ''}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={m.role}
                        onChange={(e) =>
                          saveStaffMember({ ...m, role: e.target.value as StaffMember['role'] })
                        }
                        className="px-2 py-1.5 bg-black/60 border border-white/15 rounded-lg text-white font-mono text-[11px]"
                      >
                        <option value="manager">{ROLE_LABELS.manager}</option>
                        <option value="sales">{ROLE_LABELS.sales}</option>
                        <option value="florist">{ROLE_LABELS.florist}</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => saveStaffMember({ ...m, active: !m.active })}
                        className="px-2.5 py-1.5 rounded-lg border border-white/15 text-white/80 hover:text-white hover:bg-white/10 font-mono text-[11px]"
                      >
                        {m.active ? 'Khóa' : 'Mở lại'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Thu hồi quyền của ${m.email}?`)) removeStaffMember(m.email);
                        }}
                        className="p-1.5 rounded-lg border border-red-500/30 text-red-300 hover:bg-red-500/20"
                        title="Thu hồi quyền"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};
