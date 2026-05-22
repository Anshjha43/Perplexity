import express from "express";
import { registerUser, verifyEmail, login, getme } from "../controller/user.controller.js";
import { userRegisterValidation, userLoginValidation } from "../validation/auth.validator.js";
import identifier from "../middleware/identifer.middleware.js";

const userrouter = express.Router();

userrouter.post("/register", userRegisterValidation, registerUser);

userrouter.get("/verifyEmail", verifyEmail)

userrouter.post("/login", userLoginValidation, login)

userrouter.get("/getme", identifier, getme)


export default userrouter;