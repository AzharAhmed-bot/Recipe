import { Injectable } from '@angular/core';
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary'

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private cloud_name="dh50yueq2"
  private upload_preset="homesrecipe"
  constructor() { 
  }

  async upload(imageFile:File):Promise<any>{
    const url=`https://api.cloudinary.com/v1_1/${this.cloud_name}/image/upload`
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset',this.upload_preset)

    try{
      const response=await axios.post(url,formData,{
        headers: {'Content-Type':'multipart/form-data'}
      })
      return response.data.url
    }catch(error){
      console.log("Error uploading",error)
      throw error
    }
  }
}
