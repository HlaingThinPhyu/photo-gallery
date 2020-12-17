
import { Injectable } from '@angular/core';
import { Plugins, CameraResultType, Capacitor, FilesystemDirectory, CameraPhoto, CameraSource, CameraOptions}from '@capacitor/core';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { rejects } from 'assert';
import{ Platform } from '@ionic/angular';

const { Camera, Filesystem, Storage }= Plugins;

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  croppedImagepath = "";
  isLoading = false;

  options:any;

  public photos: Photo[]=[];
  private PHOTO_STORAGE: string = "photos";
  private platform: Platform;

  constructor(platform: Platform, private imagePicker: ImagePicker) {
    this.platform = platform;
    this.imagePicker = imagePicker;
   }

  public async addNewToGallery(){
    //Take Photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      quality: 100
    });

    // //using image picker testing
    
    // this.options = {
    //   width: 200,
    //   quality: 50,
    //   //outputType: 0
    // };
    
    
    // this.imagePicker.getPictures(this.options).then(async (results)=>{
    //   for(var i =0;i< results.length;i++){
        
    //     alert('selected image: '+ typeof( results[i]));
    //     const savedSelectImages = await this.savePicture(results[i]);
    //     this.photos.unshift(savedSelectImages);
    //   }
    // },(err)=>{ alert(err); });
    // //end image picker testing

    //save picture and add to photo collection
    //alert('source :'+ typeof(capturedPhoto));
    const savedImageFile = await this.savePicture(capturedPhoto);
    
    this.photos.unshift(savedImageFile);

    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });
  }

  private async savePicture(cameraPhoto: CameraPhoto){
    //convert photo to base64 format
    const base64Data = await this.readAsBase64(cameraPhoto);

    //write file to data directory
    const fileName = new Date().getTime()+'.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory : FilesystemDirectory.Data
    });

    if(this.platform.is('hybrid')){
      return{
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    }
    else{
    //use webPath to display the new image 
    return{
      filepath: fileName,
      webviewPath: cameraPhoto.webPath
    };
    }
  }
  private async readAsBase64(cameraPhoto: CameraPhoto) {
    if(this.platform.is('hybrid')){
      const file = await Filesystem.readFile({
        path: cameraPhoto.path
      });
      return file.data;
    }
    else{
    //fetch the photo, read as blob
    const response = await fetch(cameraPhoto.webPath);
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string;
  }
  }
  convertBlobToBase64 = (blob: Blob) => new Promise((resolve,reject)=>{
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = ()=> {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  public async loadSaved(){
    //retrieve cached photo array data
    const photoList = await Storage.get({ key: this.PHOTO_STORAGE});
    this.photos = JSON.parse(photoList.value) || [];

    if(!this.platform.is('hybrid')){
     
      //display photo by reading into base64 format
      for(let photo of this.photos){
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: FilesystemDirectory.Data
        });

        //for web platform only: load as base64 data
        photo.webviewPath = `data:image/jpeg;base64, ${readFile.data}`;
        console.log("PHOTO webviewpath:: "+ photo.filepath);
      } 
    }
  }
  // public async deletePhoto(photo: { filepath: any; }){
  //   const photoList = await Storage.get({ key: this.PHOTO_STORAGE});
  //   this.photos = JSON.parse(photoList.value) || [];
  //   //remove this photo from the Photos 
  //   const delPhoto = async (photo:Photo)=>{
  //     const newPhotos = this.photos.filter(p=>p.filepath !== photo.filepath);

  //     //update photos array cache by overwritinig the existing photo array
  //     set(this.PHOTO_STORAGE,JSON.stringify(newPhotos));

  //   }
  //   const deleteFile = await Filesystem.deleteFile({
  //     path: photo.filepath,
  //     directory: FilesystemDirectory.Data
  //   });
    
  // }
}

export interface Photo{
  filepath: string;
  webviewPath: string;
}

