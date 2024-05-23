import { Request, Response, Router } from "express";
// import { createNewUser, findUserByUsername } from "../models/auth.model";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserInterface from "../interface/userInterface";

const jwtSecret = process.env.JWT_SECRET!;
const jwt_token = process.env.JWT_TOKEN!;
export default class AuthApi {
    private static _instance: AuthApi;
    private readonly authApi: Router = Router();

    private constructor() {
        this.authApi.post("/login", async (req: Request, res: Response) => {
            try {
                const { username, password} = req.body;
                // Check if user is exist
                const users = await UserInterface.fetchUserByusername(username);

                if(!users || !bcrypt.compare(password, users.password)) {
                    res.status(400).json({ message: "username or password invalid...! please try again later?"});
                    return;

                }

                const token =  jwt.sign({ id: users.id }, jwtSecret, { expiresIn: "2h"});

                res.cookie(jwt_token, token, { maxAge: 15 * 60 }).status(200).json({ users, token });

               
            } catch (error) {
                console.error("Error to login for this user, Please check and try again later", error);
                throw error;

            }
        });

        this.authApi.post("/register", async (req: Request, res: Response) => {
            const { username, password} = req.body;

            const isUser = await UserInterface.fetchUserByusername(username);

            if(isUser) {
                res.status(400).json({ message: "user already exist..."});
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 12)

            const user = await UserInterface.createNewUser(username, hashedPassword);

            res.status(200).json({ message: "User create successfully...!", user});
        })


    }


    public static InitAuthApi() {
        if (this._instance) return this._instance;

        this._instance = new AuthApi();
        return this._instance;
    }

    public commitAuthApi() {
        return this.authApi;
    }
}