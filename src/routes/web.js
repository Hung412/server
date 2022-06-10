import express from "express";
// import passport from "passport";
import homeController from '../controller/homeController';
const session = require('express-session');
const passport = require('passport');
const passportfb = require('passport-facebook').Strategy;
let router = express.Router();

const initWebRouter = (app) => {
    app.use(session({
        resave: true, 
        saveUninitialized: true, 
        secret: 'somesecret', 
        cookie: { maxAge: 60000 }}));
    router.get('/', homeController.getHomePage);
    router.get('/home', homeController.getHomePage);
    router.post('/home-data', homeController.postHomeData);
    router.get('/controll-panel', homeController.getControllPanelPage);
    router.post('/delete-status', homeController.postDeleteStatus);
    router.post('/edit-user', homeController.editUser);
    router.get('/user', homeController.users);
    router.get('/sign-in', homeController.showSigninForm);
    router.get('/sign-up', homeController.showRegisterForm);
    router.post('/login', homeController.signin);
    router.post('/register', homeController.register);
    router.get('/auth/fb', passport.authenticate('facebook'));
    router.get('/auth/fb/cb', passport.authenticate('facebook',{
        successRedirect: '/'
    }) );
    return app.use('/', router);
}
export default initWebRouter;