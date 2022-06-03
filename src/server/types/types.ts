import {AppRoles} from "../../common/types";

export const IMAGE_UPLOAD_FILENAME = 'product_image'

export const APP_ROLES:string[] = []

export enum CookieNames {
    SID = "SID",
    cancelBan = "cancel_ban"
}

for(const [_,role] of Object.entries(AppRoles)){
    APP_ROLES.push(role)
}
