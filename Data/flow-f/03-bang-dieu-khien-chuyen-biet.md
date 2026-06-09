# 03 — Bảng điều khiển chuyên biệt

**Yêu cầu liên quan:** FR-F03, FR-F04

Lớp trình bày chi phí 3PL (Mô-đun D) và KPI nhân lực/thiết bị tại Biên Hòa (Mô-đun E).

```mermaid
stateDiagram-v2
    [*] --> ChonBangDieuKhien

    ChonBangDieuKhien --> TaiChiPhi3PL: mo_bang_3pl
    ChonBangDieuKhien --> TaiPhanCa: mo_bang_nhan_luc

    TaiChiPhi3PL --> ManHinhDoiSoat: tai_chi_phi_xong
    ManHinhDoiSoat --> DanhDauChenhLech: phat_hien_chenh_lech
    ManHinhDoiSoat --> TrangThaiThanhToan: doi_soat_ok
    DanhDauChenhLech --> TrangThaiThanhToan: da_ra_soat

    TaiPhanCa --> SuDungMHE: tai_phan_ca_xong
    SuDungMHE --> PhanBoNhanLuc: hien_thi_mhe_xong

    TrangThaiThanhToan --> [*]: bang_san_sang
    PhanBoNhanLuc --> [*]: bang_san_sang

    state "Chọn bảng điều khiển" as ChonBangDieuKhien
    state "Tải chi phí 3PL" as TaiChiPhi3PL
    state "Màn hình đối soát" as ManHinhDoiSoat
    state "Đánh dấu chênh lệch" as DanhDauChenhLech
    state "Trạng thái thanh toán" as TrangThaiThanhToan
    state "Tải phân ca" as TaiPhanCa
    state "Sử dụng MHE" as SuDungMHE
    state "Phân bổ nhân lực" as PhanBoNhanLuc
```

## Bảng trạng thái

| ID | Nhãn tiếng Việt | Phạm vi | FR |
|----|-----------------|---------|-----|
| `ChonBangDieuKhien` | Chọn bảng điều khiển | Người dùng chọn bảng chi phí 3PL hoặc nhân lực/thiết bị. | F03, F04 |
| `TaiChiPhi3PL` | Tải chi phí 3PL | Mekong và ASG-North; dữ liệu từ Mô-đun D. | F03 |
| `ManHinhDoiSoat` | Màn hình đối soát | So sánh chi phí hệ thống tính vs hóa đơn 3PL. | F03 |
| `DanhDauChenhLech` | Đánh dấu chênh lệch | Làm nổi bật sai lệch thanh toán cần rà soát. | F03 |
| `TrangThaiThanhToan` | Trạng thái thanh toán | Tóm tắt ngân sách và trạng thái chi trả. | F03 |
| `TaiPhanCa` | Tải phân ca | Kho Biên Hòa; dữ liệu phân ca từ Mô-đun E. | F04 |
| `SuDungMHE` | Sử dụng MHE | Tỷ lệ sử dụng thiết bị xếp dỡ theo ca. | F04 |
| `PhanBoNhanLuc` | Phân bổ nhân lực | Phân bổ nhân sự theo ca. | F04 |

## Ghi chú

- **FR-F03:** Không mô hình hóa lại quy trình thanh toán Mô-đun D — chỉ hiển thị kết quả đối soát.
- **FR-F04:** Chỉ áp dụng kho **Biên Hòa**; **loại trừ** KPI năng suất từng nhân viên.
