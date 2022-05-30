import express from "express";
import homeController from '../controller/homeController';
const session = require('express-session');

let router = express.Router();

const initWebRouter = (app) => {
    app.use(session({
        resave: true, 
        saveUninitialized: true, 
        secret: 'somesecret', 
        cookie: { maxAge: 60000 }}));
    router.get('/', homeController.getHomePage);
    router.get('/home', homeController.getHomePage);
    // router.get('/home', homeController.getCount);
    router.get('/controll-panel', homeController.getControllPanelPage);
    router.post('/delete-status', homeController.postDeleteStatus);
    router.get('/sign-in', homeController.showSigninForm);
    router.post('/login', homeController.signin);
    return app.use('/', router);
}
export default initWebRouter;