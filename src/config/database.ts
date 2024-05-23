import { Error, Sequelize } from "sequelize";

const host = process.env.DB_HOST!;
const username = process.env.DB_USERNAME!;
const password = process.env.DB_PASSWORD!;
const db_name = process.env.DB_NAME!;

export default class ConnectionDB {
  private static _instance: ConnectionDB;
  private readonly sequelize: Sequelize;


  private constructor() {
    this.sequelize = new Sequelize(`${db_name}`, `${username}`, `${password}`, {
      host:  host,
      dialect: "mysql",
      logging: false,
      dialectOptions: {
        socketPath: process.env.NODE_ENV === "development" ? undefined : "",
      },
      pool: {
        max: 100,
        min: 0,
        acquire: 10000,
        idle: 1000
      },
      define: {
        underscored: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
      }
    }) ;

    this.sequelize
        .authenticate()
        .then(() => {
          console.log("Databse connection successfully...!");
        })
        .catch((error: Error) => {
          console.log("Database connection failed...1", error);
        });
  }


  public static getInitDbInstance() {
    if(this._instance) return this._instance;

    this._instance = new ConnectionDB();
    return this._instance;
  } 

  public getSequelize(): Sequelize {
    return this.sequelize
  }
}