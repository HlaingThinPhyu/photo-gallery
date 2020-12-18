import { Component } from '@angular/core';
import{ Photo,PhotoService } from '../services/photo.service';
import{ ActionSheetController }from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public photoService: PhotoService, public actionSheetController: ActionSheetController) {}

  addPhotoToGallery(){
    this.photoService.addNewToGallery();
  }

  async ngOnInit(){
    await this.photoService.loadSaved();
  }
  openPreview(img){
    this.photoService.previewPhoto(img);
  }

  public async showActionSheet(photo: Photo, position: number){
    const actionSheet = await this.actionSheetController.create({
      header: photo.filepath,
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: ()=> {
          this.photoService.deletePicture(photo,position);
        }
      },{
        text:'Cancel',
        icon: 'close',
        role: 'cancel',
        handler:()=>{}
      }]
    });
    await actionSheet.present();
  }
  

}
