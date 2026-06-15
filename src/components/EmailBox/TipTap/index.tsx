import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import {
  Box,
  IconButton,
  Tooltip,
  Divider,
  Typography,
  useTheme,
  Button as MuiButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Undo as UndoIcon,
  Redo as RedoIcon,
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  FormatColorText as ColorTextIcon,
  FormatAlignLeft as AlignLeftIcon,
  FormatAlignCenter as AlignCenterIcon,
  FormatAlignRight as AlignRightIcon,
  FormatAlignJustify as AlignJustifyIcon,
  FormatListBulleted as BulletListIcon,
  FormatListNumbered as OrderedListIcon,
  FormatQuote as QuoteIcon,
  Terminal as CodeBlockIcon,
  FormatClear as ClearIcon,
  AttachFile as AttachIcon,
  Delete as TrashIcon,
  ArrowDropDown as DropDownIcon,
  Send
} from '@mui/icons-material';
import { Button } from 'components';

interface TipTapProps {
  value?: string;
  onChange?: (value: string) => void;
  editable?: boolean;
  showFooter?: boolean;
  onSend?: () => void;
  onDiscard?: () => void;
  onAttachClick?: () => void;
  attachmentsCount?: number;
}

const TipTap = ({
  value = '',
  onChange,
  editable = true,
  showFooter = true,
  onSend,
  onDiscard,
  onAttachClick,
  attachmentsCount = 0
}: TipTapProps) => {
  const theme = useTheme();
  const [showFormatting, setShowFormatting] = useState(true);

  // Dropdown anchors
  const [fontAnchor, setFontAnchor] = useState<null | HTMLElement>(null);
  const [sizeAnchor, setSizeAnchor] = useState<null | HTMLElement>(null);
  const [alignAnchor, setAlignAnchor] = useState<null | HTMLElement>(null);

  // Selected state labels
  const [fontFamily, setFontFamily] = useState('Sans Serif');
  const [fontSizeLabel, setFontSizeLabel] = useState('Normal');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  // Sync external value
  useEffect(() => {
    if (editor && !editor.isDestroyed && editor.schema && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor || editor.isDestroyed) {
    return null;
  }

  // Active state button styling
  const getBtnStyle = (name: string, attributes?: any) => {
    const isActive = editor.isActive(name, attributes);
    return {
      color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
      backgroundColor: isActive ? theme.palette.action.selected : 'transparent',
      borderRadius: '4px',
      p: '4px',
      '&:hover': {
        backgroundColor: isActive ? theme.palette.action.selected : theme.palette.action.hover,
      },
    };
  };

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.paper,
        // boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.05)',
      }}
    >
      {/* 1. EDITOR WRITING AREA */}
      <Box
        sx={{
          flex: 1,
          '& .ProseMirror': {
            minHeight: '220px',
            maxHeight: '340px',
            overflowY: 'auto',
            padding: '20px',
            outline: 'none',
            fontSize: '15px',
            lineHeight: 1.6,
            color: theme.palette.text.primary,
            '& p': { margin: '0 0 12px 0' },
            '& h1': { fontSize: '1.8rem', fontWeight: 600, margin: '16px 0 12px 0' },
            '& h2': { fontSize: '1.5rem', fontWeight: 600, margin: '14px 0 10px 0' },
            '& h3': { fontSize: '1.25rem', fontWeight: 600, margin: '12px 0 8px 0' },
            '& ul': { paddingLeft: '24px', margin: '0 0 12px 0', listStyleType: 'disc' },
            '& ol': { paddingLeft: '24px', margin: '0 0 12px 0', listStyleType: 'decimal' },
            '& blockquote': {
              borderLeft: '4px solid',
              borderColor: theme.palette.primary.light,
              paddingLeft: '16px',
              margin: '0 0 12px 0',
              color: theme.palette.text.secondary,
              fontStyle: 'italic',
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.01)',
              py: 0.75,
              borderRadius: '0 4px 4px 0',
            },
            '& pre': {
              background: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
              color: theme.palette.mode === 'dark' ? '#d4d4d4' : '#333',
              padding: '12px',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '13px',
              margin: '0 0 12px 0',
              overflowX: 'auto',
            },
            '& code': {
              background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
              color: theme.palette.primary.main,
              padding: '2px 6px',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '13px',
            },
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>

      {/* 2. GMAIL-STYLE FORMATTING TOOLBAR */}
      {editable && showFormatting && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            p: '6px 12px',
            borderTop: '1px solid',
            borderBottom: showFooter ? '1px solid' : 'none',
            borderColor: 'divider',
            backgroundColor: theme.palette.background.paper,
            flexWrap: 'wrap',
            gap: '3px',
          }}
        >
          {/* Undo/Redo */}
          <IconButton size="small" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
            <UndoIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
            <RedoIcon fontSize="small" />
          </IconButton>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />

          {/* Font Family Dropdown */}
          <MuiButton
            size="small"
            color="secondary"
            endIcon={<DropDownIcon fontSize="small" />}
            onClick={(e) => setFontAnchor(e.currentTarget)}
            sx={{ textTransform: 'none', px: 1, color: theme.palette.text.secondary, fontWeight: 500 }}
          >
            {fontFamily}
          </MuiButton>
          <Menu anchorEl={fontAnchor} open={Boolean(fontAnchor)} onClose={() => setFontAnchor(null)}>
            {['Sans Serif', 'Serif', 'Monospace'].map((font) => (
              <MenuItem
                key={font}
                onClick={() => {
                  setFontFamily(font);
                  setFontAnchor(null);
                }}
                sx={{ fontFamily: font === 'Monospace' ? 'monospace' : font === 'Serif' ? 'serif' : 'sans-serif' }}
              >
                {font}
              </MenuItem>
            ))}
          </Menu>

          {/* Font Size (Heading levels mapped to text sizes) */}
          <MuiButton
            size="small"
            color="secondary"
            startIcon={<Typography variant="body2" sx={{ fontWeight: 700, fontSize: 13 }}>TT</Typography>}
            endIcon={<DropDownIcon fontSize="small" />}
            onClick={(e) => setSizeAnchor(e.currentTarget)}
            sx={{ textTransform: 'none', px: 1, color: theme.palette.text.secondary }}
          >
            {fontSizeLabel}
          </MuiButton>
          <Menu anchorEl={sizeAnchor} open={Boolean(sizeAnchor)} onClose={() => setSizeAnchor(null)}>
            {[
              { label: 'Nhỏ', cmd: () => editor.chain().focus().setParagraph().run() },
              { label: 'Thường', cmd: () => editor.chain().focus().setParagraph().run() },
              { label: 'Lớn', cmd: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
              { label: 'Rất lớn', cmd: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
            ].map((sz) => (
              <MenuItem
                key={sz.label}
                onClick={() => {
                  sz.cmd();
                  setFontSizeLabel(sz.label);
                  setSizeAnchor(null);
                }}
              >
                {sz.label}
              </MenuItem>
            ))}
          </Menu>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />

          {/* Styles */}
          <IconButton size="small" onClick={() => editor.chain().focus().toggleBold().run()} sx={getBtnStyle('bold')}>
            <BoldIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => editor.chain().focus().toggleItalic().run()} sx={getBtnStyle('italic')}>
            <ItalicIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => editor.chain().focus().toggleUnderline().run()} sx={getBtnStyle('underline')}>
            <UnderlineIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
            <ColorTextIcon fontSize="small" />
          </IconButton>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />

          {/* Alignment */}
          <IconButton size="small" onClick={(e) => setAlignAnchor(e.currentTarget)}>
            {editor.isActive({ textAlign: 'center' }) && <AlignCenterIcon fontSize="small" />}
            {editor.isActive({ textAlign: 'right' }) && <AlignRightIcon fontSize="small" />}
            {editor.isActive({ textAlign: 'justify' }) && <AlignJustifyIcon fontSize="small" />}
            {!editor.isActive({ textAlign: 'center' }) && !editor.isActive({ textAlign: 'right' }) && !editor.isActive({ textAlign: 'justify' }) && (
              <AlignLeftIcon fontSize="small" />
            )}
          </IconButton>
          <Menu anchorEl={alignAnchor} open={Boolean(alignAnchor)} onClose={() => setAlignAnchor(null)}>
            <MenuItem onClick={() => { editor.chain().focus().setTextAlign('left').run(); setAlignAnchor(null); }}>
              <AlignLeftIcon fontSize="small" sx={{ mr: 1 }} /> Căn lề trái
            </MenuItem>
            <MenuItem onClick={() => { editor.chain().focus().setTextAlign('center').run(); setAlignAnchor(null); }}>
              <AlignCenterIcon fontSize="small" sx={{ mr: 1 }} /> Căn giữa
            </MenuItem>
            <MenuItem onClick={() => { editor.chain().focus().setTextAlign('right').run(); setAlignAnchor(null); }}>
              <AlignRightIcon fontSize="small" sx={{ mr: 1 }} /> Căn lề phải
            </MenuItem>
            <MenuItem onClick={() => { editor.chain().focus().setTextAlign('justify').run(); setAlignAnchor(null); }}>
              <AlignJustifyIcon fontSize="small" sx={{ mr: 1 }} /> Căn đều hai bên
            </MenuItem>
          </Menu>

          {/* Lists */}
          <IconButton size="small" onClick={() => editor.chain().focus().toggleBulletList().run()} sx={getBtnStyle('bulletList')}>
            <BulletListIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => editor.chain().focus().toggleOrderedList().run()} sx={getBtnStyle('orderedList')}>
            <OrderedListIcon fontSize="small" />
          </IconButton>

          {/* Indentations */}
          {/* <IconButton size="small">
            <OutdentIcon fontSize="small" />
          </IconButton>
          <IconButton size="small">
            <IndentIcon fontSize="small" />
          </IconButton> */}

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />

          {/* Extra Options */}
          <IconButton size="small" onClick={() => editor.chain().focus().toggleBlockquote().run()} sx={getBtnStyle('blockquote')}>
            <QuoteIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => editor.chain().focus().toggleCodeBlock().run()} sx={getBtnStyle('codeBlock')}>
            <CodeBlockIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
            <ClearIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* 3. GMAIL-STYLE FOOTER ACTIONS BAR */}
      {showFooter && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 1.5,
            px: 2,
            backgroundColor: theme.palette.background.paper,
            borderTop: !showFormatting ? '1px solid' : 'none',
            borderColor: 'divider',
          }}
        >
          {/* Left: Send & Formatting Options Toggler & Attacher */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Split Send Button */}
            <Button
              variant="contained"
              color="primary"
              text="Gửi"
              startIcon={<Send fontSize="small" />}
              onClick={onSend}
            />

            {/* Aa Toggle button */}
            <Tooltip title="Tùy chọn định dạng" arrow>
              <IconButton
                size="small"
                onClick={() => setShowFormatting(!showFormatting)}
                sx={{
                  p: 1,
                  borderRadius: '50%',
                  backgroundColor: showFormatting ? (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#e8f0fe') : 'transparent',
                  color: showFormatting ? theme.palette.primary.main : theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: showFormatting ? (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : '#d2e3fc') : theme.palette.action.hover
                  }
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '14px', lineHeight: 1 }}>Aa</Typography>
              </IconButton>
            </Tooltip>

            {/* Attach File Button */}
            <Tooltip title="Đính kèm tệp" arrow>
              <IconButton
                size="small"
                onClick={onAttachClick}
                sx={{
                  p: 1,
                  borderRadius: '50%',
                  color: theme.palette.text.secondary,
                  backgroundColor: attachmentsCount > 0 ? (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#e8f0fe') : 'transparent',
                  '&:hover': { backgroundColor: theme.palette.action.hover }
                }}
              >
                <AttachIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

            {/* Inactive Gmail placeholders (styled nicely) */}
            {/* <IconButton size="small" sx={{ color: theme.palette.text.secondary }} disabled>
              <LinkIcon sx={{ fontSize: 18 }} />
            </IconButton> */}
            {/* <IconButton size="small" sx={{ color: theme.palette.text.secondary }} disabled>
              <EmojiIcon sx={{ fontSize: 18 }} />
            </IconButton> */}
            {/* <IconButton size="small" sx={{ color: theme.palette.text.secondary }} disabled>
              <DriveIcon sx={{ fontSize: 18 }} />
            </IconButton> */}
            {/* <IconButton size="small" sx={{ color: theme.palette.text.secondary }} disabled>
              <PhotoIcon sx={{ fontSize: 18 }} />
            </IconButton> */}
            {/* <IconButton size="small" sx={{ color: theme.palette.text.secondary }} disabled>
              <ConfidentialIcon sx={{ fontSize: 18 }} />
            </IconButton> */}
            {/* <IconButton size="small" sx={{ color: theme.palette.text.secondary }} disabled>
              <SignatureIcon sx={{ fontSize: 18 }} />
            </IconButton> */}
            {/* <IconButton size="small" sx={{ color: theme.palette.text.secondary }} disabled>
              <MoreIcon sx={{ fontSize: 18 }} />
            </IconButton> */}
          </Box>

          {/* Right: Trash Discard Button */}
          <Tooltip title="Hủy bản nháp" arrow>
            <IconButton
              size="small"
              onClick={onDiscard}
              sx={{
                p: 1,
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.error.main,
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(244,67,54,0.1)' : '#fce8e6'
                }
              }}
            >
              <TrashIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export default TipTap;