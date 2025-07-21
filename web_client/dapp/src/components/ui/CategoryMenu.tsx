"use client"
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import SearchIcon from '@mui/icons-material/Search';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const sapphireMain = '#0ea5e9';
const sapphireDark = '#0284c7';
const sapphireLight = '#38bdf8';
const sapphireGrey = '#1e293b';

const muiTheme = createTheme({
  palette: {
    primary: {
      main: sapphireMain,
      dark: sapphireDark,
      light: sapphireLight,
      contrastText: '#fff',
    },
    background: {
      paper: sapphireGrey,
      default: '#0f172a',
    },
    text: {
      primary: '#fff',
      secondary: '#bae6fd',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

const categories = [
  { key: 'all', icon: 'fas fa-th-large', name: '全部商品', count: 198, active: true },
  { key: 'course', icon: 'fas fa-graduation-cap', name: '在线课程', count: 15 },
  { key: 'art', icon: 'fas fa-palette', name: '数字艺术', count: 22 },
  { key: 'dev', icon: 'fas fa-code', name: '开发工具', count: 18 },
  { key: 'game', icon: 'fas fa-gamepad', name: '游戏道具', count: 35 },
  { key: 'data', icon: 'fas fa-chart-line', name: '数据分析', count: 12 },
  { key: 'vr', icon: 'fas fa-vr-cardboard', name: '虚拟现实', count: 28 },
  { key: 'meta', icon: 'fas fa-globe', name: '元宇宙', count: 45 },
  { key: 'social', icon: 'fas fa-users', name: 'Web3社交', count: 31, dropdown: [ '社交应用', 'DAO治理', '社区代币', '去中心化身份' ] },
  { key: 'defi', icon: 'fas fa-coins', name: 'DeFi协议', count: 67 },
  { key: 'nft', icon: 'fas fa-image', name: 'NFT市场', count: 89 },
  { key: 'wallet', icon: 'fas fa-wallet', name: '加密钱包', count: 24 },
  { key: 'infra', icon: 'fas fa-network-wired', name: '区块链基础设施', count: 19 },
];

export const CategoryMenu: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  return (
    <ThemeProvider theme={muiTheme}>
      <Paper elevation={3} sx={{ borderRadius: 3, p: 3, mb: 3, bgcolor: 'background.paper' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} flexWrap="wrap" gap={2}>
          <Box fontWeight={600} color="text.secondary" fontSize={15} minWidth={68} height={36} display="flex" alignItems="center">
            商品目录
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <TextField
              size="small"
              variant="outlined"
              placeholder="搜索商品..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ minWidth: 220, bgcolor: 'background.default', borderRadius: 2, input: { color: '#fff' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
                sx: { fontSize: 14, py: 0.5, color: '#fff' }
              }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ borderRadius: 2, fontWeight: 600, fontSize: 14, px: 2.5, py: 1, boxShadow: 'none', textTransform: 'none', whiteSpace: 'nowrap', bgcolor: sapphireMain, '&:hover': { bgcolor: sapphireDark } }}
            >
              筛选商品
            </Button>
          </Box>
        </Box>
        <Box display="flex" flexWrap="wrap" gap={1.5}>
          {categories.map(cat => (
            <Box key={cat.key} position="relative">
              <Button
                variant={cat.active ? 'contained' : 'outlined'}
                color={cat.active ? 'primary' : 'inherit'}
                sx={{
                  px: 2.5,
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 500,
                  fontSize: 13,
                  bgcolor: cat.active ? sapphireMain : sapphireGrey,
                  color: cat.active ? '#fff' : '#bae6fd',
                  boxShadow: cat.active ? 2 : 0,
                  borderColor: sapphireMain,
                  '&:hover': { bgcolor: cat.active ? sapphireDark : '#334155', color: '#fff' },
                  minWidth: 0
                }}
                startIcon={<i className={`${cat.icon}`} style={{ fontSize: 14, color: cat.active ? '#fff' : sapphireMain }} />}
                onClick={() => cat.dropdown ? setOpenDropdown(openDropdown === cat.key ? null : cat.key) : setOpenDropdown(null)}
                onMouseEnter={() => cat.dropdown && setOpenDropdown(cat.key)}
                onMouseLeave={() => cat.dropdown && setOpenDropdown(null)}
              >
                {cat.name}
                <Box ml={1} px={1} borderRadius={1} fontSize={11} bgcolor={cat.active ? sapphireDark : '#334155'} color={cat.active ? '#fff' : '#bae6fd'} display="inline-block">{cat.count}</Box>
                {cat.dropdown && <i className="fas fa-chevron-down ml-2 text-xs" />}
              </Button>
              {cat.dropdown && openDropdown === cat.key && (
                <Box position="absolute" left={0} top={38} minWidth={120} bgcolor={sapphireGrey} borderRadius={2} boxShadow={3} zIndex={20} py={1} onMouseEnter={() => setOpenDropdown(cat.key)} onMouseLeave={() => setOpenDropdown(null)}>
                  {cat.dropdown.map((item, idx) => (
                    <Box key={idx} px={2} py={1} color="#fff" fontSize={13} sx={{ cursor: 'pointer', '&:hover': { bgcolor: sapphireMain, color: '#fff' } }}>{item}</Box>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Paper>
    </ThemeProvider>
  );
};
