// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportHome from '../../../app/controller/home';
import ExportAdminCacheManager from '../../../app/controller/admin/cacheManager';
import ExportAdminResource from '../../../app/controller/admin/resource';
import ExportAdminSession from '../../../app/controller/admin/session';

declare module 'egg' {
  interface IController {
    home: ExportHome;
    admin: {
      cacheManager: ExportAdminCacheManager;
      resource: ExportAdminResource;
      session: ExportAdminSession;
    }
  }
}
