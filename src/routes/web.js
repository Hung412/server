import express from "express";
import homeController from '../controller/homeController';

let router = express.Router();

const initWebRouter = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/home', homeController.getHomePage);
    router.get('/controll-panel', homeController.getControllPanelPage);
    router.post('/delete-status', homeController.postDeleteStatus);
    router.get('/sign-in', homeController.showSigninForm);
    router.get('/log-in', homeController.signin);
    return app.use('/', router);
}
export default initWebRouter;