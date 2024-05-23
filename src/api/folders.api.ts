import express, { Request, Response } from 'express';
import { createFolder, deleteFolder, listFolders, uploadFileToWasabiFolder } from '../providers/wasabi';
import upload from '../utils/multer';
import { getUserIDFromToken } from '../middlewares/auth';

const bucketName = process.env.WASABI_BUCKET_NAME!;

export default class FolderApi {
    private static _instance: FolderApi;
    private readonly folderApi = express.Router();

    private constructor() {
        // FOLDERS Routers
        this.folderApi.get("/", async(req: Request, res: Response) => {
            try {
                const bucket = bucketName;
                const prefix = "";
        
                const folders = await listFolders(bucket, prefix);
        
                res.status(200).send(folders);
            } catch (error) {
                console.error("can not fetch folders from wasabi bucket", error);
                throw error;
            }
        });

        // CREATE:: create folder root (main folder)
        this.folderApi.post("/", async (req: Request, res: Response) => {
            const data = req.body;
            try {           
                const bucket = bucketName;
                const folderName = `${data.folder_name}`;
                
                // Check logged user


                // Check payment users


                // Validation and get sharing data


                // Encrypt folder name to new folder name


                // Save to foldername and new folder name to database


                // create wasabi folder with endcrypted foldername


                // response to frontend

                const response = await createFolder(bucket, folderName);
                
                res.status(200).send(response);
            } catch (error) {
                console.error("can not fetch folders from wasabi bucket", error);
                throw error;
            }
        });

        // DELETE:: delete folder from wasabi
        this.folderApi.delete("/:folder_name", async(req: Request, res: Response) => {
            try {
                const folderName = req.params.folder_name;
                const bucket = bucketName;
        
                const response = await deleteFolder(bucket, folderName);
        
        
                res.send(response);
            } catch (error) {
                console.error("Error delete folder from  buckets", error);
                throw error;
            }
        });

        // CREATE:: upload file to folder
        this.folderApi.post("/:folder_name/upload",  upload.single("file"), async(req: Request, res: Response) => {
            try {
                const file = req.file;
                // Check bucket
                const bucket = bucketName;
                const folderName = req.params.folder_name;
                const filePath = `${file?.path}`;

                // if(file?.size )
                // const checkId = await getUserIDFromToken(req);

                // if(!checkId) throw Error("LOGIN_IS_REQUIRED");

                // const _userNewName = req.accepts;
                // The logical


                // Check folder exist

                // if no folder --> then create new folder

                // stream file 

                // get file path 

                // endcrypt file name 

                // save to database

                // upload file to wasabi storage with endcrypted filename

                // response to frontend

                // if (!file) {
                //     return res.status(400).send("No file uploaded.");
                // }
                // // file from local device path
        
                const result = await uploadFileToWasabiFolder(bucket, folderName, filePath);
        
                res.send(result);
            } catch (error) {
                console.error("Error upload file to folder", error);
                throw error;
            }
        })
    } 

    public static InitfolderApi(): FolderApi {
        if(this._instance) return this._instance;

        this._instance = new FolderApi();
        return this._instance;
    }

    public commitFolderApi() {
        return this.folderApi;
    }
}