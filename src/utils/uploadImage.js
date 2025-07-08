// src/utils/uploadImage.js
import axios from 'axios'

const uploadImage = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'pixora')

  const response = await axios.post(
    'https://api.cloudinary.com/v1_1/dmwwifdds/image/upload',
    formData
  )

  return response.data.secure_url // returns image URL
}

export default uploadImage
