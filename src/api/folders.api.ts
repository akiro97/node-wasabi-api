import express, { Request, Response } from 'express';
import { createFolder, deleteFolder, fetchAllObjectsFromWasabiFolder, listFolders, listObjectsInFolder, uploadFileToFolder, uploadFileToWasabiFolder, uploadFilesToFolder } from '../providers/wasabi';
import path from 'path';
import upload from '@utils/multer';

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

                // Check empty folder name
                if(!folderName) {
                    // Dir Username as root folders
                    // const newFolder = checkId.username;

                    // Check user logged in
                    // const checkId = await getUserIDFromToken(req);   

                    
                    // Check user payment



                    res.status(200).send("create root folder by logged in username")
                }else {
                    const response = await createFolder(bucket, folderName);
                
                    res.status(200).send(response.$metadata);
                }

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

        //CREATE:: Multiple file
        this.folderApi.post("/:folder_name/multiple-files/upload",  upload.array("files", 2000), async(req: Request, res: Response) => {
            try {
               
                const bucket = bucketName;
                const folderName = req.params.folder_name;


                if (!req.files) {
                    return res.status(400).send('No files were uploaded.');
                  }
                
                  const files = req.files as Express.Multer.File[];

                for(const file of files) {
                    const key = `${folderName}/${file.originalname}`
                    await uploadFilesToFolder(bucket, key, file);
                }

                res.status(200).send("Upload multiple files successfully...!")
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

        // GET:: fetch object from folder --> [failed responding]
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
        });

        //CREATE:: upload folders to folder of wasabi
        this.folderApi.post("/upload-folder-multi-files", upload.array("files"), async (req, res) => {
            const files = req.files;

            console.log("list folders selected:", files);

            // if(!files) {
            //     res.json("Files uploaded successfully...!")
            // }else {
            //     files?.forEach((file: any) => {
            //         const targetPath =  path.join(__dirname, "../", "uploads", (file as Express.Multer.File).originalname);
    
            //         fs.renameSync((file as Express.Multer.File).path, targetPath);
    
    
            //     })
    
            //     res.json("Files uploaded successfully...!")
            // }

             
        });
        

        //CREATE:: uplaod mltiple folders
        this.folderApi.post('/multi-folders-upload', upload.array("files"), async (req: Request, res: Response) => {
            const files = req.files;

            console.log("list folders selected:", files);
           
            // req.files?.forEach(file => {
            //     const targetPath = path.join(__dirname, '..', 'uploads', (file as Express.Multer.File).originalname);
            //     fs.renameSync((file as Express.Multer.File).path, targetPath);
            // });
            // res.json({ message: 'Files uploaded successfully!' });
        });


        // 

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