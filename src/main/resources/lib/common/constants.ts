import {getDashedAppName} from '/lib/app-metafields/xp/getDashedAppName';


export const APP_CONFIG = app.config; // Outside Guillotine Extension Context
export const APP_NAME = app.name; // Outside Guillotine Extension Context
export const APP_NAME_PATH = getDashedAppName(); // Outside Guillotine Extension Context
export const MIXIN_PATH = 'meta-data';
