// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, StorageReference } from "firebase/storage";
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

export const uploadToFirebaseStorage = (file: File) => {
  const storage = getStorage(app);
  // Create unique file name
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 8);
  const fileName = `${timestamp}-${randomString}.jpg`;
  // Define upload path
  const storageRef = ref(storage, `/images/${fileName}`);
  // Upload and return upload "state"
  const uploadTask = uploadBytesResumable(storageRef, file);
  return uploadTask;
};

export const getDownloadUrl = async (ref: StorageReference) => {
    const downloadUrl = await getDownloadURL(ref);
    return downloadUrl;
}