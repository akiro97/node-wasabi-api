import archiver from 'archiver';
import axios from 'axios';
import dotenv from 'dotenv';
import bcryptJS from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();



const wasabiHost = process.env.WASABI_UPLOAD_UR!;
const region = process.env.WASABI_REGION!;

export async function addFolderToZip( archive: any, storageZoneName: any, path: string, AccessKey: any, rootPath: any, zipRoot: any, sendProgress: any, nameMapping: any) {
    const lisUrl = `${wasabiHost}/${region}/${path}/`;
    const listResponse = await axios.get(lisUrl, {
        headers: {
            AccessKey: AccessKey
        }
    });

    const items = listResponse.data;

    for(const [index, item] of items.entries()) {
        if (item.IsDirectory) {
            await addFolderToZip(
              archive,
              storageZoneName,
              `${path}/${item.ObjectName}`,
              AccessKey,
              rootPath,
              zipRoot,
              sendProgress,
              nameMapping
            );
          } else {
            const fileUrl = `${wasabiHost}/${region}/${path}/${item.ObjectName}`;
            const fileResponse = await axios.get(fileUrl, {
              headers: {
                AccessKey: AccessKey,
              },
              responseType: "stream",
            });
            let filePath = `${zipRoot}${path}/${item.ObjectName}`.replace(
              rootPath,
              ""
            );
            filePath = filePath
              .split("/")
              .map((part) => nameMapping[part] || part)
              .join("/");
            archive.append(fileResponse.data, { name: filePath });
          }
          sendProgress(Math.round(((index + 1) / items.length) * 100));
    }

}

export async function getFileType(filename: any) {
    const extension = filename.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(extension)) {
      return "image";
    } else if (["pdf"].includes(extension)) {
      return "pdf";
    } else if (["mp4", "avi", "mov", "wmv", "mkv"].includes(extension)) {
      return "video";
    }
    // Add more cases for other file types if needed
}


export default class Utils {
  // hashing password
  public static hashPassword = async (plainPassword: string) => {
    try {
      const password = bcryptJS.hash(plainPassword, 12);

      return password;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Compare password
  public static comparePassword = async (passwordToCheck: string, userPassword: string) => {
    const isValid = bcryptJS.compare(passwordToCheck, userPassword)
    
    if(isValid) {
      return isValid;
    }else{
      return Error("Error matching password...")
    }
  }


  //Verify token
  public static verifyToken = (token: string) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET_KET!);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}