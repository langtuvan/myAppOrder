# Toast-Dialog Context Documentation

## Tổng Quan

`ToastDialogProvider` là một context cung cấp các phương thức để hiển thị modal dialogs trong ứng dụng. Nó tương tự với `ToastProvider` nhưng dành cho các modal windows thay vì notifications nhỏ.

## Cấu Trúc File

```
d:\copilot\Frontend\src\
├── contexts/
│   └── toast-dialog-context.tsx      # Provider và hooks
├── components/
│   ├── toast-dialog-container.tsx    # Container component
│   └── toast-dialog-content.tsx      # Dialog component
└── hooks/
    └── useToastDialog.ts             # Hook re-export
```

## Setup

### 1. Đã thêm vào `app/layout.tsx`:

```tsx
import { ToastDialogProvider } from "@/contexts/toast-dialog-context";
import ToastDialogContainer from "@/components/toast-dialog-container";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          <QueryProvider>
            <ToastProvider>
              <ToastDialogProvider>
                <AuthProvider>{children}</AuthProvider>
                <ToastContainer />
                <ToastDialogContainer />
              </ToastDialogProvider>
            </ToastProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## Sử Dụng Cơ Bản

### Import Hook

```tsx
"use client";
import { useToastDialog } from "@/hooks/useToastDialog";
// hoặc trực tiếp
import { useToastDialog } from "@/contexts/toast-dialog-context";
```

### Các Phương Thức

#### 1. **confirm()**

Hiển thị một dialog xác nhận với nút Cancel/Confirm.

```tsx
const { confirm } = useToastDialog();

const handleDelete = async () => {
  const result = await confirm(
    "Xác nhận xóa",
    "Bạn có chắc chắn muốn xóa mục này không?"
  );
  console.log("Result:", result); // 'cancel' hoặc 'confirm'
};
```

#### 2. **alert()**

Hiển thị một dialog thông báo đơn giản.

```tsx
const { alert } = useToastDialog();

await alert("Thông báo", "Hành động thành công!");
```

#### 3. **info()**

Hiển thị một dialog thông tin.

```tsx
const { info } = useToastDialog();

await info("Thông tin", "Đây là một thông tin quan trọng");
```

#### 4. **warning()**

Hiển thị một dialog cảnh báo.

```tsx
const { warning } = useToastDialog();

await warning("Cảnh báo", "Hãy cẩn thận với hành động này");
```

#### 5. **error()**

Hiển thị một dialog lỗi.

```tsx
const { error } = useToastDialog();

await error("Lỗi", "Có lỗi xảy ra. Vui lòng thử lại.");
```

#### 6. **showDialog()**

Hiển thị một dialog tùy chỉnh với các tùy chọn nâng cao.

```tsx
const { showDialog } = useToastDialog();

await showDialog({
  type: "confirm",
  title: "Dialog tùy chỉnh",
  message: "Bạn muốn tiếp tục?",
  size: "lg",
  closeButton: true,
  backdropClose: false,
  actions: [
    {
      id: "cancel",
      label: "Hủy bỏ",
      variant: "secondary",
      onClick: () => console.log("Cancelled"),
    },
    {
      id: "confirm",
      label: "Xác nhận",
      variant: "primary",
      onClick: async () => {
        // Xử lý logic
      },
    },
  ],
});
```

## Các Tùy Chọn Chi Tiết

### DialogAction Interface

```tsx
interface DialogAction {
  id: string; // ID duy nhất cho action
  label: string; // Text hiển thị trên nút
  onClick: () => void | Promise<void>; // Callback khi click
  variant?: "default" | "primary" | "danger" | "secondary";
  disabled?: boolean; // Vô hiệu hóa nút
  loading?: boolean; // Hiển thị loading state
}
```

### ToastDialog Options

```tsx
interface ToastDialog {
  type: "confirm" | "alert" | "info" | "warning" | "error";
  title: string; // Tiêu đề dialog
  message?: string; // Nội dung chính
  description?: string; // Mô tả thêm
  actions?: DialogAction[]; // Các nút hành động
  size?: "sm" | "md" | "lg" | "xl"; // Kích thước (mặc định: md)
  closeButton?: boolean; // Hiển thị nút close (mặc định: true)
  backdropClose?: boolean; // Cho phép click backdrop để đóng (mặc định: true)
  duration?: number | null; // Auto close sau ms (mặc định: null)
}
```

## Ví Dụ Thực Tế

### 1. Dialog Xác Nhận Xóa

```tsx
"use client";
import { useToastDialog } from "@/hooks/useToastDialog";
import { useState } from "react";

