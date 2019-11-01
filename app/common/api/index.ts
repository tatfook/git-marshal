import { Application } from 'egg';
import GuardAPI from './guard';

export default (app: Application) => {
    app.api = {
        guard: GuardAPI(app),
    };
};
