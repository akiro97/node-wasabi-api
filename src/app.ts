import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as fs from "fs";
import * as dotenv from 'dotenv';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileFromWasabi, listObjects, uploadFileToFolder, listObjectsInFolderV2 } from './providers/wasabi';
import { S3Client } from "@aws-sdk/client-s3";

// Endpoin Api
import BaseApi from './api/base.api';
import upload from '@utils/multer';


// ENVIROMENT
dotenv.config();

// ENVIRONMENT UPLOAD 
const accessKeyId = process.env.WASABI_ACCRESS_KEY!;
const secretKey = process.env.WASABI_SECRET_KEY!;
const region = process.env.WASABI_REGION!;
const endpoint = process.env.WASABI_UPLOAD_URL!;

// Config S3 -- v2
const client = new S3Client({
    region: region,
    endpoint: endpoint,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretKey
    }
});

// User endpoint Api
const baseApi = BaseApi.InitApi().commitApi();

const bucketName = process.env.WASABI_BUCKET_NAME!

// CREATE --> Directory for storage files
const dir = './public';
if(!fs.existsSync(dir)){
    fs.mkdirSync(dir);
} 

export default class App {
    private static _instance: App;
    private readonly app = express();

    private constructor() {
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
        this.app.use(express.static(__dirname +  dir));
        
        // Routes
        this.app.get("/", async (_req: Request, res: Response) => {
            res.send("application is healthy...!")
        });
        
        // Global Api Router
        this.app.use("/api", baseApi);
        
        
        // CREATE:: upload file streaming --> Root Bucket
        this.app.post("/upload", upload.single("file"), async (req: Request, res: Response) => {
           try {
            const file = req.file;
            const key = file?.originalname!;
        
            console.log("file from multer request: ", file)
        
            if (!file) {
                return res.status(400).send('No file uploaded.');
            }
        
            const base64Data = new Buffer(JSON.stringify(file)).toString("base64");
        
        
                // console.log('buffer:', file.buffer.toString('base64'))
                // console.log('buffer:', file.buffer.toString('utf8'))
                // console.log('file:', file)
        
                console.log(base64Data);
        
            // Test by use command
            const commeand = new PutObjectCommand({
                Bucket: bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            });
        
            const response = await client.send(commeand);
            
            // const response = await uploadImageViaPath(bucketName, key, fileBuffer,  mimeType);
            // const response = await uploadImageViaPath(bucketName, key,  filePath);
            
            res.send(response);
        
           } catch (error) {
            console.error(error);
            throw error;
           }
        });
        
        // GET:: reading file from wasabi
        this.app.get("/download", async (req: Request, res: Response) => {
            try {
                const bucket = bucketName;
                const key = "example.txt";
                const filePath = "./public/example.txt";
        
                const response = await readFileFromWasabi(bucket, key, filePath);
        
                res.send(response);
            } catch (error) {
                console.error("can not read file from wasabi", error);
                throw error;
            }
        });
        
        // CREATE:: upload file
        this.app.post("/folders/upload",  upload.single("file"), async (req: Request, res: Response) => {
            try {
                const bucket = bucketName;
                const folderName = "my-extra-photo"; 
        
                if (!req.file) {
                    return res.status(400).send("No file uploaded.");
                }
        
                const response = await uploadFileToFolder(bucket, folderName, req.file);
                res.status(200).send(response);
            } catch (error) {
                res.status(500).send("Error uploading file.");
            }
        });

        this.app.get("/folders/get-object-lists", async (req: Request, res: Response) => {
            try {
                const bucket = bucketName;
                const folderName = req.params.folder_name;

                const results = await listObjectsInFolderV2(bucket, folderName);

                console.log("results from response: ", results)

                res.status(200).send(results);
            } catch (error) {
                res.status(500).send("Error reach to the files.");
            }
        });

        // CREATE:: upload file to node folder
        // this.app.post("/folders/:folder_name/upload", upload.single("file"), async (req: Request, res: Response) => {
        //     try {
        //         const file = req.file;
        //         const bucket = bucketName;
        //         const folderName = req.params.folder_name;
        //         const filePath = `${file?.path}`;
        
        //         if (!file) {
        //             return res.status(400).send("No file uploaded.");
        //         }
        //         // file from local device path
        
        //         const result = await uploadFileToWasabiFolder(bucket, folderName, filePath);
        
        //         res.send(result);
        //     } catch (error) {
        //         console.error("Error upload file to folder", error);
        //         throw error;
        //     }
        // });
        
        // GET:: fetch all objects from wasabi bucket
        this.app.get("/file-objects", async (req: Request, res: Response) => {
            try {
                const bucket = bucketName;
                const prefix = "";
        
                const items = await listObjects(bucket, prefix);
        
                res.send(items);
            } catch (error) {
                console.error("Error to fetching objects from buckets");
                throw error;
            }
        });
    }

    // Get App Instance
    public static getInstance(): App {
        if (this._instance) return this._instance;

        this._instance = new App();
        return this._instance;
    }

    // Get App 
    public getApp() {
        return this.app;
    }
}