import { useDBContext } from "../../../functional/firebase/db/DBProvider";

const FindCalender = () => {
  const { searchUser } = useDBContext();

  console.log(searchUser('20fi05@gmail.com'));

  return (
    <>

    </>
  );
}

export default FindCalender;