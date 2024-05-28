import express, { Request, Response } from 'express';
import FolderApi from './folders.api';


//use all api
const folderApi = FolderApi.InitfolderApi().commitFolderApi();


export default class Api {
    private static _instance: Api;
    private readonly api = express.Router();

    private constructor() {
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