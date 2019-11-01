// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportFile from '../../../app/controller/file';
import ExportFolder from '../../../app/controller/folder';
import ExportHome from '../../../app/controller/home';
import ExportRepo from '../../../app/controller/repo';
import ExportSpace from '../../../app/controller/space';
import ExportAdminResource from '../../../app/controller/admin/resource';
import ExportAdminSession from '../../../app/controller/admin/session';

declare module 'egg' {
  interface IController {
    file: ExportFile;
    folder: ExportFolder;
    home: ExportHome;
    repo: ExportRepo;
    space: ExportSpace;
    admin: {
      resource: ExportAdminResource;
      session: ExportAdminSession;
    }
  }
}
