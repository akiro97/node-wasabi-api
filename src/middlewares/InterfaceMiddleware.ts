import { Sequelize } from "sequelize";
import ConnectionDB from "../config/database";


export default class InterfaceMiddleware {
    static sequelize: Sequelize = ConnectionDB.getInitDbInstance().getSequelize();

    constructor() {
        // super(); future to restore transaction
    }
}