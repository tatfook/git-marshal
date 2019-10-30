// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAdmin from '../../../app/service/admin';
import ExportGuard from '../../../app/service/guard';
import ExportRepo from '../../../app/service/repo';
import ExportSpace from '../../../app/service/space';

declare module 'egg' {
  interface IService {
    admin: ExportAdmin;
    guard: ExportGuard;
    repo: ExportRepo;
    space: ExportSpace;
  }
}
