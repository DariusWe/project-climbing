import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, StorageReference } from "firebase/storage";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASEKEY,
  authDomain: process.env.FIREBASEDOMAIN,
  projectId: process.env.FIREBASEPROJECTID,
  storageBucket: process.env.FIREBASESTORAGEBUCKET,
  messagingSenderId: process.env.FIREBASESENDERID,
  appId: process.env.FIREBASEAPPID,
};


const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export const uploadToFirebaseStorage = async (file: Uint8Array, fileName: string) => {
  const storageRef = ref(storage, `/images/crags/${fileName}`);
  const uploadResult = await uploadBytes(storageRef, file, { contentType: "image/jpeg" });
  return uploadResult.ref;
};

export const getDownloadUrl = async (ref: StorageReference) => {
  const imgUrl = await getDownloadURL(ref);
  return imgUrl;
};
