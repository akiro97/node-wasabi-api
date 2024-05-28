import { QueryTypes } from 'sequelize';
import InterfaceMiddleware from '@middleware/InterfaceMiddleware';


export default class UserInterface extends InterfaceMiddleware {
    constructor() {
        super();
    }

    public static getUserByUsername = async (username: string) => {
        try {
            const query = `SELECT * FROM users WHERE username = '${username}'`;

            const user = await this.sequelize.query(query, { type: QueryTypes.SELECT, raw: true });

            return user;
        } catch (error) {
            throw error;
        }
    }
}