import React from "react";

import WorkerRegister from "../../components/admin/workerRegister/WorkerRegister";
import RunnerRegister from "../../components/admin/runnerRegister/RunnerRegister";
import "../../components/admin/userRegister/user-reg.styles.scss";
const Users = () => {
   return (
      <div className="admin_users">
         <WorkerRegister />
         <RunnerRegister />
      </div>
   );
};

export default Users;
