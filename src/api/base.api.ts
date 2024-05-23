import express, { Request, Response } from 'express';
import FolderApi from './folders.api';
import AuthApi from './auth.api';

//use all api
const authApi = AuthApi.InitAuthApi().commitAuthApi();
const folderApi = FolderApi.InitfolderApi().commitFolderApi();


export default class Api {
    private static _instance: Api;
    private readonly api = express.Router();

    private constructor() {
        // Auth
        this.api.use("/auth", authApi);

        // FOLDERS Routers
        this.api.use("/folders", folderApi);
    } 

    public static InitApi(): Api {
        if(this._instance) return this._instance;

        this._instance = new Api();
        return this._instance;
    }

    public commitApi() {
        return this.api;
    }
}