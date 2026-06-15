# Hướng dẫn Sử dụng & Luồng Dữ liệu của EmailBox Component

Component `EmailBox` là trình soạn thảo email (Email Composer) đa chức năng, hỗ trợ hai chế độ hiển thị: cửa sổ nổi (floating window - kiểu Gmail) hoặc nhúng trực tiếp vào trang (inline). Component này tích hợp sẵn bộ kiểm tra dữ liệu đầu vào (validation), trình soạn thảo văn bản phong phú (TipTap Editor) và cơ chế đính kèm tệp tin.

---

## 1. Luồng dữ liệu (Dataflow)

Để đảm bảo hiệu năng tối ưu (không bị giật lag khi gõ phím) nhưng vẫn đồng bộ được trạng thái xem trước thời gian thực (Live Preview) chéo component, dữ liệu của `EmailBox` được vận hành theo luồng sau:

```
[Người dùng gõ phím]
         │
         ▼
 1. React Hook Form (Local State trong EmailBox)
         │
         ├───────────────────────────────────────────┐
         ▼ (subscription qua watch())                ▼ (khi bấm Gửi)
 2. Đẩy dữ liệu lên useEmail                      4. Gọi methods.handleSubmit()
         │                                           │
         ▼                                           ▼ (nếu hợp lệ)
 3. Cập nhật globalEmailCache (Map)               5. Kích hoạt onSend(id, formData)
         │                                           │
         ▼ (notifyListeners)                         ▼
   Trang Xem trước (Email Page) re-render        6. Gọi removeComposer(id) & reset form
```

### Chi tiết các bước đồng bộ:
1. **Nhập liệu cục bộ**: Khi người dùng gõ phím trong các trường `recipient`, `subject`, hoặc trình soạn thảo `TipTap`, dữ liệu được lưu trữ tạm thời trong state cục bộ của `React Hook Form` (`useForm`).
2. **Đồng bộ lên Cache**: Một subscription `watch()` được kích hoạt trong `useEffect` lắng nghe mọi thay đổi trên form và gọi hàm `updateComposer(id, { data, dirtyFields })`.
3. **Đẩy sang Module Cache**: Hàm `updateComposer` cập nhật trực tiếp thực thể lưu trong `globalEmailCache` (đối tượng `Map` ngoài Redux) và phát tín hiệu cho các listener.
4. **Cập nhật Live Preview**: Trang hiển thị chính nhận tín hiệu thay đổi qua state `tick` của hook `useEmail` và tiến hành re-render phần hiển thị xem trước email thời gian thực mà không làm ảnh hưởng đến DOM của input đang nhập liệu.
5. **Gửi thư & Dọn dẹp**: Khi người dùng ấn nút **Gửi (Send)**:
   - Trình soạn thảo gọi `methods.handleSubmit()`.
   - Nếu dữ liệu hợp lệ (nhập đúng định dạng email người nhận, có tiêu đề...), callback `onSend(id, data)` truyền từ ngoài vào sẽ được kích hoạt.
   - Gọi `removeComposer(id)` để đóng cửa sổ và xóa dữ liệu khỏi Map cache, giải phóng bộ nhớ.

---

## 2. Cách sử dụng (Usage Guide)

### 2.1 Thuộc tính (Props Interface)

```typescript
interface IEmailBoxProps {
  id: string;                          // ID duy nhất định danh cửa sổ soạn thảo
  onSend: (id: string, data: EmailFormFields) => void; // Callback khi gửi thư thành công
  onDiscard: (id: string) => void;    // Callback khi hủy bản nháp soạn thảo
  variant?: 'floating' | 'inline';     // Chế độ hiển thị (mặc định: 'floating')
}
```

### 2.2 Ví dụ mã nguồn tích hợp

#### Cách 1: Tích hợp dạng cửa sổ nổi (Floating Dock ở góc màn hình)

Thường đặt ở layout hoặc phần cuối của trang:

```tsx
import React from 'react';
import { Box } from '@mui/material';
import { EmailBox } from 'components';
import { useEmail, EmailFormFields } from 'hooks';

export default function AppLayout() {
  const { composers, removeComposer } = useEmail();

  const handleSend = (id: string, data: EmailFormFields) => {
    console.log(`Gửi email từ composer ${id}:`, data);
    removeComposer(id); // Đóng composer sau khi gửi
  };

  const handleDiscard = (id: string) => {
    removeComposer(id); // Hủy bản nháp và đóng composer
  };

  return (
    <Box>
      {/* Floating dock hiển thị các cửa sổ soạn thảo */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          right: 80,
          display: 'flex',
          flexDirection: 'row-reverse',
          gap: 2,
          zIndex: 1000,
          alignItems: 'flex-end',
          pointerEvents: 'none', // Click xuyên qua khoảng trống
          '& > *': { pointerEvents: 'auto' } // Bật click cho từng cửa sổ
        }}
      >
        {Object.values(composers)
          .filter((composer) => composer.id !== 'home-mailbox')
          .map((composer) => (
            <EmailBox
              key={composer.id}
              id={composer.id}
              onSend={handleSend}
              onDiscard={handleDiscard}
            />
          ))}
      </Box>
    </Box>
  );
}
```

#### Cách 2: Nhúng trực tiếp vào Trang (Inline Composer)

Thường dùng cho các form liên hệ, gửi phản hồi trực tiếp:

```tsx
import React from 'react';
import { EmailBox } from 'components';
import { useEmail } from 'hooks';

export default function ContactUs() {
  const { addComposer } = useEmail();
  const COMPOSER_ID = 'contact-mailbox';

  React.useEffect(() => {
    // Khởi tạo thực thể soạn thảo trong cache khi mount
    addComposer(COMPOSER_ID, {
      recipient: 'support@company.com',
      subject: 'Yêu cầu hỗ trợ',
    });
  }, [addComposer]);

  return (
    <div style={{ maxWidth: 600 }}>
      <EmailBox
        id={COMPOSER_ID}
        variant="inline"
        onSend={(id, data) => alert('Gửi phản hồi thành công!')}
        onDiscard={(id) => console.log('Hủy soạn thảo')}
      />
    </div>
  );
}
```

---

## 3. Các lưu ý quan trọng (Important Notes)

1. **Khởi tạo dữ liệu**: Bất kỳ component nào trước khi gọi `<EmailBox id={id} />` phải chắc chắn đã kích hoạt `addComposer(id)` thông qua hook `useEmail()` để đăng ký thực thể dữ liệu trong cache. Nếu không, component sẽ render ra `null`.
2. **Phân biệt `home-mailbox`**: ID `'home-mailbox'` được dành riêng làm hộp thư tĩnh ở trang chủ, nó không bao giờ được set thành composer hoạt động chính (không hiển thị viền nổi xanh hay đẩy z-index lên cao).
3. **Quy định Validation**:
   - `recipient`: Bắt buộc nhập, phải đúng cấu trúc định dạng email (`regex`).
   - `subject`: Bắt buộc nhập tiêu đề email.
   - `cc` & `bcc`: Nếu bật hiển thị và điền thông tin, bắt buộc phải đúng định dạng email.
