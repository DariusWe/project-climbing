// Is nodemon watching this file?

// Import the functions you need from the SDKs you need
import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, StorageReference, listAll } from "firebase/storage";
// More SDKs for Firebase products:
// https://firebase.google.com/docs/web/setup#available-libraries

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASEKEY,
  authDomain: process.env.FIREBASEDOMAIN,
  projectId: process.env.FIREBASEPROJECTID,
  storageBucket: process.env.FIREBASESTORAGEBUCKET,
  messagingSenderId: process.env.FIREBASESENDERID,
  appId: process.env.FIREBASEAPPID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const uploadToFirebaseStorage = async (file: Uint8Array, fileName: string) => {
  const storageRef = ref(storage, `/images/crags/${fileName}`);
  // WHAT IF AN ERROR OCCURS HERE? SHOULD EVERY PROMISE BE WRAPPED IN TRY CATCH???? HOW TO THROW THAT ERROR?
  const uploadResult = await uploadBytes(storageRef, file, { contentType: "image/jpeg" });
  return uploadResult.ref;
};

export const getDownloadUrl = async (ref: StorageReference) => {
  const imgUrl = await getDownloadURL(ref);
  return imgUrl;
};
