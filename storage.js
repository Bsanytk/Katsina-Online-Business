import { getStorage } from "firebase/storage";
export const storage = getStorage();

//UPLOAD AND DOWNLOAD FUNCTIONS CAN BE ADDED HERE IN THE FUTURE
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./storage";

const uploadImage = async (file) => {
  const imageRef = ref(storage, `products/${Date.now()}_${file.name}`);
  await uploadBytes(imageRef, file);
  return await getDownloadURL(imageRef);
};

//ADD PRODUCT WITH IMAGE
const imageUrl = await uploadImage(imageFile);

await addDoc(collection(db, "products"), {
  name,
  price,
  image: imageUrl,
  createdAt: new Date()
});