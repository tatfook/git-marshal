// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAdmin from '../../../app/model/admin';
import ExportGuard from '../../../app/model/guard';
import ExportRepo from '../../../app/model/repo';

declare module 'egg' {
  interface IModel {
    Admin: ReturnType<typeof ExportAdmin>;
    Guard: ReturnType<typeof ExportGuard>;
    Repo: ReturnType<typeof ExportRepo>;
  }
}
