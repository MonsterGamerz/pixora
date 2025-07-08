// src/utils/cloudinaryUpload.js
export const uploadImageToCloudinary = async (base64) => {
  const data = new FormData();
  data.append('file', base64);
  data.append('upload_preset', 'pixora'); // your unsigned preset
  data.append('cloud_name', 'dmwwifdds');

  const res = await fetch('https://api.cloudinary.com/v1_1/dmwwifdds/image/upload', {
    method: 'POST',
    body: data
  });
  const json = await res.json();
  return json.secure_url;
};
