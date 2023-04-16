import { getDownloadUrl, uploadToFirebaseStorage } from "./firebase.utils";
import sharp from "sharp";

export const convertAndUploadToStorage = async (file: Express.Multer.File) => {
  // Create filenames that will be used for the uploaded images:
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 8);
  const nameOfWebpImage = `${timestamp}-${randomString}.webp`;
  const nameOfResizedWebpImage = `${timestamp}-${randomString}_480.webp`;

  // Create sharp instance of image
  const image = sharp(file.buffer);

  // Convert to webp and write the output to buffer. Then upload the buffer to Firebase Storage and request the download Url
  const imgBuffer = await image.webp().toBuffer();
  const uploadRef = await uploadToFirebaseStorage(imgBuffer, nameOfWebpImage);
  const fileUrl = await getDownloadUrl(uploadRef);

  // For resized version same thing, but resize before converting to webp
  const resizedImgBuffer = await image.resize({ width: 480 }).webp().toBuffer();
  const uploadRefResized = await uploadToFirebaseStorage(resizedImgBuffer, nameOfResizedWebpImage);
  const resizedfileUrl = await getDownloadUrl(uploadRefResized);

  return {
    imgUrl: fileUrl,
    resizedImgUrl: resizedfileUrl,
  };
};
