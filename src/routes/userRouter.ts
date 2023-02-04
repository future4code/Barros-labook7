import express from "express";
import { UserBusiness } from "../business/UserBusiness";
import { UserDatabase } from "../data/mySQL/UserDatabase";
import { UserController } from "../controller/UserController";

export const userRouter = express.Router();

const userDatabase = new UserDatabase();
const userBusiness = new UserBusiness(userDatabase);
const userController = new UserController(userBusiness);

userRouter.get("/all", (req,res) => userController.getUsers(req,res));
userRouter.post("/create", (req,res) => userController.createNewUser(req,res));
userRouter.post("/addFriend", (req,res) => userController.addFriend(req,res));
userRouter.post("/login", (req,res) => userController.login(req,res));