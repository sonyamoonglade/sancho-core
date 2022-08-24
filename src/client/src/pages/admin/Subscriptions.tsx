import React from "react";
import SubscriptionsTable from "../../components/admin/subcriptionsTable/SubscriptionsTable";
import Error from "../../components/worker/error/Error";
import CreateSubscriberModal from "../../components/admin/createSubscriberModal/CreateSubscriberModal";

const Subscriptions = () => {
   return (
      <div className="admin_subscriptions">
         <SubscriptionsTable />
         <CreateSubscriberModal />
         <Error />
      </div>
   );
};

export default Subscriptions;
