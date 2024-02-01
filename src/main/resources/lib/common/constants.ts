// @ts-expect-error // No types yet
import {app as libUtilApp} from '/lib/util';


export const APP_NAME_PATH = libUtilApp.getJsonName() as string;
export const MIXIN_PATH = 'meta-data';
