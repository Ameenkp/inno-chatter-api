import crypto from 'crypto';
import path from "path";
import {promisify} from "node:util";
import fs from "fs";

export class Utils {
  static copyFileAsync = promisify(fs.copyFile);
  /**
   * A function to save a user image.
   *
   * @param {any} image - the user image to be saved
   * @return {Promise<string>} the new image name
   */
  public static async saveUserImage(image: any): Promise<string> {
    try {
      const randNumber = Math.floor(Math.random() * 99999);
      const newImageName = randNumber + image[0].originalFilename;
      const newPath = path.join(__dirname + '../../../public/image/', newImageName);
      await this.copyFileAsync(image[0].filepath, newPath);
      return newImageName;
    } catch (error) {
      console.error('Error saving user image:', error);
      throw new Error('Failed to save user image' , error as Error);
    }
  }

  public static async saveImage(image: any): Promise<void> {
    try {
      const newPath = path.join(__dirname + '../../../public/image/', image[0].newFilename, '.jpeg');
      await this.copyFileAsync(image[0].filepath, newPath);
    } catch (error) {
      console.error('Error saving user image:', error);
      throw new Error('Failed to save chat image' , error as Error);

    }
  }
}
