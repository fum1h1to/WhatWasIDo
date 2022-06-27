import { IconButton, InputBase, Paper } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useDBContext } from "../../../functional/firebase/db/DBProvider";
import { Box } from "@mui/system";

const FindCalender = () => {
  const { searchUser } = useDBContext();

  // console.log(searchUser('20fi05@gmail.com'));

  const userSearchHandleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email"));
    console.log(searchUser(email));
  }

  return (
    <>
      <Paper
        component="form"
        sx={{ mx: 'auto', p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
        onSubmit={userSearchHandleSubmit}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Input User's Email"
          name="email"
        />
        <IconButton type="submit" sx={{ p: '10px' }}>
          <SearchIcon />
        </IconButton>
      </Paper>
    </>
  );
}

export default FindCalender;