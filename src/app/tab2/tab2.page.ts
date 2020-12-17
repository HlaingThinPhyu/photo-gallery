import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import{ PhotoService } from '../services/photo.service';
import { ImageModalPage } from '../image-modal/image-modal.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  sliderOpts = {
    zoom: false,
    slidesPerView : 1.5,
    centeredSlides: true,
    spaceBetween: 20,
  };

  constructor(public photoService: PhotoService, private modalController:ModalController) {}

  addPhotoToGallery(){
    this.photoService.addNewToGallery();
  }

  async ngOnInit(){
    await this.photoService.loadSaved();
  }
  openPreview(img){
    console.log("OPEN PREVIEW *** "+ img);
    this.modalController.create({
      component: ImageModalPage,
      componentProps: {
        img: img
      }
    }).then(modal=> modal.present());
  }
  // deletePhoto(photo){
  //   this.photoService.deletePhoto(photo);
  // }

}
