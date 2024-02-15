import type {Content} from '@enonic-types/lib-content';


import {APP_NAME_PATH, MIXIN_PATH} from '/lib/common/constants';


export const getBlockRobots = (content: Content): boolean => !!content.x?.[APP_NAME_PATH]?.[MIXIN_PATH]?.blockRobots;
