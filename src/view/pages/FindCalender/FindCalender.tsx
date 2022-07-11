import { AppBar, Box, Checkbox, Color, Divider, FormControlLabel, FormGroup, Grid, IconButton, InputBase, Paper, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useDBContext } from "../../../functional/firebase/db/DBProvider";
import CalenderView from './CalenderView';
import { memo, useEffect, useState } from "react";
import { AppointmentModel, Resource } from "@devexpress/dx-react-scheduler";
import { red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange } from "@mui/material/colors";
import { useAuthContext } from "../../../functional/firebase/auth/AuthProvider";

type UserData = {
  email: string;
  color: Color;
  appointData: AppointmentModel[] | undefined;
  disp: boolean;
}

// ユーザーの色を定義
const colorTypes = 	[red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange];

/**
 * FindCalenderページ
 * 検索したユーザーのスケジュールを表示する。
 */
const FindCalender = memo(() => {
  const { email } = useAuthContext()
  const { appointData, searchUser, getOtherUserAppointData } = useDBContext();

  // 次に指定するユーザーのカラータイプ
  const [ nowColorType, setNowColorType ] = useState(0);

  // 表示したいユーザーのスケジュールを保持
  const [ dispUserAppointData, setDispUserAppointData ] = useState<AppointmentModel[]>((appointData ? appointData : []));

  // 追加したユーザーのデータを保持
  const [ userDatas, setUserDatas ] = useState<UserData[]>((
    appointData ? [{email: email, color: colorTypes[nowColorType], appointData: appointData, disp: true}] : [] 
  ));

  // 追加したユーザーのメールアドレスを保持
  const [ nowUsers, setNowUsers ] = useState<String[]>((appointData ? [email] : []));

  // 表示したいスケジュールの振り分け方を保持
  const [ resources, setResources ] = useState<Resource[]>([{ 
    fieldName: 'userName', 
    title: 'User Name', 
    instances: (appointData ? [{ id: email, text: email, color: colorTypes[nowColorType]}] : []),
  }]);

  /**
   * メールアドレスからユーザーを見つけ、
   * そのユーザーのデータを必要な変数に追加。
   * @param event 
   * @returns 
   */
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
      console.error(error);
    });
  }

  /**
   * checkboxに変更があったときに、そのユーザーを表示するかどうかという変数を変更
   * 具体的には、userDataのdispをindexに応じて変更。
   * @param index 
   * @param event 
   */
  const checkBoxHandleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    let ud = Object.create(userDatas);
    ud[index].disp = event.target.checked;
    setUserDatas(ud);
  }

  /**
   * userDatasが変更されたら、
   * 実際に表示のために必要なdispUserAppointDataとresources変数を変更。
   */
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