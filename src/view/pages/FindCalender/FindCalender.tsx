import { Box, Button, Checkbox, Color, Divider, FormControlLabel, FormGroup, Grid, IconButton, InputBase, Paper, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useDBContext } from "../../../functional/firebase/db/DBProvider";
import CalenderView from './CalenderView';
import { memo, useState } from "react";
import { AppointmentModel, Resource, ResourceInstance } from "@devexpress/dx-react-scheduler";
import { red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange } from "@mui/material/colors";
import { useAuthContext } from "../../../functional/firebase/auth/AuthProvider";

type UserDatas = {
  email: string;
  color: Color;
  appointData: AppointmentModel[] | undefined;
  disp: boolean;
}

const colorTypes = 	[red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange]

const FindCalender = memo(() => {
  const { email } = useAuthContext()
  const { appointData, searchUser, getOtherUserAppointData } = useDBContext();

  const [ nowColorType, setNowColorType ] = useState(0);
  const updateNowColorType = () => {
    setNowColorType((nowColorType + 1) % colorTypes.length);
  };

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

      setDispUserAppointData([...dispUserAppointData].concat(appointData));

      let reso = Object.create(resources);
      reso[0].instances = [...reso[0].instances, { id: email, text: email, color: colorTypes[nowColorType + 1]}];
      setResources(reso);

      setNowUsers([...nowUsers, email]);
      setUserDatas([...userDatas, {email: email, color: colorTypes[nowColorType + 1], appointData: appointData, disp: true}]);
      setNowColorType((nowColorType + 1) % colorTypes.length);
      alert('ユーザーのデータを追加しました。');
    }).catch((error) => {
      alert('ユーザーが見つかりませんでした。');
      console.log(error);
    });
  }

  

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
          <Box sx={{
            borderRadius: 1,boxShadow: 1, bgcolor: 'background.paper'
          }}>
            <Typography variant="subtitle1" sx={{p: 2}}>ユーザー</Typography>
            <Divider />
            <FormGroup sx={{p: 2}}>
              {userDatas.map((item) => {
                return (
                  <FormControlLabel 
                    control={<Checkbox defaultChecked sx={{
                      color: item.color[800],
                      '&.Mui-checked': {
                        color: item.color[600],
                      },
                    }} />} 
                    label={item.email} 
                  />
                );
              })}
            </FormGroup>
          </Box>
        </Grid>
      </Grid>
    </>
  );
});

export default FindCalender;