import express, { Request, Response } from 'express';
import { createFolder, deleteFolder, fetchAllObjectsFromWasabiFolder, listFolders, listObjectsInFolder, uploadFileToFolder, uploadFileToWasabiFolder, uploadFilesToFolder } from '../providers/wasabi';
import upload from '../utils/multer';
import path from 'path';

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

                // // Check logged user
                // const checkedId = await getUserIDFromToken(req);

                // if(!folderName) {
                //     // Create roo folder with user_id or username
                //     console.log("user from req token", checkedId)
                // }else{
                //     console.log("foler name is", folderName);
                // }


                // foldername empty
                

                // pass user_id or username for first root foldername



                // Check payment users


                // Validation and get sharing data


                // Encrypt folder name to new folder name


                // Save to foldername and new folder name to database


                // create wasabi folder with endcrypted foldername


                // response to frontend

                const response = await createFolder(bucket, folderName);
                
                res.status(200).send(response.$metadata);
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
        
                console.log("folder name want to delete", folderName)
        
                res.send(response?.$metadata);
            } catch (error) {
                console.error("Error delete folder from  buckets", error);
                throw error;
            }
        });

        // Multiple upload file
        this.folderApi.post("/:folder_name/multiple/upload",  upload.array("files", 20), async(req: Request, res: Response) => {


            try {
               
                const bucket = bucketName;
                const folderName = req.params.folder_name;


                if (!req.files) {
                    return res.status(400).send('No files were uploaded.');
                  }
                
                  const files = req.files as Express.Multer.File[];

                  console.log("select multiple files", files);

                for(const file of files) {
                    const key = `${folderName}/${file.originalname}`
                    const response = await uploadFilesToFolder(bucket, key, file)
                    console.log("files selected", response);
                }
                
                res.status(200).send('Files uploaded successfully.');
            } catch (error) {
                console.error("Error upload file to folder", error);
                throw error;
            }
        });

        // CREATE:: upload file to folder
        this.folderApi.post("/:folder_name/upload",  upload.single("file"), async(req: Request, res: Response) => {
            try {
                const file = req.file;
                // Check bucket
                const bucket = bucketName;
                const key = req.params.folder_name;

                if(!file) {
                    return res.status(400).send('No files were uploaded.');
                }
        
                const result = await  uploadFileToFolder(bucket, key, file);
        
                res.status(200).send(result.$metadata);
            } catch (error) {
                console.error("Error upload file to folder", error);
                throw error;
            }
        });

        // GET:: fetch object from folder
        this.folderApi.get("/:folder_name", async (req: Request, res: Response) => {
            try {
                const bucket = bucketName;
                const key = req.params.folder_name;
                const downloadPlath = path.join(__dirname, './public/download', path.basename(key))

                const results = await fetchAllObjectsFromWasabiFolder(bucket, key, downloadPlath);

                res.status(200).send(results);
            } catch (error) {
                console.log("Error to fetch object from wasabi folder", error);
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