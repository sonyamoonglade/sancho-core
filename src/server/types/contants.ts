import { AppRoles } from "../../common/types";

export const APP_ROLES: string[] = [];
for (const [_, role] of Object.entries(AppRoles)) {
   APP_ROLES.push(role);
}
