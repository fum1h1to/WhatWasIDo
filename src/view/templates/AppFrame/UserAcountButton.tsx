
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuthContext } from '../../../functional/firebase/auth/AuthProvider';
import { Grid } from '@mui/material';
import { memo, MouseEvent, useState } from 'react';
import UserAccountSetting from './UserAccountSetting';

/**
 * 画面右上にあるボタンについて
 */
const UserAcountButton = memo(() => {
  const { logout, email } = useAuthContext(); 

  /**
   * 画面右上にあるユーザーアイコンを押した時のダイアログ表示と非表示
   */
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * アカウント設定のモーダルを開くかどうか
   */
  const [openUserAccountSetting, setOpenUserAccountSetting] = useState(false);
  const UserAccountSettingHandleClose = () => {
    setOpenUserAccountSetting(false);
  }
  const UserAccountSettingHandleOpen = () => {
    setOpenUserAccountSetting(true);
  }

  /**
   * ユーザーをログアウトさせる。
   */
  const logoutHandleClick = async () => {
    await logout();
  }

  return (
    <>
      <Tooltip title="Account settings">
        <IconButton 
          color="inherit"
          onClick={handleClick}
          size="small"
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <AccountCircleIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Grid container alignItems="center" sx={{px: 2, py: 1}}>
          <Grid item><Avatar /></Grid>
          <Grid item>{email}</Grid>
        </Grid>
        <Divider />
        <MenuItem onClick={UserAccountSettingHandleOpen}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={logoutHandleClick}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      <UserAccountSetting
        open={openUserAccountSetting}
        onClose={UserAccountSettingHandleClose}
      />
    </>
  );
});

export default UserAcountButton;