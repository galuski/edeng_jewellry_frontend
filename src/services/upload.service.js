export const uploadService = {
  uploadProfileImg,
  uploadImg
}
async function uploadProfileImg(ev) {
  const CLOUD_NAME = "dlrx5xkj6"
  const UPLOAD_PRESET = "edengedj"
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

  try {
    const formData = new FormData()
    formData.append('upload_preset', UPLOAD_PRESET)
    formData.append('file', ev.target.files[0])

    const res = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData
    })
    const imgUrl = await res.json()
    return imgUrl
  } catch (err) {
    console.error('Failed to upload', err)
    throw err
  }
}
async function uploadImg(file) {
  const CLOUD_NAME = "dlrx5xkj6";
  const UPLOAD_PRESET = "edengedj";
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  try {
      const formData = new FormData();
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('file', file); // העברת הקובץ עצמו

      const res = await fetch(UPLOAD_URL, {
          method: 'POST',
          body: formData,
      });

      if (!res.ok) throw new Error('Failed to upload image');
      return await res.json(); // החזרת האובייקט המלא
  } catch (err) {
      console.error('Failed to upload image:', err);
      throw err;
  }
}


