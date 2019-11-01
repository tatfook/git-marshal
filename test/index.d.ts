import 'egg';

declare module 'egg' {
    export interface Application {
        factory: any;
    }
}
