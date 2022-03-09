import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController, NavController, IonSlides } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from "./../app.component";

@Component({
  selector: 'app-categories',
  templateUrl: './zoom.page.html',
  styleUrls: [
    './styles/zoom.page.scss',
    './styles/zoom.shell.scss',
    './styles/zoom.responsive.scss'
  ]
})
export class ZoomPage implements OnInit {
  // @ViewChild('slides') slides: IonSlides;
  @ViewChild('slides', {static: false}) slides: IonSlides;
  images = [];
  allNumber: any;
  currentNumber = 1;
  pagination_label: any;
  currentImageIndex: any;
  
  slidesOptions: any = {
    zoom: {
      toggle: true // Disable zooming to prevent weird double tap zomming on slide images
    }
  };

  constructor(public alertController: AlertController,
    public loadingController: LoadingController, private route: ActivatedRoute,
    public myapp: AppComponent, public navCtrl: NavController) {

    this.route.queryParams.subscribe(params => {
      console.log("params", params);
      this.images = params.images;
      this.currentImageIndex = params.currentImageIndex;
      
    })
  }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.slides.slideTo(this.currentImageIndex, 50);
      // setTimeout(() => {
        // this.slides.slideTo(this.currentImageIndex);
      // });
  }

  ionViewWillEnter(){
    this.slides.length().then(number => {
       this.allNumber = number;
       console.log("allNumber", this.allNumber);
    });
}

  getIndex() {
    this.slides.getActiveIndex().then((index: number) => {
      this.currentNumber = index + 1;
      console.log("currentNumber", this.currentNumber);
  });
}

  goBack() {
    this.navCtrl.pop();
  }
}
