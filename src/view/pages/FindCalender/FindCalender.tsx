import { IconButton, InputBase, Paper } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useDBContext } from "../../../functional/firebase/db/DBProvider";
import CalenderView from './CalenderView';
import { memo, useState } from "react";
import { AppointmentModel, Resource } from "@devexpress/dx-react-scheduler";

const FindCalender = memo(() => {
  const { searchUser, getOtherUserAppointData } = useDBContext();
  const [ userAppointData, setUserAppointData ] = useState<AppointmentModel[]>([]);
  const [ nowUsers, setNowUsers ] = useState<String[]>([]);
  const [ resources, setResources ] = useState<Resource[]>([{ fieldName: 'userName', title: 'User Name', instances: [] }]);

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
      setUserAppointData([...userAppointData].concat(appointData));

      let reso = Object.create(resources);
      reso[0].instances = [...reso[0].instances, { id: email, text: email }];
      setResources(reso);

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
      <CalenderView 
        appointData={userAppointData}
        resources={resources}
      />
    </>
  );
});

export default FindCalender;