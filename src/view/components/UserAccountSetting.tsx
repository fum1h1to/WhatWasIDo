import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, IconButton, Modal, Typography } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import { useAuthContext } from "../../firebase/auth/AuthProvider";
import { useState } from "react";

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
  const { deleteAccount } = useAuthContext();

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
        <Divider sx={{my: 1}}/>
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