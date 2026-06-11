import { Box, Stack, Typography } from '@mui/material';
import Icons, { IconName } from 'assets/Icon';
import { ContainerWrapper, MainCard, DataTable, TextField, Autocomplete, Button, SideIndex, ScrollIndexLayout, Tabs } from 'components';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EGridColTypes, IGridColDef } from 'types/components/grid';
import { useInvoice } from 'hooks/useInvoice';
import { useSnackbar } from 'hooks/useSnackbar';
import { EFormMode, DataTableMode, DataTableVariant } from 'types';
import Section from 'components/SideIndex/Section';

const SECTIONS = [
  { id: "section-1", label: "Tổng quan" },
  { id: "section-2", label: "Thông tin chi tiết" },
  { id: "section-3", label: "Thống kê" },
  { id: "section-4", label: "Lịch sử" },
  { id: "section-5", label: "Cài đặt" },
];

export default function Purchase() {
  const [tabValue, setTabValue] = useState('list');
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const isScrollingRef = useRef(false); // tránh loop khi click
  const timerRef = useRef<any>(null);

  // Scroll đến section khi click tab
  const handleSelect = useCallback((id) => {
    isScrollingRef.current = true;
    setActiveId(id);

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Sau khi scroll xong (~600ms) mới để IntersectionObserver tiếp quản
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 700);
  }, []);

  // IntersectionObserver: tự động highlight tab khi scroll tay
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isScrollingRef.current) {
            setActiveId(id);
          }
        },
        { threshold: 0.4 }
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);
  return (
    <ContainerWrapper
      toolbarLocalProps={{
        title: 'Invoice Management',
      }}
    >
      <MainCard border sx={{ p: 0, position: 'sticky', top: 114, mb: 3 }} contentSx={{ px: 2, py: 1, pb: '8px !important' }}>
        <Tabs
          activeTab={tabValue}
          handleTabChange={(val) => setTabValue(val)}
          tabs={[
            { key: 'list', label: 'Danh Sách Hóa Đơn' },
            { key: 'guide', label: 'Cài Đặt & Hướng Dẫn' }
          ]}
        />

      </MainCard>
      {tabValue === 'list' && (
        <MainCard>
          <Typography variant="h5" sx={{ mb: 2 }}>Danh Sách Hóa Đơn</Typography>
          <Typography color="text.secondary">
            Bảng danh sách hóa đơn và các bộ lọc tìm kiếm sẽ được hiển thị ở đây.
          </Typography>
        </MainCard>
      )}

      {tabValue === 'guide' && (
        <ScrollIndexLayout
          items={SECTIONS}
          stickyTop={114 + 86}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Section id="section-1" label="Tổng quan">
              <Typography color="text.secondary" sx={{ mb: 1 }}>
                Đây là phần giới thiệu tổng quan về dự án hoặc trang hiện tại.
              </Typography>
              <Typography color="text.secondary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
              </Typography>
            </Section>

            <Section id="section-2" label="Thông tin chi tiết">
              <Typography color="text.secondary" sx={{ mb: 1 }}>
                Nội dung chi tiết được trình bày ở đây, bao gồm các thông số kỹ thuật và mô tả đầy đủ.
              </Typography>
              <Typography color="text.secondary">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
              </Typography>
              <Box sx={{ mt: 2, p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  📌 Ghi chú: Thêm nội dung thực tế của bạn vào đây.
                </Typography>
              </Box>
            </Section>

            <Section id="section-3" label="Thống kê">
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
                {["1,234", "98%", "42ms"].map((val, i) => (
                  <Box key={i} sx={{ p: 2, bgcolor: "primary.50", borderRadius: 2, textAlign: "center" }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "primary.main" }}>{val}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {["Tổng số", "Độ chính xác", "Thời gian"][i]}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Section>

            <Section id="section-4" label="Lịch sử">
              <Typography color="text.secondary" sx={{ mb: 1 }}>
                Danh sách các thay đổi và sự kiện theo thứ tự thời gian.
              </Typography>
              {["Cập nhật v2.1", "Phát hành v2.0", "Ra mắt beta"].map((item, i) => (
                <Box key={i} sx={{ display: "flex", gap: 2, alignItems: "center", py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 90 }}>
                    {["15/06/2025", "01/05/2025", "10/03/2025"][i]}
                  </Typography>
                  <Typography variant="body2">{item}</Typography>
                </Box>
              ))}
            </Section>

            <Section id="section-5" label="Cài đặt">
              <Typography color="text.secondary">
                Các tùy chọn cấu hình và thiết lập cho hệ thống.
              </Typography>
              <Box sx={{ mt: 2, p: 2, border: "1px dashed", borderColor: "warning.main", borderRadius: 2, bgcolor: "warning.50" }}>
                <Typography variant="body2" color="warning.dark">
                  ⚠️ Thay đổi cài đặt có thể ảnh hưởng đến toàn bộ hệ thống.
                </Typography>
              </Box>
            </Section>
          </Box>
        </ScrollIndexLayout>
      )}
    </ContainerWrapper>
  );
}
