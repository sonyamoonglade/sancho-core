import React, { FC } from "react";
import { FoundUser } from "../../../../types/types";

interface LsUserResultContainerProps {
   result: FoundUser[];
   onSelect: (user: FoundUser) => void;
}

const LsUserResultContainer: FC<LsUserResultContainerProps> = ({ result, onSelect }) => {
   return (
      <div className={result?.length > 0 ? "livesearch_result_container user --ls-res-active" : "livesearch_result_container user"}>
         {result?.map((r) => (
            <div key={r.phoneNumber} className="ls_user_result_item" onClick={() => onSelect(r)}>
               <p>{r.username}</p>
               <p>{r.phoneNumber}</p>
            </div>
         ))}
      </div>
   );
};

export default React.memo(LsUserResultContainer);
