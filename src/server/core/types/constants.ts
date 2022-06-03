require('dotenv').config()

const APP_VERSION = process.env.APP_VERSION

export const CONTROLLER_PATH_PREFIX = `/api/v${APP_VERSION}`;