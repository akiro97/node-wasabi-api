import { QueryTypes } from "sequelize";
import InterfaceMiddleware from "../middlewares/InterfaceMiddleware";

export interface User {
    id: number;
    username: string;
    password: string;
}

export default class UserInterface extends InterfaceMiddleware {

    constructor() {
        super();
    }

    public static fetchUserByusername = async (username: string) => {
        try {
            const query = `SELECT * FROM users WHERE username = '${username}'`;

            const [rows] = await this.sequelize.query(query, { type: QueryTypes.SELECT, raw: true });

            const users = rows as User;
            
            return users;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public static createNewUser = async (username: string, hashedPassword: string) => {
        try {
            const query = `INSERT INTO users (username, password) VALUES ('${username}', '${hashedPassword}')`;

            const [rows] = await this.sequelize.query(query, { type: QueryTypes.INSERT });

            const user = rows;
            
            return user;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}