export function DeleteButton({ itemId }) {
  const { confirm, error, info } = useToastDialog();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const result = await confirm(
      "Xóa mục",
      "Hành động này không thể hoàn tác. Bạn có chắc chắn?",
      {
        actions: [
          {
            id: "cancel",
            label: "Hủy",
            variant: "secondary",
            onClick: () => {},
          },
          {
            id: "delete",
            label: "Xóa",
            variant: "danger",
            onClick: async () => {
              try {
                setLoading(true);
                // Call API
                await deleteItem(itemId);
                await info("Thành công", "Mục đã được xóa");
              } catch (err) {
                await error("Lỗi", "Không thể xóa mục");
              } finally {
                setLoading(false);
              }
            },
          },
        ],
      }
    );
  };

  return (
    <button onClick={handleDelete} disabled={loading}>
      Xóa
    </button>
  );
}
```

### 2. Dialog Với Multiple Actions

```tsx
const { showDialog } = useToastDialog();

await showDialog({
  type: "confirm",
  title: "Lưu Thay Đổi",
  message: "Bạn có những thay đổi chưa được lưu",
  actions: [
    {
      id: "discard",
      label: "Bỏ qua",
      variant: "danger",
      onClick: () => {
        // Discard changes
      },
    },
    {
      id: "cancel",
      label: "Tiếp tục chỉnh sửa",
      variant: "secondary",
      onClick: () => {},
    },
    {
      id: "save",
      label: "Lưu",
      variant: "primary",
      onClick: async () => {
        // Save changes
      },
    },
  ],
});
```

### 3. Dialog Auto-Close

```tsx
const { showDialog } = useToastDialog();

await showDialog({
  type: "info",
  title: "Tải lên thành công",
  message: "Tệp của bạn đã được tải lên",
  duration: 3000, // Tự động đóng sau 3 giây
  actions: [
    {
      id: "ok",
      label: "OK",
      onClick: () => {},
    },
  ],
});
```

## Styling

Dialog được thiết kế với:

- **Colors**: Tailwind CSS colors với theme dark/light
- **Animations**: Smooth transitions và scale effects
- **Icons**: SVG icons cho mỗi dialog type
- **Responsive**: Responsive design cho mobile/tablet/desktop

### Các Kiểu Dialog Type

| Type    | Màu    | Icon             |
| ------- | ------ | ---------------- |
| confirm | Blue   | Question mark    |
| alert   | Yellow | Alert            |
| info    | Blue   | Information      |
| warning | Yellow | Warning triangle |
| error   | Red    | X circle         |

## Context Methods

```tsx
interface ToastDialogContextType {
  dialogs: ToastDialog[]; // Danh sách dialogs hiện tại
  showDialog: (dialog: Omit<ToastDialog, "id">) => Promise<string>;
  removeDialog: (id: string) => void; // Xóa dialog
  updateDialog: (id: string, updates: Partial<ToastDialog>) => void; // Cập nhật
  confirm: (title, message?, options?) => Promise<string>;
  alert: (title, message?, options?) => Promise<string>;
  info: (title, message?, options?) => Promise<string>;
  warning: (title, message?, options?) => Promise<string>;
  error: (title, message?, options?) => Promise<string>;
}
```

## Best Practices

1. **Luôn sử dụng `'use client'`** directive ở đầu file component
2. **Xử lý errors** trong action callbacks
3. **Dùng variants phù hợp**: danger cho delete, primary cho confirm
4. **Giữ messages ngắn gọn** để dễ đọc
5. **Await actions** để có thể xử lý kết quả
6. **Tránh nested dialogs** - chỉ hiển thị 1 dialog cùng lúc

## Troubleshooting

### Dialog không hiển thị

- Kiểm tra `ToastDialogProvider` đã được thêm vào `layout.tsx`
- Kiểm tra `ToastDialogContainer` đã được render
- Kiểm tra file component có `'use client'` directive

### Actions không gọi được

- Kiểm tra `onClick` callback đã được định nghĩa
- Kiểm tra syntax của action object

### Styling không đúng

- Clear browser cache
- Kiểm tra Tailwind CSS config
- Kiểm tra dark mode settings

## Liên Kết Tham Khảo

- Toast Context: `@/contexts/toast-context.tsx`
- Toast Provider: `@/providers/`
- Components: `@/components/toast-dialog-*`
