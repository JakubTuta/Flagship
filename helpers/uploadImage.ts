import { type FirebaseStorage, getDownloadURL, ref, uploadString } from 'firebase/storage'
import { generateRandomText } from './randomText'

export async function createAndUploadImage(
  prefix: string,
  dataUrl: string,
  firebaseStorage: FirebaseStorage,
) {
  const imagePath = `${prefix}/${generateRandomText()}`
  const uploadedData = await uploadString(ref(firebaseStorage, imagePath), dataUrl, 'data_url')
  const imageUrl = await getDownloadURL(uploadedData.ref)

  return imageUrl
}
