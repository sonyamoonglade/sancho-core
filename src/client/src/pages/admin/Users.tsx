import React from "react";

import WorkerRegister from "../../components/admin/workerRegister/WorkerRegister";
import RunnerRegister from "../../components/admin/runnerRegister/RunnerRegister";
import "../../components/admin/userRegister/user-reg.styles.scss";
import Error from "../../components/worker/error/Error";
import RunnerList from "../../components/admin/runnerList/RunnerList";
import MasterList from "../../components/admin/masterList/MasterList";
const Users = () => {
   return (
      <div className="admin_users">
         <WorkerRegister />
         <RunnerRegister />
         <MasterList />
         <RunnerList />
         <Error />
      </div>
   );
};

export default Users;
