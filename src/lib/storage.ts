
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads a base64 encoded image to Firebase Storage.
 *
 * @param base64 The base64 encoded image string (data URI).
 * @param path The path in the storage bucket to upload to.
 * @returns The public URL of the uploaded image.
 */
export async function uploadImageFromDataUrl(base64: string, path: string): Promise<string> {
    
    // Extract content type and base64 data from data URI
    const match = base64.match(/^data:(image\/[a-z]+);base64,(.+)$/);
    if (!match) {
        throw new Error("Invalid data URI format. Expected 'data:image/[type];base64,[data]'.");
    }
    const contentType = match[1];
    const base64Data = match[2];

    const uniqueId = uuidv4();
    const storageRef = ref(storage, `${path}/${uniqueId}`);
    
    try {
        const snapshot = await uploadString(storageRef, base64Data, 'base64', { contentType: contentType });
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw new Error("Could not upload image to storage.");
    }
}
