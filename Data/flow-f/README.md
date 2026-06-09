# Mô-đun F — Biểu đồ Mermaid tiếng Việt

Thư mục này chứa **biểu đồ trạng thái Mermaid bằng tiếng Việt** cho **Mô-đun F — Báo cáo & Bảng điều khiển KPI**, bổ sung cho phiên bản tiếng Anh tại [../index.html](../index.html).

**Nguồn đối chiếu:** [Module_F_State_Machines.md](../../Module_F_State_Machines.md), [WMS_Module_F_SRS.md](../../WMS_Module_F_SRS.md)

---

## Danh sách biểu đồ

| File | Tiêu đề | FR |
|------|---------|-----|
| [00-tong-quan-module-f.md](./00-tong-quan-module-f.md) | Tổng quan Mô-đun F | F01–F07 |
| [01-bang-dieu-khien-thoi-gian-thuc.md](./01-bang-dieu-khien-thoi-gian-thuc.md) | Bảng điều khiển thời gian thực | F01, F07 |
| [02-bao-cao-dinh-ky.md](./02-bao-cao-dinh-ky.md) | Báo cáo vận hành & quản trị định kỳ | F02, F06, INT-12 |
| [03-bang-dieu-khien-chuyen-biet.md](./03-bang-dieu-khien-chuyen-biet.md) | Bảng 3PL và nhân lực/thiết bị | F03, F04 |
| [04-trinh-tao-bao-cao-xuat.md](./04-trinh-tao-bao-cao-xuat.md) | Trình tạo báo cáo & xuất dữ liệu | F05–F07 |

---

## Chú giải

| Ký hiệu | Ý nghĩa |
|---------|---------|
| `[*]` | Trạng thái ban đầu hoặc kết thúc |
| `nhan_su_kien` | Nhãn sự kiện trên mũi tên chuyển trạng thái |
| `state X { ... }` | Trạng thái tổng hợp (trạng thái con lồng nhau) |
| **INT-12** | Tích hợp WMS → Email/MS Teams cho báo cáo định kỳ |

---

## Ánh xạ yêu cầu chức năng (FR)

| ID | Tóm tắt | Biểu đồ |
|----|---------|---------|
| **F01** | Bảng điều khiển KPI thời gian thực | 00, 01 |
| **F02** | Báo cáo tự động hàng ngày/tuần | 00, 02 |
| **F03** | Bảng chi phí 3PL (Mekong, ASG-North) | 03 |
| **F04** | KPI nhân lực & MHE (Biên Hòa) | 03 |
| **F05** | Trình tạo báo cáo kéo-thả | 04 |
| **F06** | Xuất Excel/PDF | 02, 04 |
| **F07** | Giao diện responsive (máy tính bảng) | 01, 04 |
| **INT-12** | Gửi email báo cáo | 02 |

---

## Bảng thuật ngữ (English → Tiếng Việt)

### Trạng thái — Tổng quan (00)

| English | ID tiếng Việt | Nhãn hiển thị |
|---------|---------------|---------------|
| DataSourcesReady | NguonDuLieuSanSang | Nguồn dữ liệu sẵn sàng |
| AnalyticsHub | TrungTamPhanTich | Trung tâm phân tích |
| RealTimePath | LuongThoiGianThuc | Luồng thời gian thực |
| ScheduledReportPath | LuongBaoCaoDinhKy | Luồng báo cáo định kỳ |
| AdHocReportPath | LuongBaoCaoTuyChinh | Luồng báo cáo tùy chỉnh |
| PublishedOutput | KetQuaDaXuatBan | Kết quả đã xuất bản |

### Trạng thái — Thời gian thực (01)

| English | ID tiếng Việt | Nhãn hiển thị |
|---------|---------------|---------------|
| Idle | Cho | Chờ |
| IngestEvents | ThuNhanSuKien | Thu nhận sự kiện |
| AggregateKPIs | TongHopKPI | Tổng hợp KPI |
| PublishSignalR | DaySignalR | Đẩy SignalR |
| LiveDashboard | BangDieuKhienTrucTiep | Bảng điều khiển trực tiếp |
| KPIsDisplayed | KPIDangHienThi | KPI đang hiển thị |
| StaleDataAlert | CanhBaoDuLieuCu | Cảnh báo dữ liệu cũ |

### Trạng thái — Báo cáo định kỳ (02)

| English | ID tiếng Việt | Nhãn hiển thị |
|---------|---------------|---------------|
| ScheduleIdle | ChoLich | Chờ lịch |
| DailyTrigger | KichHoatHangNgay | Kích hoạt hàng ngày |
| WeeklyTrigger | KichHoatHangTuan | Kích hoạt hàng tuần |
| CompileOperational | BienSoanVanHanh | Biên soạn vận hành |
| CompileManagement | BienSoanQuanTri | Biên soạn quản trị |
| RenderAttachment | TaoFileDinhKem | Tạo file đính kèm |
| DispatchEmail | GuiEmail | Gửi email |
| DeliveryConfirmed | XacNhanGiao | Xác nhận giao |

### Trạng thái — Bảng chuyên biệt (03)

| English | ID tiếng Việt | Nhãn hiển thị |
|---------|---------------|---------------|
| SelectDashboard | ChonBangDieuKhien | Chọn bảng điều khiển |
| Load3PLCosts | TaiChiPhi3PL | Tải chi phí 3PL |
| ReconcileView | ManHinhDoiSoat | Màn hình đối soát |
| HighlightDiscrepancy | DanhDauChenhLech | Đánh dấu chênh lệch |
| PaymentStatusDisplay | TrangThaiThanhToan | Trạng thái thanh toán |
| LoadShiftRoster | TaiPhanCa | Tải phân ca |
| MHEUtilizationView | SuDungMHE | Sử dụng MHE |
| WorkforceAllocationView | PhanBoNhanLuc | Phân bổ nhân lực |

### Trạng thái — Trình tạo báo cáo (04)

| English | ID tiếng Việt | Nhãn hiển thị |
|---------|---------------|---------------|
| BuilderIdle | ChoTrinhTao | Chờ trình tạo |
| SelectFields | ChonTruongDuLieu | Chọn trường dữ liệu |
| PreviewReport | XemTruocBaoCao | Xem trước báo cáo |
| ExportExcel | XuatExcel | Xuất Excel |
| ExportPDF | XuatPDF | Xuất PDF |
| SaveTemplate | LuuMau | Lưu mẫu |
| ExportComplete | HoanTatXuat | Hoàn tất xuất |

---

## Cách xem biểu đồ

1. Mở file `.md` trong VS Code/Cursor và bật **Markdown Preview** (hỗ trợ Mermaid nếu đã cấu hình), hoặc
2. Sao chép khối ` ```mermaid ` vào [Mermaid Live Editor](https://mermaid.live), hoặc
3. Chạy `npx serve docs` và dùng tiện ích xem markdown có render Mermaid.

---

## Quy ước kỹ thuật

- ID trạng thái: ASCII, không dấu, PascalCase tiếng Việt (ví dụ `TongHopKPI`).
- Nhãn hiển thị: tiếng Việt có dấu qua cú pháp `state "..." as ID`.
- Thuật ngữ giữ nguyên khi phổ biến: SignalR, SAP, INT-12, Excel, PDF, FEFO, 3PL, MHE, Blazor.
