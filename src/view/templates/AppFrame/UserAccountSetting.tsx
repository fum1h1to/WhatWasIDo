import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, IconButton, Modal, Stack, Switch, ToggleButton, ToggleButtonGroup, Typography, useTheme } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import { useAuthContext } from "../../../functional/firebase/auth/AuthProvider";
import { MouseEvent, useState } from "react";
import { useThemeContext } from "../AppRouter";
import { useDBContext } from "../../../functional/firebase/db/DBProvider";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '30vw',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
}

export default function UserAccountSetting(props: {
  open: boolean,
  onClose: () => void,
}) {
  const { deleteAccount, scheduleId } = useAuthContext();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const deleteDialogHandleOpen = () => {
    setOpenDeleteDialog(true);
  }
  const deleteDialogHandleClose = () => {
    setOpenDeleteDialog(false);
  }
  const okDelete = () => {
    deleteAccount();
  }

  const { colorMode, setColorMode } = useThemeContext();
  const colorModehandleChange = (
    event: MouseEvent<HTMLElement>,
    colorMode: "dark" | "light",
  ) => {
    setColorMode(colorMode);
  }

  const { sharing, updateSharing } = useDBContext();
  const sharinghandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateSharing(scheduleId, event.target.checked);
  }

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
    >
      <Box sx={style}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h6" component="div" gutterBottom>
              アカウント設定
            </Typography>
          </Grid>
          <Grid item>
            <IconButton size="medium" onClick={props.onClose}>
              <ClearIcon />
            </IconButton>
          </Grid>
        </Grid>

        <Divider sx={{mt: 1, mb: 4}}/>

        <Typography variant="subtitle1" gutterBottom component="div">
          テーマの変更
        </Typography>
        <ToggleButtonGroup
          exclusive
          value={colorMode}
          onChange={colorModehandleChange}
        >
          <ToggleButton value="light">ライトモード</ToggleButton>
          <ToggleButton value="dark">ダークモード</ToggleButton>
        </ToggleButtonGroup>

        <Divider sx={{my: 4}}/>

        <Typography variant="subtitle1" gutterBottom component="div">
          データの共有
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography>しない</Typography>
          <Switch
            checked={sharing}
            onChange={sharinghandleChange}
            inputProps={{ 'aria-label': 'controlled' }}
          />
          <Typography>する</Typography>
        </Stack>

        <Divider sx={{my: 4}}/>

        <Typography variant="subtitle1" gutterBottom component="div">
          アカウントを削除する
        </Typography>
        <Typography variant="caption" gutterBottom>
          これを行うと、全てのデータが直ちに削除されます。これを元に戻すことはできません。
        </Typography>
        <Button variant="outlined" sx={{mt: 1}} color="error" onClick={deleteDialogHandleOpen}>
          アカウントを削除する
        </Button>
        <Dialog
          open={openDeleteDialog}
          onClose={deleteDialogHandleClose}
        >
          <DialogTitle color="error">
          {"本当に削除しますか？"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            この操作は元に戻せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteDialogHandleClose} autoFocus>Disagree</Button>
          <Button onClick={okDelete} color="error">
            Agree
          </Button>
        </DialogActions>
        </Dialog>
      </Box>
    </Modal>
  )
}