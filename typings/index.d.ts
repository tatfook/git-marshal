import 'egg';
import { IAPI } from './custom/api';
declare module 'egg' {
    export interface Application {
        api: IAPI;
    }
}
