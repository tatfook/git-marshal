// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportGlobalExceptionHandler from '../../../app/middleware/globalExceptionHandler';

declare module 'egg' {
  interface IMiddleware {
    globalExceptionHandler: typeof ExportGlobalExceptionHandler;
  }
}
