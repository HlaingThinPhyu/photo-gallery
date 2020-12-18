import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
})
export class ImageModalPage implements OnInit {

  img: any;
  @ViewChild('slider',{read: ElementRef})slider:ElementRef;

  sliderOpts = {
    zoom: {
      maxRatio: 5
    }
  };

  constructor(private navParams : NavParams,private modalController: ModalController) { }

  ngOnInit() {
    this.img = this.navParams.get('photoPath');
    console.log("CLICKED IMG *** "+ this.img);
  }

  zoom(zoomIn: boolean){
    console.log(zoomIn);
    let zoom = this.slider.nativeElement.swiper.zoom;
   console.log(zoom);
    if(zoomIn){
      zoom.in();
    } else{
      zoom.out();
    }
  }
  close(){
      this.modalController.dismiss();
  }

}
