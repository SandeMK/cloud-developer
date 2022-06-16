import fs from "fs";
import path from "path";
import Jimp = require("jimp");

/**
 * Returns an absolute path to a filtered image locally saved file.
 * 
 * @param inputURL {string} - a publicly accessible url to an image file
 */
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const photo = await Jimp.read(inputURL);
      const outpath =
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname + outpath, (img) => {
          resolve(__dirname + outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Deletes files on the local disk.
 * 
 * @param files {Array<string>} an array of absolute paths to files.
 */
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}

/**
 * Deletes all files in the tmp folder.
 */
export async function deleteTempFiles() {
  const directoryPath = path.join(__dirname, 'tmp');
  fs.readdir(directoryPath, async function (error, files){
    if(error){
      console.log('unable to read directory');
      return;
    }
    const _files = files.map((file) => __dirname + '/tmp/' + file);
    await deleteLocalFiles(_files);
  });
}

/**
 * Returns true if a given url is valid, else false.
 * 
 * @param url {string} the url to be validated.
 */
export function isValidUrl(url: string) {
  try{
    return ['http:', 'https:'].includes((new URL(url)).protocol);
  } catch(e){
    return false;
  }
}
