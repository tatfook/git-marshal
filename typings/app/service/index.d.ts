// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAdmin from '../../../app/service/admin';
import ExportFile from '../../../app/service/file';
import ExportFolder from '../../../app/service/folder';
import ExportGuard from '../../../app/service/guard';
import ExportRepo from '../../../app/service/repo';

declare module 'egg' {
  interface IService {
    admin: ExportAdmin;
    file: ExportFile;
    folder: ExportFolder;
    guard: ExportGuard;
    repo: ExportRepo;
  }
}
