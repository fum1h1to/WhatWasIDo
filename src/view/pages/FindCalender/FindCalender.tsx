import { AppBar, Box, Checkbox, Color, Divider, FormControlLabel, FormGroup, Grid, IconButton, InputBase, Paper, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useDBContext } from "../../../functional/firebase/db/DBProvider";
import CalenderView from './CalenderView';
import { memo, useEffect, useState } from "react";
import { AppointmentModel, Resource } from "@devexpress/dx-react-scheduler";
import { red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange } from "@mui/material/colors";
import { useAuthContext } from "../../../functional/firebase/auth/AuthProvider";

type UserDatas = {
  email: string;
  color: Color;
  appointData: AppointmentModel[] | undefined;
  disp: boolean;
}

const colorTypes = 	[red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange];

const FindCalender = memo(() => {
  const { email } = useAuthContext()
  const { appointData, searchUser, getOtherUserAppointData } = useDBContext();

  const [ nowColorType, setNowColorType ] = useState(0);

  const [ dispUserAppointData, setDispUserAppointData ] = useState<AppointmentModel[]>((appointData ? appointData : []));
  const [ userDatas, setUserDatas ] = useState<UserDatas[]>((
  appointData ? [{email: email, color: colorTypes[nowColorType], appointData: appointData, disp: true}] : [] 
  ));
  const [ nowUsers, setNowUsers ] = useState<String[]>((appointData ? [email] : []));
  const [ resources, setResources ] = useState<Resource[]>([{ 
    fieldName: 'userName', 
    title: 'User Name', 
    instances: (appointData ? [{ id: email, text: email, color: colorTypes[nowColorType]}] : []) 
  }]);

  const userSearchHandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email"));
    const result = await searchUser(email);
    if(!result) {
      alert('ユーザーが見つかりませんでした。');
      return;
    }
    if(nowUsers.includes(email)) {
      alert('そのユーザーは既にカレンダーにあります。');
      return;
    }
    
    await getOtherUserAppointData(result.scheduleId).then((appointData) => {
      setNowUsers([...nowUsers, email]);
      setUserDatas([...userDatas, {email: email, color: colorTypes[(nowColorType + 1) % colorTypes.length], appointData: appointData, disp: true}]);
      setNowColorType((nowColorType + 1) % colorTypes.length);
      alert('ユーザーのデータを追加しました。');
    }).catch((error) => {
      alert('ユーザーが見つかりませんでした。');
      console.log(error);
    });
  }

  const checkBoxHandleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    let ud = Object.create(userDatas);
    ud[index].disp = event.target.checked;
    setUserDatas(ud);
  }

  useEffect(() => {
    let dispUserDatas: AppointmentModel[] = [];
    let reso = Object.create(resources);
    reso[0].instances = [];
    userDatas.map((item) => {
      if (item.disp && item.appointData) {
        dispUserDatas = dispUserDatas.concat(item.appointData);
        reso[0].instances = [...reso[0].instances, { id: item.email, text: item.email, color: item.color}];
      }
    });
    setDispUserAppointData(dispUserDatas);
    setResources(reso);
  }, [userDatas]);

  return (
    <>
      <Paper
        component="form"
        sx={{ mx: 'auto', mb: 4, p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
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
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <CalenderView 
            appointData={dispUserAppointData}
            resources={resources}
          />
        </Grid>
        <Grid item xs={3}>
          <AppBar
            position="sticky"
            sx={{
              borderRadius: 1,
              boxShadow: 1,
              bgcolor: 'background.paper',
              color: 'text.primary',
              top: 80
            }}
          >
            <Box>
              <Typography variant="subtitle1" sx={{p: 2}}>ユーザー</Typography>
              <Divider />
              <FormGroup sx={{p: 2}}>
                {userDatas.map((item, index) => {
                  return (
                    <FormControlLabel 
                      control={
                        <Checkbox 
                          defaultChecked 
                          sx={{
                            color: item.color[800],
                            '&.Mui-checked': {
                              color: item.color[600],
                            },
                          }}
                          onChange={(e) => checkBoxHandleChange(index, e)}
                        />
                      } 
                      label={item.email} 
                    />
                  );
                })}
              </FormGroup>
            </Box>
          </AppBar>
        </Grid>
      </Grid>
    </>
  );
});

export default FindCalender;