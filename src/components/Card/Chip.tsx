import { Chip as MuiChip, useTheme, alpha } from '@mui/material';
import type { ChipProps } from '@mui/material';
import React, { memo } from 'react';
import styles from './styles';

/** Danh sách màu hợp lệ của MUI theme */
const MUI_THEME_COLORS = ['primary', 'secondary', 'success', 'error', 'warning', 'info', 'default'] as const;
type MuiThemeColor = typeof MUI_THEME_COLORS[number];

interface IStatusChipProps {
  /**
   * Màu của chip — chấp nhận cả 2 dạng:
   * - MUI theme color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'default'
   *   → Tự động lấy nền nhạt (alpha 15%) và chữ từ theme palette.
   * - Chuỗi CSS bất kỳ: hex ('#7B5EA7'), rgb, tên màu CSS ('teal', 'black'...)
   *   → Dùng alpha 15% làm nền, chính màu đó làm chữ.
   */
  color?: ChipProps['color'] | (string & {});
  title: string;
  sx?: ChipProps['sx'];
}

/**
 * Chip hiển thị nhãn trạng thái với màu nền nhạt và chữ đậm hơn cùng gam màu.
 * Tự động lấy màu từ MUI theme palette nếu truyền tên theme color.
 *
 * @example
 * <Chip color="success" title="Paid" />
 * <Chip color="error" title="Overdue" />
 * <Chip color="#7B5EA7" title="Custom" />
 */
const Chip = ({
  color,
  title,
  sx
}: IStatusChipProps) => {
  const theme = useTheme();

  // Kiểm tra xem color có phải là tên màu của MUI theme hay không
  const isThemeColor = color && MUI_THEME_COLORS.includes(color as MuiThemeColor);

  // Tính toán màu nền và màu chữ từ theme palette
  const chipColorSx = (() => {
    if (!color || color === 'default') {
      return {};
    }

    if (isThemeColor) {
      // Lấy màu từ palette theme: nền nhạt 15% opacity, chữ dark
      const paletteColor = theme.palette[color as Exclude<MuiThemeColor, 'default'>];
      return {
        backgroundColor: alpha(paletteColor.main, 0.15),
        color: paletteColor.main,
        '& .MuiChip-label': {
          color: paletteColor.main,
        },
      };
    }

    // Màu CSS tùy chỉnh: dùng trực tiếp làm nền, chữ màu trắng
    return {
      backgroundColor: alpha(color, 0.15),
      color: color,
      '& .MuiChip-label': {
        color: color,
      },
    };
  })();

  return (
    <MuiChip
      sx={{
        ...styles.chip,
        ...chipColorSx,
        ...sx,
      }}
      label={title}
      // Chỉ truyền color prop cho MUI khi đây là theme color hợp lệ
      // (để không bị lỗi TypeScript hoặc MUI warning với custom string)
      color={isThemeColor ? (color as ChipProps['color']) : 'default'}
    />
  );
};

export default memo(Chip);