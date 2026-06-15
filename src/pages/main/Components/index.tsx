import React, { useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import {
  ContainerWrapper,
  MainCard,
  ScrollIndexLayout,
  Button,
  TextField,
  NumberField,
  Chip,
  Tabs,
  Autocomplete,
} from 'components';
import Section from 'components/SideIndex/Section';
import { DateField } from 'components/DateField';
import { DateRangeField } from 'components/DateField';

// ============================================================
// DANH SÁCH SECTIONS
// ============================================================

const SECTIONS = [
  { id: 'section-button', label: 'Button' },
  { id: 'section-textfield', label: 'TextField' },
  { id: 'section-numberfield', label: 'NumberField' },
  { id: 'section-chip', label: 'Chip' },
  { id: 'section-maincard', label: 'MainCard' },
  { id: 'section-tabs', label: 'Tabs' },
  { id: 'section-datefield', label: 'DateField' },
  { id: 'section-daterangefield', label: 'DateRangeField' },
  { id: 'section-autocomplete', label: 'Autocomplete' },
  { id: 'section-actionbar', label: 'ActionBar' },
  { id: 'section-scrolllayout', label: 'ScrollIndexLayout' },
];

// ============================================================
// CODE SNIPPET HELPER
// ============================================================

const CodeBlock = ({ code }: { code: string }) => (
  <Box
    component="pre"
    sx={{
      mt: 2,
      p: 2,
      bgcolor: 'grey.900',
      color: 'grey.100',
      borderRadius: 1,
      overflow: 'auto',
      fontSize: 13,
      lineHeight: 1.6,
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      '& code': { fontFamily: 'inherit' },
    }}
  >
    <code>{code}</code>
  </Box>
);

const PropTable = ({ rows }: { rows: [string, string, string, string][] }) => (
  <Box
    component="table"
    sx={{
      mt: 2,
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 13,
      '& th, & td': {
        border: '1px solid',
        borderColor: 'divider',
        px: 1.5,
        py: 1,
        textAlign: 'left',
      },
      '& th': {
        bgcolor: 'action.hover',
        fontWeight: 600,
      },
    }}
  >
    <thead>
      <tr>
        <th>Prop</th>
        <th>Type</th>
        <th>Default</th>
        <th>Mô tả</th>
      </tr>
    </thead>
    <tbody>
      {rows.map(([prop, type, def, desc], i) => (
        <tr key={i}>
          <td><code>{prop}</code></td>
          <td><code>{type}</code></td>
          <td>{def}</td>
          <td>{desc}</td>
        </tr>
      ))}
    </tbody>
  </Box>
);

// ============================================================
// COMPONENT PAGE
// ============================================================

export default function Components() {
  const [tabDemo, setTabDemo] = useState('tab1');

  return (
    <ContainerWrapper toolbarLocalProps={{ title: 'Component Library' }}>
      <ScrollIndexLayout items={SECTIONS} stickyTop={114}>
        <Box sx={{ flex: 1, minWidth: 0 }}>

          {/* ── BUTTON ─────────────────────────── */}
          <Section id="section-button" label="Button">
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Component nút bấm tùy chỉnh mở rộng từ MUI Button. Hỗ trợ 3 variant: <code>contained</code>, <code>outlined</code>, <code>text</code>.
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>Demo</Typography>
            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }} useFlexGap>
              <Button text="Contained" variant="contained" />
              <Button text="Outlined" variant="outlined" />
              <Button text="Text" variant="text" />
              <Button text="Disabled" disabled />
              <Button text="Small" size="small" />
              <Button text="Large" size="large" />
              <Button text="Error" color="error" />
              <Button text="Success" color="success" />
            </Stack>

            <PropTable rows={[
              ['text', 'string', '""', 'Nội dung hiển thị trên nút'],
              ['variant', '"contained" | "outlined" | "text"', '"contained"', 'Kiểu hiển thị'],
              ['...props', 'ButtonProps', '—', 'Tất cả props của MUI Button'],
            ]} />

            <CodeBlock code={`import { Button } from 'components';

<Button text="Save" variant="contained" />
<Button text="Cancel" variant="outlined" />
<Button text="Delete" color="error" />`} />
          </Section>

          {/* ── TEXTFIELD ──────────────────────── */}
          <Section id="section-textfield" label="TextField">
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Input field tùy chỉnh với label, styling nhất quán theo design system. Tương thích với React Hook Form qua <code>register()</code>.
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>Demo</Typography>
            <Stack spacing={2} sx={{ maxWidth: 400 }}>
              <TextField label="Tên sản phẩm" placeholder="Nhập tên..." />
              <NumberField label="Số lượng" />
              <TextField label="Ghi chú (lỗi)" error helperText="Trường bắt buộc" />
              <TextField label="Đã tắt" disabled value="Không thể chỉnh sửa" />
            </Stack>

            <PropTable rows={[
              ['label', 'string', '—', 'Nhãn hiển thị phía trên input'],
              ['...props', 'TextFieldProps', '—', 'Tất cả props của MUI TextField'],
            ]} />

            <CodeBlock code={`import { TextField } from 'components';

<TextField label="Tên" {...register('name')} />
<TextField label="Email" type="email" required />`} />
          </Section>

          {/* ── NUMBERFIELD ────────────────────── */}
          <Section id="section-numberfield" label="NumberField">
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Component nhập số liệu chuyên nghiệp hỗ trợ tự động định dạng dấu phẩy phân tách hàng nghìn, số thập phân và chặn ký tự chữ cái. Tương thích hoàn toàn với React Hook Form.
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>Demo</Typography>
            <Stack spacing={2} sx={{ maxWidth: 400 }}>
              <NumberField label="Số lượng sản phẩm" placeholder="Nhập số lượng..." />
              <NumberField label="Đơn giá" defaultValue={1000} />
              <NumberField label="Số lượng (lỗi)" error helperText="Số lượng phải lớn hơn 0" />
            </Stack>

            <PropTable rows={[
              ['label', 'string', '—', 'Nhãn hiển thị phía trên input'],
              ['value', 'number | string', '—', 'Giá trị số hiện tại'],
              ['thousandSeparator', 'string | boolean', '","', 'Ký tự phân tách hàng nghìn'],
              ['decimalSeparator', 'string', '"."', 'Ký tự phân tách phần thập phân'],
              ['decimalScale', 'number', '2', 'Số chữ số phần thập phân tối đa'],
              ['isAbs', 'boolean', 'false', 'Chỉ cho phép số dương (không cho phép dấu âm)'],
            ]} />

            <CodeBlock code={`import { NumberField } from 'components';

<NumberField label="Số lượng" {...register('quantity')} />`} />
          </Section>

          {/* ── CHIP ───────────────────────────── */}
          <Section id="section-chip" label="Chip">
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Nhãn trạng thái với nền nhạt và chữ đậm cùng gam màu. Hỗ trợ cả MUI theme colors và CSS string tùy chỉnh.
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>Theme Colors</Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 2 }} useFlexGap>
              <Chip color="primary" title="Primary" />
              <Chip color="secondary" title="Secondary" />
              <Chip color="success" title="Paid" />
              <Chip color="error" title="Overdue" />
              <Chip color="warning" title="Pending" />
              <Chip color="info" title="Info" />
            </Stack>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>Custom CSS Colors</Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
              <Chip color="#7B5EA7" title="Purple" />
              <Chip color="#00897B" title="Teal" />
              <Chip color="#FF6F00" title="Amber" />
            </Stack>

            <PropTable rows={[
              ['color', "ChipProps['color'] | string", '"default"', 'Màu theme MUI hoặc chuỗi CSS bất kỳ'],
              ['title', 'string', '—', 'Nội dung hiển thị trên chip'],
              ['sx', 'SxProps', '—', 'Custom styles'],
            ]} />

            <CodeBlock code={`import { Chip } from 'components';

<Chip color="success" title="Paid" />
<Chip color="#7B5EA7" title="Custom Purple" />`} />
          </Section>

          {/* ── MAINCARD ──────────────────────── */}
          <Section id="section-maincard" label="MainCard">
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Component bọc nội dung tiêu chuẩn của template. Hỗ trợ tiêu đề, viền, bóng đổ và icon header.
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>Demo</Typography>
            <Stack spacing={2}>
              <MainCard title="Card có tiêu đề">
                <Typography color="text.secondary">Nội dung bên trong MainCard với tiêu đề.</Typography>
              </MainCard>
              <MainCard border>
                <Typography color="text.secondary">Card có viền, không có tiêu đề.</Typography>
              </MainCard>
            </Stack>

            <PropTable rows={[
              ['title', 'string | ReactNode', '—', 'Tiêu đề hiển thị ở header card'],
              ['border', 'boolean', 'true', 'Hiển thị viền'],
              ['boxShadow', 'boolean', '—', 'Bật/tắt bóng đổ'],
              ['contentSx', 'SxProps', '—', 'Custom styles cho phần content'],
              ['children', 'ReactNode', '—', 'Nội dung bên trong card'],
            ]} />

            <CodeBlock code={`import { MainCard } from 'components';

<MainCard title="Tiêu đề">
  <Typography>Nội dung</Typography>
</MainCard>`} />
          </Section>

          {/* ── TABS ──────────────────────────── */}
          <Section id="section-tabs" label="Tabs">
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Component tab chuyển đổi nội dung, dùng trong các trang có nhiều chế độ hiển thị.
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>Demo</Typography>
            <MainCard border sx={{ p: 0 }} contentSx={{ px: 2, py: 1, pb: '8px !important' }}>
              <Tabs
                activeTab={tabDemo}
                handleTabChange={(val) => setTabDemo(val)}
                tabs={[
                  { key: 'tab1', label: 'Tổng quan' },
                  { key: 'tab2', label: 'Chi tiết' },
                  { key: 'tab3', label: 'Cài đặt' },
                ]}
              />
            </MainCard>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography color="text.secondary">
                Tab đang chọn: <strong>{tabDemo}</strong>
              </Typography>
            </Box>

            <PropTable rows={[
              ['activeTab', 'string', '—', 'Key của tab đang active'],
              ['handleTabChange', '(key: string) => void', '—', 'Callback khi chuyển tab'],
              ['tabs', '{ key: string; label: string }[]', '—', 'Danh sách các tab'],
            ]} />

            <CodeBlock code={`import { Tabs } from 'components';

const [tab, setTab] = useState('list');

<Tabs
  activeTab={tab}
  handleTabChange={setTab}
  tabs={[
    { key: 'list', label: 'Danh sách' },
    { key: 'form', label: 'Biểu mẫu' },
  ]}
/>`} />
          </Section>

          {/* ── DATEFIELD ─────────────────────── */}
          <Section id="section-datefield" label="DateField">
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Input chọn ngày tháng tích hợp với React Hook Form. Dùng <code>{'{...register("date")}'}</code> trực tiếp.
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>Demo</Typography>
            <Stack spacing={2} sx={{ maxWidth: 400 }}>
              <DateField label="Ngày tạo" name="demo-date" onChange={() => Promise.resolve()} onBlur={() => Promise.resolve()} />
              <DateField label="Bắt buộc" required name="demo-date-required" onChange={() => Promise.resolve()} onBlur={() => Promise.resolve()} />
            </Stack>

            <PropTable rows={[
              ['label', 'string', '—', 'Nhãn hiển thị phía trên picker'],
              ['value', 'Dayjs | Date | string | null', '—', 'Giá trị hiện tại'],
              ['name', 'string', '—', 'Tên field (dùng với register)'],
              ['required', 'boolean', 'false', 'Hiển thị dấu * bắt buộc'],
            ]} />

            <CodeBlock code={`import { DateField } from 'components/DateField';

<DateField
  label="Ngày sinh"
  value={formState?.data?.birthDate}
  {...register('birthDate')}
/>`} />
          </Section>

          {/* ── DATERANGEFIELD ────────────────── */}
          <Section id="section-daterangefield" label="DateRangeField">
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Input chọn khoảng ngày (from - to). Emit <code>[Dayjs, Dayjs]</code> qua <code>event.target.value</code>.
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>Demo</Typography>
            <Box sx={{ maxWidth: 600 }}>
              <DateRangeField label="Thời gian" name="demo-range" onChange={() => Promise.resolve()} onBlur={() => Promise.resolve()} />
            </Box>

            <PropTable rows={[
              ['label', 'string', '—', 'Nhãn hiển thị'],
              ['value', '[any, any] | null', '—', 'Giá trị [from, to]'],
              ['name', 'string', '—', 'Tên field'],
            ]} />

            <CodeBlock code={`import { DateRangeField } from 'components/DateField';

<DateRangeField
  label="Khoảng thời gian"
  value={[formState?.data?.fromDate, formState?.data?.toDate]}
  {...register('fromDate', {
    onChange: (event) => {
      const [from, to] = event.target.value ?? [null, null];
      setValue('fromDate', from, { shouldDirty: true });
      setValue('toDate', to, { shouldDirty: true });
    }
  })}
/>`} />
          </Section>

          {/* ── AUTOCOMPLETE ──────────────────── */}
          <Section id="section-autocomplete" label="Autocomplete">
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Bộ chọn tìm kiếm với dropdown. Hỗ trợ single select và multiple select.
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>Demo</Typography>
            <Stack spacing={2} sx={{ maxWidth: 400 }}>
              <Autocomplete
                store={{ data: ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'], mode: 'local' }}
                label="Chọn trái cây"
              />
            </Stack>

            <CodeBlock code={`import { Autocomplete } from 'components';

<Autocomplete
  store={{ data: options, mode: 'local' }}
  label="Chọn trái cây"
  value={selected}
  onChange={(_, val) => setSelected(val)}
/>`} />
          </Section>

          {/* ── ACTIONBAR ─────────────────────── */}
          <Section id="section-actionbar" label="ActionBar">
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Thanh hành động cố định phía dưới màn hình. Chứa các nút Save, Cancel, v.v.
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>Lưu ý</Typography>
            <Box sx={{ p: 2, bgcolor: 'warning.50', border: '1px dashed', borderColor: 'warning.main', borderRadius: 1 }}>
              <Typography variant="body2" color="warning.dark">
                ⚠️ ActionBar thường được đặt ở cuối trang Form, sử dụng <code>position: sticky</code> để luôn hiển thị.
              </Typography>
            </Box>

            <CodeBlock code={`import { ActionBar } from 'components';

<ActionBar>
  <Button text="Hủy" variant="outlined" />
  <Button text="Lưu" variant="contained" />
</ActionBar>`} />
          </Section>

          {/* ── SCROLLINDEXLAYOUT ─────────────── */}
          <Section id="section-scrolllayout" label="ScrollIndexLayout">
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Layout có sidebar mục lục bên phải. Tự động highlight mục khi scroll và hỗ trợ click để nhảy đến section.
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>Đặc điểm</Typography>
            <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
              <li>Sidebar sticky, bám theo khi cuộn trang</li>
              <li>IntersectionObserver tự động highlight mục đang hiển thị</li>
              <li>Click vào mục sidebar → smooth scroll đến section tương ứng</li>
              <li>Kết hợp với <code>Section</code> component để tạo các block nội dung</li>
            </Box>

            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Trang này chính là demo!</Typography>
            <Typography color="text.secondary">
              Bạn đang xem trang được xây dựng bằng <code>ScrollIndexLayout</code>. Hãy thử cuộn hoặc click vào sidebar bên phải.
            </Typography>

            <PropTable rows={[
              ['items', 'ISectionTab[]', '—', 'Danh sách { id, label } cho sidebar'],
              ['stickyTop', 'number', '114', 'Vị trí top (px) khi sticky'],
              ['children', 'ReactNode', '—', 'Nội dung chính'],
            ]} />

            <CodeBlock code={`import { ScrollIndexLayout } from 'components';
import Section from 'components/SideIndex/Section';

const SECTIONS = [
  { id: 'section-1', label: 'Tổng quan' },
  { id: 'section-2', label: 'Chi tiết' },
];

<ScrollIndexLayout items={SECTIONS}>
  <Box sx={{ flex: 1, minWidth: 0 }}>
    <Section id="section-1" label="Tổng quan">
      <Typography>Nội dung tổng quan...</Typography>
    </Section>
    <Section id="section-2" label="Chi tiết">
      <Typography>Nội dung chi tiết...</Typography>
    </Section>
  </Box>
</ScrollIndexLayout>`} />
          </Section>

        </Box>
      </ScrollIndexLayout>
    </ContainerWrapper>
  );
}
