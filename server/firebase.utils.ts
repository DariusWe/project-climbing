// Is nodemon watching this file?

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, StorageReference, listAll } from "firebase/storage";
// More SDKs for Firebase products:
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyCObzWeNbQ6RVvJ1XDbVYY3J_G3ZWhI3S8",
  authDomain: "climbing-app-fdccd.firebaseapp.com",
  projectId: "climbing-app-fdccd",
  storageBucket: "climbing-app-fdccd.appspot.com",
  messagingSenderId: "176909787151",
  appId: "1:176909787151:web:cc17b02ed1bb1352db837a",
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
