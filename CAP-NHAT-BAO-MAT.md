# Cập nhật bảo mật & phân quyền

## Đã thay đổi
- Bỏ mật khẩu admin (trước đây mặc định `juetsaigon2026`, nằm trong code công khai và lưu trong Firestore).
- Đăng nhập admin bằng Google (Firebase Auth). Chủ hệ thống: nhatduy.halo@gmail.com (ghi cứng trong firestore.rules).
- Nhân sự lưu trong collection `staff` (ID = email viết thường), vai trò: manager, sales, florist.
- Trang admin có tab "Nhân Sự & Bảo Mật" để chủ hệ thống thêm/khóa/thu hồi nhân sự.
- Đơn hàng, đăng ký workshop, vật tư, nhân sự chỉ tải về khi đã đăng nhập đúng vai trò.
- Không còn lưu đơn hàng khách trong localStorage của trình duyệt.
- Các thao tác tự ghi dữ liệu (seed, đồng bộ) chỉ chạy khi owner/manager đăng nhập.

## Việc cần làm trên Firebase Console (project saigon-hoa)
1. Authentication > Sign-in method: bật **Google**.
2. Authentication > Settings > Authorized domains: thêm
   `juet-saigon.vercel.app` và `saigon-flower-eta.vercel.app`.
3. Firestore > Rules: dán nội dung `firestore.rules`, thử trong Rules Playground, rồi Publish.
4. Xóa tài liệu `settings/security` (chứa mật khẩu cũ).

## Sau khi deploy
- Đăng nhập bằng Gmail chủ hệ thống, vào tab "Nhân Sự & Bảo Mật" để thêm nhân viên.
- Nhân viên đăng nhập bằng đúng email Google đã được thêm.

## Lưu ý
- `scripts/seed-firestore.ts` ghi dữ liệu không đăng nhập nên sẽ bị rules từ chối. Dữ liệu mẫu đã có sẵn; nếu cần seed lại, đăng nhập owner trong app (nút đồng bộ).
- Khách không tra cứu lại đơn của mình được (đơn chứa số điện thoại nên không công khai).
