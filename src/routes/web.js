import express from "express";
import homeController from '../controller/homeController';
var storage = require('node-persist');

let router = express.Router();

const initWebRouter = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/home', homeController.getHomePage);
    router.get('/controll-panel', homeController.getControllPanelPage);
    router.post('/delete-status', homeController.postDeleteStatus);
    router.get('/sign-in', homeController.showSigninForm);
    router.post('/login', homeController.signin);
    return app.use('/', router);
}
export default initWebRouter;