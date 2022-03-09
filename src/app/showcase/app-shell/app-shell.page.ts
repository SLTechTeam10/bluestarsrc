import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CategoriesPage } from "./../../categories/categories.page";

@Component({
  selector: 'app-showcase-shell',
  templateUrl: './app-shell.page.html',
  styleUrls: ['./app-shell.page.scss']
})
export class AppShellPage implements OnInit {

  title = '';

  //Deep Freezer filter selected option array
  deepFreezerCategorySelected = []
  deepFreezerCapacitySelected = []
  deepFreezerDoorsSelected = [];
  deepFreezerRefrigerantSelected = [];

  deepFreezerCategorySelectedLength: any;
  deepFreezerCapacitySelectedLength: any;
  deepFreezerDoorsSelectedLength: any;
  deepFreezerRefrigerantSelectedLength: any;


  //Bottled Water Dispenser filter selected option array
  waterDispenserSeriesSelected = []
  waterDispenserColourSelected = [];
  waterDispenserFaucetsSelected = [];

  waterDispenserSeriesSelectedLength: any;
  waterDispenserColourSelectedLength: any;
  waterDispenserFaucetsSelectedLength: any;


  //Visi Cooler filter selected option array
  visiCoolerSeriesSelected = []
  visiCoolerCapacitySelected = []
  visiCoolerDoorsSelected = [];
  visiCoolerCoolingTypeSelected = [];

  visiCoolerSeriesSelectedLength:any
  visiCoolerCapacitySelectedLength: any;
  visiCoolerDoorsSelectedLength: any;
  visiCoolerCoolingTypeSelectedLength: any;

  //airPurifier filter selected option array
  airPurifierCoverageAreaSelected = [];
  airPurifierCADRSelected = [];
  airPurifierPriceSelected = [];

  airPurifierPriceSelectedLength: any;
  airPurifierCoverageAreaSelectedLength: any;
  airPurifierCADRSelectedLength: any

  //waterPurifie filter selected option array
  waterPurifierTechnologySelected = []
  waterPurifierModelNameSelected = []
  waterPurifierCapacitySelected = []
  waterPurifierPriseSelected = []

  waterPurifierTechnologySelectedLength: any;
  waterPurifierPriseSelectedLength: any;
  waterPurifierCapacitySelectedLength: any;
  waterPurifierModelNameSelectedLength: any;

  //airCooler filter selected option array
  airCoolerTypeSelected = []
  airCoolerPriceSelected = []
  airCoolerCapacitySelected = []

  
  airCoolerTypeSelectedLength: any;
  airCoolerPriceSelectedLength: any;
  airCoolerCapacitySelectedLength: any;

  //airConditioner filter selected option array
  airConditionerSubCategorySelected = []
  airConditionerCapacitySelected = []
  airConditionerSeriesSelected = []
  airConditionerStarRatingSelected = []
  airConditionerPriseSelected = []

  airConditionerSubCategorySelectedLenght: any;
  airConditionerCapacitySelectedLength: any;
  airConditionerSeriesSelectedLength: any;
  airConditionerStarRatingSelectedLength: any;
  airConditionerPriseSelectedLength: any;

  //airConditioner json start
  airConditionerSubCategory = [
    {
      value: "CASSETTE AC",
      flage: false
    },
    {
      value: "INVCASSETTE",
      flage: false
    },
    {
      value: "INVSAC",
      flage: false
    },
    {
      value: "MEGASAC",
      flage: false
    },
    {
      value: "PORTABLEAC",
      flage: false
    },
    {
      value: "SAC",
      flage: false
    },
    {
      value: "VERTICOOLAC",
      flage: false
    },
    {
      value: "WINDOW AC",
      flage: false
    }
  ]

  airConditionerCapacity = [
    {
      value: "0.75",
      flage: false
    },
    {
      value: "1",
      flage: false
    },
    {
      value: "1.5",
      flage: false
    },
    {
      value: "1.8",
      flage: false
    },
    {
      value: "2",
      flage: false
    },
    {
      value: "2.5",
      flage: false
    },
    {
      value: "3",
      flage: false
    },
    {
      value: "4",
      flage: false
    },
  ]

  airConditionerSeries = [
    {
      value: "A Series",
      showValue: "A",
      flage: false
    },
    {
      value: "C Series",
      showValue: "C",
      flage: false
    },
    {
      value: "DA Series",
      showValue: "DA",
      flage: false
    },
    {
      value: "DA-AP Series",
      showValue: "DA-AP",
      flage: false
    },
    {
      value: "DB Series",
      showValue: "DB",
      flage: false
    },
    {
      value: "DC Series",
      showValue: "DC",
      flage: false
    },
    {
      value: "E Series",
      showValue: "E",
      flage: false
    },
    {
      value: "GA Series",
      showValue: "GA",
      flage: false
    },
    {
      value: "GBT Series",
      showValue: "GBT",
      flage: false
    },
    {
      value: "GBTI Series",
      showValue: "GBTI",
      flage: false
    },
    {
      value: "I Series",
      showValue: "I",
      flage: false
    },
    {
      value: "LA Series",
      showValue: "LA",
      flage: false
    },
    {
      value: "LD Series",
      showValue: "LD",
      flage: false
    },
    {
      value: "LDT Series",
      showValue: "LDT",
      flage: false
    },
    {
      value: "M Series",
      showValue: "M",
      flage: false
    },
    {
      value: "P Series",
      showValue: "P",
      flage: false
    },
    {
      value: "QA Series",
      showValue: "QA",
      flage: false
    },
    {
      value: "QB Series",
      showValue: "QB",
      flage: false
    },
    {
      value: "R Series",
      showValue: "R",
      flage: false
    },
    {
      value: "Y Series",
      showValue: "Y",
      flage: false
    },
    {
      value: "YA Series",
      showValue: "YA",
      flage: false
    },
    {
      value: "YB Series",
      showValue: "YB",
      flage: false
    },
    {
      value: "YC Series",
      showValue: "YC",
      flage: false
    },
    {
      value: "YDF Series",
      showValue: "YDF",
      flage: false
    },
    {
      value: "Z Series",
      showValue: "Z",
      flage: false
    },
  ]

  airConditionerStarRating = [
    {
      value: "1 star",
      showValue: "1",
      flage: false
    },
    {
      value: "2 star",
      showValue: "2",
      flage: false
    },
    {
      value: "3 star",
      showValue: "3",
      flage: false
    },
    {
      value: "4 star",
      showValue: "4",
      flage: false
    },
    {
      value: "5 star",
      showValue: "5",
      flage: false
    },
    {
      value: "Non star",
      showValue: "NA",
      flage: false
    }
  ]

  airConditionerMRP = [
    {
      value: "20000-40000",
      showValue: "20,000-40,000",
      flage: false
    },
    {
      value: "40001-50000",
      showValue: "40,001-50,000",
      flage: false
    },
    {
      value: "50001-60000",
      showValue: "50,001-60,000",
      flage: false
    },
    {
      value: "60001-70000",
      showValue: "60,001-70,000",
      flage: false
    },
    {
      value: "70001-99999999",
      showValue: "70,001 and above",
      flage: false
    }
  ]

  //airCooler json Start
  airCoolerType = [
    {
      value: "Personal",
      flage: false
    },
    {
      value: "Tower",
      flage: false
    },
    {
      value: "Window",
      flage: false
    },
    {
      value: "Desert",
      flage: false
    }
  ]
  airCoolerMRP = [
    {
      value: "7000-10000",
      showValue: "7,000-10,000",
      flage: false
    },
    {
      value: "10001-15000",
      showValue: "10,001-15,000",
      flage: false
    },
    {
      value: "15001-20000",
      showValue: "15,001-20,000",
      flage: false
    }
  ]
  airCoolerCapacity = [
    {
      value: "25-50",
      flage: false
    },
    {
      value: "51-70",
      flage: false
    },
    {
      value: "71-90",
      flage: false
    }
  ]

  //airPurifier json Start
  airPurifierMRP = [
    {
      value: "7000-15000",
      showValue: "7,000-15,000",
      flage: false
    },
    {
      value: "15001-20000",
      showValue: "15,001-20,000",
      flage: false
    },
    {
      value: "20001-99999999",
      showValue: "20,001 and above",
      flage: false
    }
  ]

  airPurifierCoverageArea = [
    {
      value: "915",
      flage: false
    },
    {
      value: "545",
      flage: false
    },
    {
      value: "444",
      flage: false
    },
    {
      value: "230",
      flage: false
    }
  ]

  airPurifierCADR = [
    {
      value: "800",
      flage: false
    },
    {
      value: "650",
      flage: false
    },
    {
      value: "300",
      flage: false
    },
    {
      value: "250",
      flage: false
    }
  ]

  //waterPurifie json Start
  waterPurifieTechnology = [
    {
      value: "RO+UV",
      flage: false
    },
    {
      value: "RO+UV+UF",
      flage: false
    },
    {
      value: "UV LED",
      flage: false
    },
    {
      value: "UV",
      flage: false
    },
    {
      value: "RO+UF",
      flage: false
    }
  ]

  waterPurifieMRP = [
    {
      value: "7000-20000",
      showValue: "7,000-20,000",
      flage: false
    },
    {
      value: "20001-30000",
      showValue: "20,001-30,000",
      flage: false
    },
    {
      value: "30001-99999999",
      showValue: "30,001 and above",
      flage: false
    }
  ]

  waterPurifieCapacity = [
    {
      value: "0",
      flage: false
    },
    {
      value: "6",
      flage: false
    },
    {
      value: "7",
      flage: false
    },
    {
      value: "8",
      flage: false
    },
    {
      value: "8.2",
      flage: false
    },
    {
      value: "9.2",
      flage: false
    }
  ]

  waterPurifieModelName = [
    {
      value: "Adora",
      flage: false
    },
    {
      value: "Aristo",
      flage: false
    },
    {
      value: "Eleanor",
      flage: false
    },
    {
      value: "Eternia",
      flage: false
    },
    {
      value: "Genia",
      flage: false
    },
    {
      value: "Iconia",
      flage: false
    },
    {
      value: "Imperia",
      flage: false
    },
    {
      value: "Magnus",
      flage: false
    },
    {
      value: "Opulus",
      flage: false
    },
    {
      value: "Pristina",
      flage: false
    },
    {
      value: "Stella",
      flage: false
    },
  ]


  // Deep Freezer Json Start
  deepFreezerCategory = [
    {
      value: "Chest type - Bottle cooler",
      flage: false
    },
    {
      value: "Chest type - Curved glass top freezer",
      flage: false
    },
    {
      value: "Chest type - Flat glass top freezer",
      flage: false
    },
    {
      value: "Chest type - Hard top freezer",
      flage: false
    },
    {
      value: "Cooler cum freezer",
      flage: false
    }
  ]

  deepFreezerCapacity = [
    {
      value: "0-100",
      flage: false
    },
    {
      value: "101-150",
      flage: false
    },
    {
      value: "150-200",
      flage: false
    },
    {
      value: "201-320",
      flage: false
    },
    {
      value: "321-450",
      flage: false
    },
    {
      value: "451-550",
      flage: false
    },
    {
      value: "551-700",
      flage: false
    }
  ]

  deepFreezerDoors = [
    {
      value: "1",
      flage: false
    },
    {
      value: "2",
      flage: false
    },
    {
      value: "3",
      flage: false
    }
  ]

  deepFreezerRefrigerant = [
    {
      value: "sdsd",
      flage: false
    },
    {
      value: "tytwetyd gysdy @#Wh 5.5",
      flage: false
    }
  ]


  // Bottled Water Dispenser Json Start
  waterDispenserSeries = [
    {
      value: "BOTTOM LOADING",
      flage: false
    },
    {
      value: "GA SERIES",
      flage: false
    },
    {
      value: "GB SERIES",
      flage: false
    },
    {
      value: "GC SERIES",
      flage: false
    },
    {
      value: "Test Water Dispenser 1",
      flage: false
    },
    {
      value: "Test Water Dispenser 2",
      flage: false
    },
    {
      value: "WD Test 19",
      flage: false
    }
  ]

  waterDispenserColour = [
    {
      value: "2",
      flage: false
    },
    {
      value: "Black",
      flage: false
    },
    {
      value: "Grey",
      flage: false
    },
     {
      value: "Maroon",
      flage: false
    },
    {
      value: "Test Water Dispenser 1",
      flage: false
    },
    {
      value: "White",
      flage: false
    },
    {
      value: "White and Maroon",
      flage: false
    },
    {
      value: "red",
      flage: false
    }
  ]

  waterDispenserFaucets = [
    {
      value: "1",
      flage: false
    },
    {
      value: "2",
      flage: false
    },
     {
      value: "3",
      flage: false
    }
  ]


  // Visi Cooler Json Start
  visiCoolerSeries = [
    {
      value: "121212",
      flage: false
    },
    {
      value: "ASAS",
      flage: false
    },
    {
      value: "Test Visicooler 1",
      flage: false
    },
    {
      value: "Test Visicooler 2",
      flage: false
    },
    {
      value: "VC Test 19",
      flage: false
    },
    {
      value: "VC UP 1",
      flage: false
    },
    {
      value: "Visi Cooler",
      flage: false
    },
    {
      value: "Visi Freezer",
      flage: false
    },
    {
      value: "sfsdf",
      flage: false
    }
  ]

  visiCoolerCapacity = [
    {
      value: "0-100",
      flage: false
    },
    {
      value: "101-200",
      flage: false
    },
    {
      value: "201-300",
      flage: false
    },
    {
      value: "301-400",
      flage: false
    },
    {
      value: "401-700",
      flage: false
    },
    {
      value: "701-1000",
      flage: false
    }
  ]

  visiCoolerDoors = [
    {
      value: "1",
      flage: false
    },
    {
      value: "2",
      flage: false
    }
  ]

  visiCoolerCoolingType = [
    {
      value: "Static",
      flage: false
    },
    {
      value: "Ventilated",
      flage: false
    }
  ]







  

  constructor(public modalCtrl: ModalController, public loadingController: LoadingController,
    private route: ActivatedRoute, private http: HttpClient,
    private categoriesPage: CategoriesPage) {
    this.route.queryParams.subscribe(params => {
      this.title = params.title;
      if (params.title == "Air Conditioners") {
        this.getFilterAirConditioner();
      } else if (params.title == "Air Coolers") {
        this.getFilterAirCooler();
      } else if (params.title == "Air Purifiers") {
        this.getFilterAirPurifier();
      } else if (params.title == "Water Purifiers") {
        this.getFilterWaterPurifier();
      } else if (params.title == "Deep Freezer") {
        this.getFilterDeepFreezer();
      } else if (params.title == "Bottled Water Dispenser") {
        this.getFilterBottledWaterDispenser();
      } else if (params.title == "Visi Cooler") {
        this.getFilterVisiCooler();
      }

      
    });
  }

  ngOnInit(): void {
    //this.assignFilterPreveas();
  }

  assignFilterPreveas() {
    if (this.title == "Air Conditioners") {
      if (this.airConditionerSubCategorySelected.length != 0) {
        this.airConditionerSubCategorySelectedLenght = this.airConditionerSubCategorySelected.length;
        for (let item in this.airConditionerSubCategorySelected) {
          for (let i in this.airConditionerSubCategory) {
            if (this.airConditionerSubCategorySelected[item] == this.airConditionerSubCategory[i].value)
              this.airConditionerSubCategory[i].flage = true;
          }
        }
      }
      if (this.airConditionerCapacitySelected.length != 0) {
        this.airConditionerCapacitySelectedLength = this.airConditionerCapacitySelected.length;
        for (let item in this.airConditionerCapacitySelected) {
          for (let i in this.airConditionerCapacity) {
            if (this.airConditionerCapacitySelected[item] == this.airConditionerCapacity[i].value)
              this.airConditionerCapacity[i].flage = true;
          }
        }
      }
      if (this.airConditionerSeriesSelected.length != 0) {
        this.airConditionerSeriesSelectedLength = this.airConditionerSeriesSelected.length;
        for (let item in this.airConditionerSeriesSelected) {
          for (let i in this.airConditionerSeries) {
            if (this.airConditionerSeriesSelected[item] == this.airConditionerSeries[i].value)
              this.airConditionerSeries[i].flage = true;
          }
        }
      }
      if (this.airConditionerStarRatingSelected.length != 0) {
        this.airConditionerStarRatingSelectedLength = this.airConditionerStarRatingSelected.length;
        for (let item in this.airConditionerStarRatingSelected) {
          for (let i in this.airConditionerStarRating) {
            if (this.airConditionerStarRatingSelected[item] == this.airConditionerStarRating[i].value)
              this.airConditionerStarRating[i].flage = true;
          }
        }
      }
      if (this.airConditionerPriseSelected.length != 0) {
        this.airConditionerPriseSelectedLength = this.airConditionerPriseSelected.length;
        for (let item in this.airConditionerPriseSelected) {
          for (let i in this.airConditionerMRP) {
            if (this.airConditionerPriseSelected[item] == this.airConditionerMRP[i].value)
              this.airConditionerMRP[i].flage = true;
          }
        }
      }
    } else if (this.title == "Air Coolers") {
      // console.log("airCoolerTypeSelected", this.airCoolerTypeSelected);
      if (this.airCoolerTypeSelected.length != 0) {
        this.airCoolerTypeSelectedLength = this.airCoolerTypeSelected.length;
        // console.log("***********",this.airCoolerTypeSelectedLength);
        for (let item in this.airCoolerTypeSelected) {
          for (let i in this.airCoolerType) {
            if (this.airCoolerTypeSelected[item] == this.airCoolerType[i].value)
              this.airCoolerType[i].flage = true;
          }
        }
      }
      if (this.airCoolerPriceSelected.length != 0) {
        this.airCoolerPriceSelectedLength = this.airCoolerPriceSelected.length;
        // console.log("***********",this.airCoolerPriceSelectedLength);
        for (let item in this.airCoolerPriceSelected) {
          for (let i in this.airCoolerMRP) {
            if (this.airCoolerPriceSelected[item] == this.airCoolerMRP[i].value)
              this.airCoolerMRP[i].flage = true;
          }
        }
      }
      if (this.airCoolerCapacitySelected.length != 0) {
        this.airCoolerCapacitySelectedLength = this.airCoolerCapacitySelected.length;
        // console.log("***********",this.airCoolerCapacitySelectedLength);
        for (let item in this.airCoolerCapacitySelected) {
          for (let i in this.airCoolerCapacity) {
            if (this.airCoolerCapacitySelected[item] == this.airCoolerCapacity[i].value)
              this.airCoolerCapacity[i].flage = true;
          }
        }
      }
    } else if (this.title == "Air Purifiers") {
      if (this.airPurifierCoverageAreaSelected.length != 0) {
        this.airPurifierCoverageAreaSelectedLength = this.airPurifierCoverageAreaSelected.length;
        for (let item in this.airPurifierCoverageAreaSelected) {
          for (let i in this.airPurifierCoverageArea) {
            if (this.airPurifierCoverageAreaSelected[item] == this.airPurifierCoverageArea[i].value)
              this.airPurifierCoverageArea[i].flage = true;
          }
        }
      }
      if (this.airPurifierCADRSelected.length != 0) {
        this.airPurifierCADRSelectedLength = this.airPurifierCADRSelected.length;
        for (let item in this.airPurifierCADRSelected) {
          for (let i in this.airPurifierCADR) {
            if (this.airPurifierCADRSelected[item] == this.airPurifierCADR[i].value)
              this.airPurifierCADR[i].flage = true;
          }
        }
      }
      if (this.airPurifierPriceSelected.length != 0) {
        this.airPurifierPriceSelectedLength = this.airPurifierPriceSelected.length;
        for (let item in this.airPurifierPriceSelected) {
          for (let i in this.airPurifierMRP) {
            if (this.airPurifierPriceSelected[item] == this.airPurifierMRP[i].value)
              this.airPurifierMRP[i].flage = true;
          }
        }
      }
    } else if (this.title == "Water Purifiers") {
      if (this.waterPurifierTechnologySelected.length != 0) {
        this.waterPurifierTechnologySelectedLength = this.waterPurifierTechnologySelected.length;
        for (let item in this.waterPurifierTechnologySelected) {
          for (let i in this.waterPurifieTechnology) {
            if (this.waterPurifierTechnologySelected[item] == this.waterPurifieTechnology[i].value)
              this.waterPurifieTechnology[i].flage = true;
          }
        }
      }
      if (this.waterPurifierModelNameSelected.length != 0) {
        this.waterPurifierModelNameSelectedLength = this.waterPurifierModelNameSelected.length;
        for (let item in this.waterPurifierModelNameSelected) {
          for (let i in this.waterPurifieModelName) {
            if (this.waterPurifierModelNameSelected[item] == this.waterPurifieModelName[i].value)
              this.waterPurifieModelName[i].flage = true;
          }
        }
      }
      if (this.waterPurifierCapacitySelected.length != 0) {
        this.waterPurifierCapacitySelectedLength = this.waterPurifierCapacitySelected.length;
        for (let item in this.waterPurifierCapacitySelected) {
          for (let i in this.waterPurifieCapacity) {
            if (this.waterPurifierCapacitySelected[item] == this.waterPurifieCapacity[i].value)
              this.waterPurifieCapacity[i].flage = true;
          }
        }
      }
      if (this.waterPurifierPriseSelected.length != 0) {
        this.waterPurifierPriseSelectedLength = this.waterPurifierPriseSelected.length;
        for (let item in this.waterPurifierPriseSelected) {
          for (let i in this.waterPurifieMRP) {
            if (this.waterPurifierPriseSelected[item] == this.waterPurifieMRP[i].value)
              this.waterPurifieMRP[i].flage = true;
          }
        }
      }
    } else if (this.title == "Deep Freezer") {
      if (this.deepFreezerCategorySelected.length != 0) {
        this.deepFreezerCategorySelectedLength = this.deepFreezerCategorySelected.length;
        for (let item in this.deepFreezerCategorySelected) {
          for (let i in this.deepFreezerCategory) {
            if (this.deepFreezerCategorySelected[item] == this.deepFreezerCategory[i].value)
              this.deepFreezerCategory[i].flage = true;
          }
        }
      }
      if (this.deepFreezerCapacitySelected.length != 0) {
        this.deepFreezerCapacitySelectedLength = this.deepFreezerCapacitySelected.length;
        for (let item in this.deepFreezerCapacitySelected) {
          for (let i in this.deepFreezerCapacity) {
            if (this.deepFreezerCapacitySelected[item] == this.deepFreezerCapacity[i].value)
              this.deepFreezerCapacity[i].flage = true;
          }
        }
      }
      if (this.deepFreezerDoorsSelected.length != 0) {
        this.deepFreezerDoorsSelectedLength = this.deepFreezerDoorsSelected.length;
        for (let item in this.deepFreezerDoorsSelected) {
          for (let i in this.deepFreezerDoors) {
            if (this.deepFreezerDoorsSelected[item] == this.deepFreezerDoors[i].value)
              this.deepFreezerDoors[i].flage = true;
          }
        }
      }
      if (this.deepFreezerRefrigerantSelected.length != 0) {
        this.deepFreezerRefrigerantSelectedLength = this.deepFreezerRefrigerantSelected.length;
        for (let item in this.deepFreezerRefrigerantSelected) {
          for (let i in this.deepFreezerRefrigerant) {
            if (this.deepFreezerRefrigerantSelected[item] == this.deepFreezerRefrigerant[i].value)
              this.deepFreezerRefrigerant[i].flage = true;
          }
        }
      }
    } else if (this.title == "Bottled Water Dispenser") {
      if (this.waterDispenserSeriesSelected.length != 0) {
        this.waterDispenserSeriesSelectedLength = this.waterDispenserSeriesSelected.length;
        for (let item in this.waterDispenserSeriesSelected) {
          for (let i in this.waterDispenserSeries) {
            if (this.waterDispenserSeriesSelected[item] == this.waterDispenserSeries[i].value)
              this.waterDispenserSeries[i].flage = true;
          }
        }
      }
      if (this.waterDispenserColourSelected.length != 0) {
        this.waterDispenserColourSelectedLength = this.waterDispenserColourSelected.length;
        for (let item in this.waterDispenserColourSelected) {
          for (let i in this.waterDispenserColour) {
            if (this.waterDispenserColourSelected[item] == this.waterDispenserColour[i].value)
              this.waterDispenserColour[i].flage = true;
          }
        }
      }
      if (this.waterDispenserFaucetsSelected.length != 0) {
        this.waterDispenserFaucetsSelectedLength = this.waterDispenserFaucetsSelected.length;
        for (let item in this.waterDispenserFaucetsSelected) {
          for (let i in this.waterDispenserFaucets) {
            if (this.waterDispenserFaucetsSelected[item] == this.waterDispenserFaucets[i].value)
              this.waterDispenserFaucets[i].flage = true;
          }
        }
      }
    } else if (this.title == "Visi Cooler") {
      if (this.visiCoolerSeriesSelected.length != 0) {
        this.visiCoolerSeriesSelectedLength = this.visiCoolerSeriesSelected.length;
        for (let item in this.visiCoolerSeriesSelected) {
          for (let i in this.visiCoolerSeries) {
            if (this.visiCoolerSeriesSelected[item] == this.visiCoolerSeries[i].value)
              this.visiCoolerSeries[i].flage = true;
          }
        }
      }
      if (this.visiCoolerCapacitySelected.length != 0) {
        this.visiCoolerCapacitySelectedLength = this.visiCoolerCapacitySelected.length;
        for (let item in this.visiCoolerCapacitySelected) {
          for (let i in this.visiCoolerCapacity) {
            if (this.visiCoolerCapacitySelected[item] == this.visiCoolerCapacity[i].value)
              this.visiCoolerCapacity[i].flage = true;
          }
        }
      }
      if (this.visiCoolerDoorsSelected.length != 0) {
        this.visiCoolerDoorsSelectedLength = this.visiCoolerDoorsSelected.length;
        for (let item in this.visiCoolerDoorsSelected) {
          for (let i in this.visiCoolerDoors) {
            if (this.visiCoolerDoorsSelected[item] == this.visiCoolerDoors[i].value)
              this.visiCoolerDoors[i].flage = true;
          }
        }
      }
      if (this.visiCoolerCoolingTypeSelected.length != 0) {
        this.visiCoolerCoolingTypeSelectedLength = this.visiCoolerCoolingTypeSelected.length;
        for (let item in this.visiCoolerCoolingTypeSelected) {
          for (let i in this.visiCoolerCoolingType) {
            if (this.visiCoolerCoolingTypeSelected[item] == this.visiCoolerCoolingType[i].value)
              this.visiCoolerCoolingType[i].flage = true;
          }
        }
      }
    }

  }

  clearFilter() {
    if (this.title == "Air Conditioners") {
      this.airConditionerSubCategorySelected = []
      this.airConditionerCapacitySelected = []
      this.airConditionerSeriesSelected = []
      this.airConditionerStarRatingSelected = []
      this.airConditionerPriseSelected = []

      this.airConditionerSubCategorySelectedLenght = 0;
      this.airConditionerCapacitySelectedLength = 0;
      this.airConditionerSeriesSelectedLength = 0;
      this.airConditionerStarRatingSelectedLength = 0;
      this.airConditionerPriseSelectedLength = 0;

      for (let i in this.airConditionerSubCategory) {
        this.airConditionerSubCategory[i].flage = false;
      }
      for (let i in this.airConditionerCapacity) {
        this.airConditionerCapacity[i].flage = false;
      }
      for (let i in this.airConditionerSeries) {
        this.airConditionerSeries[i].flage = false;
      }
      for (let i in this.airConditionerStarRating) {
        this.airConditionerStarRating[i].flage = false;
      }
      for (let i in this.airConditionerMRP) {
        this.airConditionerMRP[i].flage = false;
      }
    } else if (this.title == "Air Coolers") {
      this.airCoolerTypeSelected = []
      this.airCoolerPriceSelected = []
      this.airCoolerCapacitySelected = []

      this.airCoolerTypeSelectedLength = 0;
      this.airCoolerPriceSelectedLength = 0;
      this.airCoolerCapacitySelectedLength = 0;
       
      for (let i in this.airCoolerType) {
        this.airCoolerType[i].flage = false;
      }
      for (let i in this.airCoolerMRP) {
        this.airCoolerMRP[i].flage = false;
      }
      for (let i in this.airCoolerCapacity) {
        this.airCoolerCapacity[i].flage = false;
      }
      // console.log("airCoolerTypeSelected", this.airCoolerTypeSelected);
    } else if (this.title == "Air Purifiers") {
      this.airPurifierCoverageAreaSelected = [];
      this.airPurifierCADRSelected = [];
      this.airPurifierPriceSelected = [];

      this.airPurifierPriceSelectedLength = 0;
      this.airPurifierCoverageAreaSelectedLength = 0;
      this.airPurifierCADRSelectedLength = 0;

      for (let i in this.airPurifierCoverageArea) {
        this.airPurifierCoverageArea[i].flage = false;
      }
      for (let i in this.airPurifierCADR) {
        this.airPurifierCADR[i].flage = false;
      }
      for (let i in this.airPurifierMRP) {
        this.airPurifierMRP[i].flage = false;
      }
    } else if (this.title == "Water Purifiers") {
      this.waterPurifierTechnologySelected = []
      this.waterPurifierModelNameSelected = []
      this.waterPurifierCapacitySelected = []
      this.waterPurifierPriseSelected = []

      this.waterPurifierTechnologySelectedLength = 0;
      this.waterPurifierPriseSelectedLength = 0;
      this.waterPurifierCapacitySelectedLength = 0;
      this.waterPurifierModelNameSelectedLength = 0;

      for (let i in this.waterPurifieTechnology) {
        this.waterPurifieTechnology[i].flage = false;
      }
      for (let i in this.waterPurifieModelName) {
        this.waterPurifieModelName[i].flage = false;
      }
      for (let i in this.waterPurifieCapacity) {
        this.waterPurifieCapacity[i].flage = false;
      }
      for (let i in this.waterPurifieMRP) {
        this.waterPurifieMRP[i].flage = false;
      }
    } else if (this.title == "Deep Freezer") {
      this.deepFreezerCategorySelected = [];
      this.deepFreezerCapacitySelected = [];
      this.deepFreezerDoorsSelected = [];
      this.deepFreezerRefrigerantSelected = [];

      this.deepFreezerCategorySelectedLength = 0;
      this.deepFreezerCapacitySelectedLength = 0;
      this.deepFreezerDoorsSelectedLength = 0;
      this.deepFreezerRefrigerantSelectedLength = 0;

      for (let i in this.deepFreezerCategory) {
        this.deepFreezerCategory[i].flage = false;
      }
      for (let i in this.deepFreezerCapacity) {
        this.deepFreezerCapacity[i].flage = false;
      }
      for (let i in this.deepFreezerDoors) {
        this.deepFreezerDoors[i].flage = false;
      }
      for (let i in this.deepFreezerRefrigerant) {
        this.deepFreezerRefrigerant[i].flage = false;
      }
    } else if (this.title == "Bottled Water Dispenser") {
      this.waterDispenserSeriesSelected = []
      this.waterDispenserColourSelected = [];
      this.waterDispenserFaucetsSelected = [];

      this.waterDispenserSeriesSelectedLength = 0;
      this.waterDispenserColourSelectedLength = 0;
      this.waterDispenserFaucetsSelectedLength = 0;

      for (let i in this.waterDispenserSeries) {
        this.waterDispenserSeries[i].flage = false;
      }
      for (let i in this.waterDispenserColour) {
        this.waterDispenserColour[i].flage = false;
      }
      for (let i in this.waterDispenserFaucets) {
        this.waterDispenserFaucets[i].flage = false;
      }
    } else if (this.title == "Visi Cooler") {
      this.visiCoolerSeriesSelected = []
      this.visiCoolerCapacitySelected = []
      this.visiCoolerDoorsSelected = [];
      this.visiCoolerCoolingTypeSelected = [];

      this.visiCoolerSeriesSelectedLength = 0;
      this.visiCoolerCapacitySelectedLength = 0;
      this.visiCoolerDoorsSelectedLength = 0;
      this.visiCoolerCoolingTypeSelectedLength = 0;

      for (let i in this.visiCoolerSeries) {
        this.visiCoolerSeries[i].flage = false;
      }
      for (let i in this.visiCoolerCapacity) {
        this.visiCoolerCapacity[i].flage = false;
      }
      for (let i in this.visiCoolerDoors) {
        this.visiCoolerDoors[i].flage = false;
      }
      for (let i in this.visiCoolerCoolingType) {
        this.visiCoolerCoolingType[i].flage = false;
      }
    }

  }

  closeModal() {
    if (this.title == "Air Conditioners") {
      let data = {
        close: "true",
        airConditionerSubCategorySelected: this.airConditionerSubCategorySelected,
        airConditionerCapacitySelected: this.airConditionerCapacitySelected,
        airConditionerSeriesSelected: this.airConditionerSeriesSelected,
        airConditionerStarRatingSelected: this.airConditionerStarRatingSelected,
        airConditionerPriseSelected: this.airConditionerPriseSelected,
      };
      this.modalCtrl.dismiss(data);
    } else if (this.title == "Air Coolers") {
      let data = {
        close: "true",
        airCoolerTypeSelected: this.airCoolerTypeSelected,
        airCoolerPriceSelected: this.airCoolerPriceSelected,
        airCoolerCapacitySelected: this.airCoolerCapacitySelected,
      };
      this.modalCtrl.dismiss(data);
    } else if (this.title == "Air Purifiers") {
      let data = {
        close: "true",
        airPurifierCoverageAreaSelected: this.airPurifierCoverageAreaSelected,
        airPurifierCADRSelected: this.airPurifierCADRSelected,
        airPurifierPriceSelected: this.airPurifierPriceSelected,
      };
      this.modalCtrl.dismiss(data);
    } else if (this.title == "Water Purifiers") {
      let data = {
        close: "true",
        waterPurifierTechnologySelected: this.waterPurifierTechnologySelected,
        waterPurifierModelNameSelected: this.waterPurifierModelNameSelected,
        waterPurifierCapacitySelected: this.waterPurifierCapacitySelected,
        waterPurifierPriseSelected: this.waterPurifierPriseSelected,
      };
      this.modalCtrl.dismiss(data);
    } else if (this.title == "Deep Freezer") {
      let data = {
        close: "true",
        deepFreezerCategorySelected: this.deepFreezerCategorySelected,
        deepFreezerCapacitySelected: this.deepFreezerCapacitySelected,
        deepFreezerDoorsSelected: this.deepFreezerDoorsSelected,
        deepFreezerRefrigerantSelected: this.deepFreezerRefrigerantSelected,
      };
      this.modalCtrl.dismiss(data);
    } else if (this.title == "Bottled Water Dispenser") {
      let data = {
        close: "true",
        waterDispenserSeriesSelected: this.waterDispenserSeriesSelected,
        waterDispenserColourSelected: this.waterDispenserColourSelected,
        waterDispenserFaucetsSelected: this.waterDispenserFaucetsSelected,
      };
      this.modalCtrl.dismiss(data);
    } else if (this.title == "Visi Cooler") {
      let data = {
        close: "true",
        visiCoolerSeriesSelected: this.visiCoolerSeriesSelected,
        visiCoolerCapacitySelected: this.visiCoolerCapacitySelected,
        visiCoolerDoorsSelected: this.visiCoolerDoorsSelected,
        visiCoolerCoolingTypeSelected: this.visiCoolerCoolingTypeSelected,
      };
      this.modalCtrl.dismiss(data);
    }

  }

  onClickApply() {
    if (this.title == "Air Conditioners") {
      let data = {
        SubCategory: "",
        Capacity: "",
        Series: "",
        StarRating: "",
        Price: "",
        close: "false",
        airConditionerSubCategorySelected: this.airConditionerSubCategorySelected,
        airConditionerCapacitySelected: this.airConditionerCapacitySelected,
        airConditionerSeriesSelected: this.airConditionerSeriesSelected,
        airConditionerStarRatingSelected: this.airConditionerStarRatingSelected,
        airConditionerPriseSelected: this.airConditionerPriseSelected
      };

      if (this.airConditionerPriseSelected.length == 0) {
        data.Price = ""
      } else {
        let stringValue = ""
        for (let index in this.airConditionerPriseSelected) {
          if (stringValue.length == 0) {
            stringValue = "'" + this.airConditionerPriseSelected[index] + "'"
          } else {
            stringValue = stringValue + "," + "'" + this.airConditionerPriseSelected[index] + "'"
          }
        }
        data.Price = stringValue
      }

      if (this.airConditionerStarRatingSelected.length == 0) {
        data.StarRating = ""
      } else {
        let stringValue = ""
        for (let index in this.airConditionerStarRatingSelected) {
          if (stringValue.length == 0) {
            stringValue = "'" + this.airConditionerStarRatingSelected[index] + "'"
          } else {
            stringValue = stringValue + "," + "'" + this.airConditionerStarRatingSelected[index] + "'"
          }
        }
        data.StarRating = stringValue
      }

      if (this.airConditionerSeriesSelected.length == 0) {
        data.Series = ""
      } else {
        let stringValue = ""
        for (let index in this.airConditionerSeriesSelected) {
          if (stringValue.length == 0) {
            stringValue = "'" + this.airConditionerSeriesSelected[index] + "'"
          } else {
            stringValue = stringValue + "," + "'" + this.airConditionerSeriesSelected[index] + "'"
          }
        }
        data.Series = stringValue
      }

      if (this.airConditionerSubCategorySelected.length == 0) {
        data.SubCategory = ""
      } else {
        let stringValue = ""
        for (let index in this.airConditionerSubCategorySelected) {
          if (stringValue.length == 0) {
            stringValue = "'" + this.airConditionerSubCategorySelected[index] + "'"
          } else {
            stringValue = stringValue + "," + "'" + this.airConditionerSubCategorySelected[index] + "'"
          }
        }
        data.SubCategory = stringValue
      }

      if (this.airConditionerCapacitySelected.length == 0) {
        data.Capacity = ""
      } else {
        let stringValue = ""
        for (let index in this.airConditionerCapacitySelected) {
          if (stringValue.length == 0) {
            stringValue = "'" + this.airConditionerCapacitySelected[index] + "'"
          } else {
            stringValue = stringValue + "," + "'" + this.airConditionerCapacitySelected[index] + "'"
          }
        }
        data.Capacity = stringValue
      }
      this.modalCtrl.dismiss(data);
    } else if (this.title == "Air Coolers") {
      let data = {
        Type: "",
        Price: "",
        Capacity: "",
        close: "false",
        airCoolerTypeSelected: this.airCoolerTypeSelected,
        airCoolerPriceSelected: this.airCoolerPriceSelected,
        airCoolerCapacitySelected: this.airCoolerCapacitySelected
      };

      if (this.airCoolerCapacitySelected.length == 0) {
        data.Capacity = ""
      } else {
        let stringValue = ""
        for (let index in this.airCoolerCapacitySelected) {
          if (stringValue.length == 0) {
            stringValue = "'" + this.airCoolerCapacitySelected[index] + "'"
          } else {
            stringValue = stringValue + "," + "'" + this.airCoolerCapacitySelected[index] + "'"
          }
        }
        data.Capacity = stringValue
      }

      if (this.airCoolerPriceSelected.length == 0) {
        data.Price = ""
      } else {
        let stringValue = ""
        for (let index in this.airCoolerPriceSelected) {
          if (stringValue.length == 0) {
            stringValue = "'" + this.airCoolerPriceSelected[index] + "'"
          } else {
            stringValue = stringValue + "," + "'" + this.airCoolerPriceSelected[index] + "'"
          }
        }
        data.Price = stringValue
      }

      if (this.airCoolerTypeSelected.length == 0) {
        data.Type = ""
      } else {
        let stringValue = ""
        for (let index in this.airCoolerTypeSelected) {
          if (stringValue.length == 0) {
            stringValue = "'" + this.airCoolerTypeSelected[index] + "'"
          } else {
            stringValue = stringValue + "," + "'" + this.airCoolerTypeSelected[index] + "'"
          }
        }
        data.Type = stringValue
      }
      this.modalCtrl.dismiss(data);
    } else if (this.title == "Air Purifiers") {
      let data = {
        CADR: "",
        CoverageArea: "",
        Price: "",
        close: "false",
        airPurifierCADRSelected: this.airPurifierCADRSelected,
        airPurifierCoverageAreaSelected: this.airPurifierCoverageAreaSelected,
        airPurifierPriceSelected: this.airPurifierPriceSelected
      };
      if (this.airPurifierCADRSelected.length == 0) {
        data.CADR = ""
      } else {
        let stringValue = ""
        for (let index in this.airPurifierCADRSelected) {
          if (stringValue.length == 0) {
            stringValue = "'" + this.airPurifierCADRSelected[index] + "'"
          } else {
            stringValue = stringValue + "," + "'" + this.airPurifierCADRSelected[index] + "'"
          }
        }
        data.CADR = stringValue
      }

      if (this.airPurifierCoverageAreaSelected.length == 0) {
        data.CoverageArea = ""
      } else {
        let stringValue = ""
        for (let index in this.airPurifierCoverageAreaSelected) {
          if (stringValue.length == 0) {
            stringValue = "'" + this.airPurifierCoverageAreaSelected[index] + "'"
          } else {
            stringValue = stringValue + "," + "'" + this.airPurifierCoverageAreaSelected[index] + "'"
          }
        }
        data.CoverageArea = stringValue
      }

      if (this.airPurifierPriceSelected.length == 0) {
        data.Price = ""
      } else {
        let stringValue = ""
        for (let index in this.airPurifierPriceSelected) {
          if (stringValue.length == 0) {
            stringValue = "'" + this.airPurifierPriceSelected[index] + "'"
          } else {
            stringValue = stringValue + "," + "'" + this.airPurifierPriceSelected[index] + "'"
          }
        }
        data.Price = stringValue
      }
      this.modalCtrl.dismiss(data);
    } else if (this.title == "Water Purifiers") {
      let data = {
        Technology: "",
        ModelName: "",
        Capacity: "",
        Price: "",
        close: "false",
        waterPurifierTechnologySelected: this.waterPurifierTechnologySelected,
        waterPurifierModelNameSelected: this.waterPurifierModelNameSelected,
        waterPurifierCapacitySelected: this.waterPurifierCapacitySelected,
        waterPurifierPriseSelected: this.waterPurifierPriseSelected
      };

      if (this.waterPurifierTechnologySelected.length == 0) {
        data.Technology = ""
      } else {
        let stringValue = ""
        for (let index in this.waterPurifierTechnologySelected) {
          if (stringValue.length == 0) {
            stringValue = "'" + this.waterPurifierTechnologySelected[index] + "'"
          } else {
            stringValue = stringValue + "," + "'" + this.waterPurifierTechnologySelected[index] + "'"
          }
        }
        data.Technology = stringValue
      }

      if (this.waterPurifierModelNameSelected.length == 0) {
        data.ModelName = ""
      } else {
        let stringValue = ""
        for (let index in this.waterPurifierModelNameSelected) {
          if (stringValue.length == 0) {
            stringValue = "'" + this.waterPurifierModelNameSelected[index] + "'"
          } else {
            stringValue = stringValue + "," + "'" + this.waterPurifierModelNameSelected[index] + "'"
          }
        }
        data.ModelName = stringValue
      }

      if (this.waterPurifierCapacitySelected.length == 0) {
        data.Capacity = ""
      } else {
        let stringValue = ""
        for (let index in this.waterPurifierCapacitySelected) {
          if (stringValue.length == 0) {
            stringValue = "'" + this.waterPurifierCapacitySelected[index] + "'"
          } else {
            stringValue = stringValue + "," + "'" + this.waterPurifierCapacitySelected[index] + "'"
          }
        }
        data.Capacity = stringValue
      }

      if (this.waterPurifierPriseSelected.length == 0) {
        data.Price = ""
      } else {
        let stringValue = ""
        for (let index in this.waterPurifierPriseSelected) {
          if (stringValue.length == 0) {
            stringValue = "'" + this.waterPurifierPriseSelected[index] + "'"
          } else {
            stringValue = stringValue + "," + "'" + this.waterPurifierPriseSelected[index] + "'"
          }
        }
        data.Price = stringValue
      }

      this.modalCtrl.dismiss(data);
    } else if (this.title == "Deep Freezer") {
      let data = {
        Category: "",
        Capacity: "",
        Doors: "",
        Refrigerant: "",
        close: "false",
        deepFreezerCategorySelected: this.deepFreezerCategorySelected,
        deepFreezerCapacitySelected: this.deepFreezerCapacitySelected,
        deepFreezerDoorsSelected: this.deepFreezerDoorsSelected,
        deepFreezerRefrigerantSelected: this.deepFreezerRefrigerantSelected
      };

      if (this.deepFreezerCategorySelected.length == 0) {
        data.Category = ""
      } else {
        let stringValue = ""
        for (let index in this.deepFreezerCategorySelected) {
          if (stringValue.length == 0) {
            stringValue = "'" + this.deepFreezerCategorySelected[index] + "'"
          } else {
            stringValue = stringValue + "," + "'" + this.deepFreezerCategorySelected[index] + "'"
          }
        }
        data.Category = stringValue
      }

      if (this.deepFreezerCapacitySelected.length == 0) {
        data.Capacity = ""
      } else {
        let stringValue = ""
        for (let index in this.deepFreezerCapacitySelected) {
          if (stringValue.length == 0) {
            stringValue = "'" + this.deepFreezerCapacitySelected[index] + "'"
          } else {
            stringValue = stringValue + "," + "'" + this.deepFreezerCapacitySelected[index] + "'"
          }
        }
        data.Capacity = stringValue
      }

      if (this.deepFreezerDoorsSelected.length == 0) {
        data.Doors = ""
      } else {
        let stringValue = ""
        for (let index in this.deepFreezerDoorsSelected) {
          if (stringValue.length == 0) {
            stringValue = "'" + this.deepFreezerDoorsSelected[index] + "'"
          } else {
            stringValue = stringValue + "," + "'" + this.deepFreezerDoorsSelected[index] + "'"
          }
        }
        data.Doors = stringValue
      }

      if (this.deepFreezerRefrigerantSelected.length == 0) {
        data.Refrigerant = ""
      } else {
        let stringValue = ""
        for (let index in this.deepFreezerRefrigerantSelected) {
          if (stringValue.length == 0) {
            stringValue = "'" + this.deepFreezerRefrigerantSelected[index] + "'"
          } else {
            stringValue = stringValue + "," + "'" + this.deepFreezerRefrigerantSelected[index] + "'"
          }
        }
        data.Refrigerant = stringValue
      }
      this.modalCtrl.dismiss(data);
    } else if (this.title == "Bottled Water Dispenser") {
      let data = {
        Series: "",
        Colour: "",
        Faucets: "",
        close: "false",
        waterDispenserSeriesSelected: this.waterDispenserSeriesSelected,
        waterDispenserColourSelected: this.waterDispenserColourSelected,
        waterDispenserFaucetsSelected: this.waterDispenserFaucetsSelected
      };
      if (this.waterDispenserSeriesSelected.length == 0) {
        data.Series = ""
      } else {
        let stringValue = ""
        for (let index in this.waterDispenserSeriesSelected) {
          if (stringValue.length == 0) {
            stringValue = "'" + this.waterDispenserSeriesSelected[index] + "'"
          } else {
            stringValue = stringValue + "," + "'" + this.waterDispenserSeriesSelected[index] + "'"
          }
        }
        data.Series = stringValue
      }

      if (this.waterDispenserColourSelected.length == 0) {
        data.Colour = ""
      } else {
        let stringValue = ""
        for (let index in this.waterDispenserColourSelected) {
          if (stringValue.length == 0) {
            stringValue = "'" + this.waterDispenserColourSelected[index] + "'"
          } else {
            stringValue = stringValue + "," + "'" + this.waterDispenserColourSelected[index] + "'"
          }
        }
        data.Colour = stringValue
      }

      if (this.waterDispenserFaucetsSelected.length == 0) {
        data.Faucets = ""
      } else {
        let stringValue = ""
        for (let index in this.waterDispenserFaucetsSelected) {
          if (stringValue.length == 0) {
            stringValue = "'" + this.waterDispenserFaucetsSelected[index] + "'"
          } else {
            stringValue = stringValue + "," + "'" + this.waterDispenserFaucetsSelected[index] + "'"
          }
        }
        data.Faucets = stringValue
      }
      this.modalCtrl.dismiss(data);
    } else if (this.title == "Visi Cooler") {
      let data = {
        Series: "",
        Capacity: "",
        Doors: "",
        CoolingType: "",
        close: "false",
        visiCoolerSeriesSelected: this.visiCoolerSeriesSelected,
        visiCoolerCapacitySelected: this.visiCoolerCapacitySelected,
        visiCoolerDoorsSelected: this.visiCoolerDoorsSelected,
        visiCoolerCoolingTypeSelected: this.visiCoolerCoolingTypeSelected
      };

      if (this.visiCoolerSeriesSelected.length == 0) {
        data.Series = ""
      } else {
        let stringValue = ""
        for (let index in this.visiCoolerSeriesSelected) {
          if (stringValue.length == 0) {
            stringValue = "'" + this.visiCoolerSeriesSelected[index] + "'"
          } else {
            stringValue = stringValue + "," + "'" + this.visiCoolerSeriesSelected[index] + "'"
          }
        }
        data.Series = stringValue
      }

      if (this.visiCoolerCapacitySelected.length == 0) {
        data.Capacity = ""
      } else {
        let stringValue = ""
        for (let index in this.visiCoolerCapacitySelected) {
          if (stringValue.length == 0) {
            stringValue = "'" + this.visiCoolerCapacitySelected[index] + "'"
          } else {
            stringValue = stringValue + "," + "'" + this.visiCoolerCapacitySelected[index] + "'"
          }
        }
        data.Capacity = stringValue
      }

      if (this.visiCoolerDoorsSelected.length == 0) {
        data.Doors = ""
      } else {
        let stringValue = ""
        for (let index in this.visiCoolerDoorsSelected) {
          if (stringValue.length == 0) {
            stringValue = "'" + this.visiCoolerDoorsSelected[index] + "'"
          } else {
            stringValue = stringValue + "," + "'" + this.visiCoolerDoorsSelected[index] + "'"
          }
        }
        data.Doors = stringValue
      }

      if (this.visiCoolerCoolingTypeSelected.length == 0) {
        data.CoolingType = ""
      } else {
        let stringValue = ""
        for (let index in this.visiCoolerCoolingTypeSelected) {
          if (stringValue.length == 0) {
            stringValue = "'" + this.visiCoolerCoolingTypeSelected[index] + "'"
          } else {
            stringValue = stringValue + "," + "'" + this.visiCoolerCoolingTypeSelected[index] + "'"
          }
        }
        data.CoolingType = stringValue
      }
      this.modalCtrl.dismiss(data);
    }

  }


  // Seperate function Start
  clockOnAirPurifierCADR(value) {
    for (let i in this.airPurifierCADR) {
      if (this.airPurifierCADR[i].value == value) {
        this.airPurifierCADR[i].flage = !this.airPurifierCADR[i].flage
      }
    }
    if (this.airPurifierCADRSelected.length == 0) {
      this.airPurifierCADRSelected.push(value);
      this.airPurifierCADRSelectedLength = this.airPurifierCADRSelected.length;
    } else {
      let count = 0
      let removeItemIndex = 0;
      for (let index in this.airPurifierCADRSelected) {
        if (this.airPurifierCADRSelected[index] == value) {
          count = 1
          removeItemIndex = Number(index)
        }
      }
      if (count == 0) {
        this.airPurifierCADRSelected.push(value);
        this.airPurifierCADRSelectedLength = this.airPurifierCADRSelected.length;
      } else {
        this.airPurifierCADRSelected.splice(removeItemIndex, 1);
        this.airPurifierCADRSelectedLength = this.airPurifierCADRSelected.length;
      }
    }
  }

  clickOnAirPurifierCoverageArea(value) {
    for (let i in this.airPurifierCoverageArea) {
      if (this.airPurifierCoverageArea[i].value == value) {
        this.airPurifierCoverageArea[i].flage = !this.airPurifierCoverageArea[i].flage
      }
    }
    if (this.airPurifierCoverageAreaSelected.length == 0) {
      this.airPurifierCoverageAreaSelected.push(value);
      this.airPurifierCoverageAreaSelectedLength = this.airPurifierCoverageAreaSelected.length;
    } else {
      let count = 0
      let removeItemIndex = 0;
      for (let index in this.airPurifierCoverageAreaSelected) {
        if (this.airPurifierCoverageAreaSelected[index] == value) {
          count = 1
          removeItemIndex = Number(index)
        }
      }
      if (count == 0) {
        this.airPurifierCoverageAreaSelected.push(value);
        this.airPurifierCoverageAreaSelectedLength = this.airPurifierCoverageAreaSelected.length;
      } else {
        this.airPurifierCoverageAreaSelected.splice(removeItemIndex, 1);
        this.airPurifierCoverageAreaSelectedLength = this.airPurifierCoverageAreaSelected.length;
      }
    }
  }

  clickOnAirPurifierPrice(value) {
    for (let i in this.airPurifierMRP) {
      if (this.airPurifierMRP[i].value == value) {
        this.airPurifierMRP[i].flage = !this.airPurifierMRP[i].flage
      }
    }
    if (this.airPurifierPriceSelected.length == 0) {
      this.airPurifierPriceSelected.push(value);
      this.airPurifierPriceSelectedLength = this.airPurifierPriceSelected.length;
    } else {
      let count = 0
      let removeItemIndex = 0;
      for (let index in this.airPurifierPriceSelected) {
        if (this.airPurifierPriceSelected[index] == value) {
          count = 1
          removeItemIndex = Number(index)
        }
      }
      if (count == 0) {
        this.airPurifierPriceSelected.push(value);
        this.airPurifierPriceSelectedLength = this.airPurifierPriceSelected.length;
      } else {
        this.airPurifierPriceSelected.splice(removeItemIndex, 1);
        this.airPurifierPriceSelectedLength = this.airPurifierPriceSelected.length;
      }
    }
  }


  // Water purifier start
  clickOnWaterPurifierTechnology(value) {
    for (let i in this.waterPurifieTechnology) {
      if (this.waterPurifieTechnology[i].value == value) {
        this.waterPurifieTechnology[i].flage = !this.waterPurifieTechnology[i].flage
      }
    }
    if (this.waterPurifierTechnologySelected.length == 0) {
      this.waterPurifierTechnologySelected.push(value);
      this.waterPurifierTechnologySelectedLength = this.waterPurifierTechnologySelected.length;
    } else {
      let count = 0
      let removeItemIndex = 0;
      for (let index in this.waterPurifierTechnologySelected) {
        if (this.waterPurifierTechnologySelected[index] == value) {
          count = 1
          removeItemIndex = Number(index)
        }
      }
      if (count == 0) {
        this.waterPurifierTechnologySelected.push(value);
        this.waterPurifierTechnologySelectedLength = this.waterPurifierTechnologySelected.length;
      } else {
        this.waterPurifierTechnologySelected.splice(removeItemIndex, 1);
        this.waterPurifierTechnologySelectedLength = this.waterPurifierTechnologySelected.length;
      }
    }
  }

  clickOnWaterPurifierModelName(value) {
    for (let i in this.waterPurifieModelName) {
      if (this.waterPurifieModelName[i].value == value) {
        this.waterPurifieModelName[i].flage = !this.waterPurifieModelName[i].flage
      }
    }
    if (this.waterPurifierModelNameSelected.length == 0) {
      this.waterPurifierModelNameSelected.push(value);
      this.waterPurifierModelNameSelectedLength = this.waterPurifierModelNameSelected.length;
    } else {
      let count = 0
      let removeItemIndex = 0;
      for (let index in this.waterPurifierModelNameSelected) {
        if (this.waterPurifierModelNameSelected[index] == value) {
          count = 1
          removeItemIndex = Number(index)
        }
      }
      if (count == 0) {
        this.waterPurifierModelNameSelected.push(value);
        this.waterPurifierModelNameSelectedLength = this.waterPurifierModelNameSelected.length;
      } else {
        this.waterPurifierModelNameSelected.splice(removeItemIndex, 1);
        this.waterPurifierModelNameSelectedLength = this.waterPurifierModelNameSelected.length;
      }
    }
  }

  clickOnWaterPurifierCapacity(value) {
    for (let i in this.waterPurifieCapacity) {
      if (this.waterPurifieCapacity[i].value == value) {
        this.waterPurifieCapacity[i].flage = !this.waterPurifieCapacity[i].flage
      }
    }
    if (this.waterPurifierCapacitySelected.length == 0) {
      this.waterPurifierCapacitySelected.push(value);
      this.waterPurifierCapacitySelectedLength = this.waterPurifierCapacitySelected.length;
    } else {
      let count = 0
      let removeItemIndex = 0;
      for (let index in this.waterPurifierCapacitySelected) {
        if (this.waterPurifierCapacitySelected[index] == value) {
          count = 1
          removeItemIndex = Number(index)
        }
      }
      if (count == 0) {
        this.waterPurifierCapacitySelected.push(value);
        this.waterPurifierCapacitySelectedLength = this.waterPurifierCapacitySelected.length;
      } else {
        this.waterPurifierCapacitySelected.splice(removeItemIndex, 1);
        this.waterPurifierCapacitySelectedLength = this.waterPurifierCapacitySelected.length;
      }
    }
  }

  clickOnWaterPurifierPrice(value) {
    for (let i in this.waterPurifieMRP) {
      if (this.waterPurifieMRP[i].value == value) {
        this.waterPurifieMRP[i].flage = !this.waterPurifieMRP[i].flage
      }
    }
    if (this.waterPurifierPriseSelected.length == 0) {
      this.waterPurifierPriseSelected.push(value);
      this.waterPurifierPriseSelectedLength = this.waterPurifierPriseSelected.length;
    } else {
      let count = 0
      let removeItemIndex = 0;
      for (let index in this.waterPurifierPriseSelected) {
        if (this.waterPurifierPriseSelected[index] == value) {
          count = 1
          removeItemIndex = Number(index)
        }
      }
      if (count == 0) {
        this.waterPurifierPriseSelected.push(value);
        this.waterPurifierPriseSelectedLength = this.waterPurifierPriseSelected.length;
      } else {
        this.waterPurifierPriseSelected.splice(removeItemIndex, 1);
        this.waterPurifierPriseSelectedLength = this.waterPurifierPriseSelected.length;
      }
    }
  }

   // Water purifier end

  // Air Cooler start
  clickOnAirCoolerType(value) {
    for (let i in this.airCoolerType) {
      if (this.airCoolerType[i].value == value) {
        this.airCoolerType[i].flage = !this.airCoolerType[i].flage
      }
    }
    if (this.airCoolerTypeSelected.length == 0) {
      this.airCoolerTypeSelected.push(value);
      this.airCoolerTypeSelectedLength = this.airCoolerTypeSelected.length;
      // console.log("this.airCoolerTypeSelected 1",this.airCoolerTypeSelectedLength);
    } else {
      let count = 0
      let removeItemIndex = 0;
      for (let index in this.airCoolerTypeSelected) {
        if (this.airCoolerTypeSelected[index] == value) {
          count = 1
          removeItemIndex = Number(index)
        }
      }
      if (count == 0) {
        this.airCoolerTypeSelected.push(value);
        this.airCoolerTypeSelectedLength = this.airCoolerTypeSelected.length;
        // console.log("this.airCoolerTypeSelected 2",this.airCoolerTypeSelectedLength);
      } else {
        this.airCoolerTypeSelected.splice(removeItemIndex, 1);
        this.airCoolerTypeSelectedLength = this.airCoolerTypeSelected.length;
        // console.log("this.airCoolerTypeSelected 3",this.airCoolerTypeSelectedLength);
      }
    }
  }

  clickOnAirCoolerPrice(value) {
    for (let i in this.airCoolerMRP) {
      if (this.airCoolerMRP[i].value == value) {
        this.airCoolerMRP[i].flage = !this.airCoolerMRP[i].flage
      }
    }
    if (this.airCoolerPriceSelected.length == 0) {
      this.airCoolerPriceSelected.push(value);
      this.airCoolerPriceSelectedLength = this.airCoolerPriceSelected.length;
      // console.log("airCoolerPriceSelectedLength",this.airCoolerPriceSelectedLength);
    } else {
      let count = 0
      let removeItemIndex = 0;
      for (let index in this.airCoolerPriceSelected) {
        if (this.airCoolerPriceSelected[index] == value) {
          count = 1
          removeItemIndex = Number(index)
        }
      }
      if (count == 0) {
        this.airCoolerPriceSelected.push(value);
        this.airCoolerPriceSelectedLength = this.airCoolerPriceSelected.length;
        // console.log("airCoolerPriceSelectedLength",this.airCoolerPriceSelectedLength);
      } else {
        this.airCoolerPriceSelected.splice(removeItemIndex, 1)
        this.airCoolerPriceSelectedLength = this.airCoolerPriceSelected.length;
        // console.log("airCoolerPriceSelectedLength",this.airCoolerPriceSelectedLength);
      }
    }
  }

  clickOnAirCoolerCapacity(value) {
    for (let i in this.airCoolerCapacity) {
      if (this.airCoolerCapacity[i].value == value) {
        this.airCoolerCapacity[i].flage = !this.airCoolerCapacity[i].flage
      }
    }
    if (this.airCoolerCapacitySelected.length == 0) {
      this.airCoolerCapacitySelected.push(value);
      this.airCoolerCapacitySelectedLength = this.airCoolerCapacitySelected.length;
      // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
    } else {
      let count = 0
      let removeItemIndex = 0;
      for (let index in this.airCoolerCapacitySelected) {
        if (this.airCoolerCapacitySelected[index] == value) {
          count = 1
          removeItemIndex = Number(index)
        }
      }
      if (count == 0) {
        this.airCoolerCapacitySelected.push(value);
        this.airCoolerCapacitySelectedLength = this.airCoolerCapacitySelected.length;
        // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
      } else {
        this.airCoolerCapacitySelected.splice(removeItemIndex, 1);
        this.airCoolerCapacitySelectedLength = this.airCoolerCapacitySelected.length;
        // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
      }
    }
  }

  // Water purifier end
  clickOnAirConditionerSubCategory(value) {
    for (let i in this.airConditionerSubCategory) {
      if (this.airConditionerSubCategory[i].value == value) {
        this.airConditionerSubCategory[i].flage = !this.airConditionerSubCategory[i].flage
      }
    }
    if (this.airConditionerSubCategorySelected.length == 0) {
      this.airConditionerSubCategorySelected.push(value);
      this.airConditionerSubCategorySelectedLenght = this.airConditionerSubCategorySelected.length;
      // console.log("airConditionerSubCategorySelectedLenght",this.airConditionerSubCategorySelectedLenght);
    } else {
      let count = 0
      let removeItemIndex = 0;
      for (let index in this.airConditionerSubCategorySelected) {
        if (this.airConditionerSubCategorySelected[index] == value) {
          count = 1
          removeItemIndex = Number(index)
        }
      }
      if (count == 0) {
        this.airConditionerSubCategorySelected.push(value);
        this.airConditionerSubCategorySelectedLenght = this.airConditionerSubCategorySelected.length;
        // console.log("airConditionerSubCategorySelectedLenght",this.airConditionerSubCategorySelectedLenght);
      } else {
        this.airConditionerSubCategorySelected.splice(removeItemIndex, 1);
        this.airConditionerSubCategorySelectedLenght = this.airConditionerSubCategorySelected.length;
        // console.log("airConditionerSubCategorySelectedLenght",this.airConditionerSubCategorySelectedLenght);
      }
    }
  }

  clickOnAirConditionerCapacity(value) {
    for (let i in this.airConditionerCapacity) {
      if (this.airConditionerCapacity[i].value == value) {
        this.airConditionerCapacity[i].flage = !this.airConditionerCapacity[i].flage
      }
    }
    if (this.airConditionerCapacitySelected.length == 0) {
      this.airConditionerCapacitySelected.push(value);
      this.airConditionerCapacitySelectedLength = this.airConditionerCapacitySelected.length;
      // console.log("airConditionerCapacitySelectedLength",this.airConditionerCapacitySelectedLength);
    } else {
      let count = 0
      let removeItemIndex = 0;
      for (let index in this.airConditionerCapacitySelected) {
        if (this.airConditionerCapacitySelected[index] == value) {
          count = 1
          removeItemIndex = Number(index)
        }
      }
      if (count == 0) {
        this.airConditionerCapacitySelected.push(value);
        this.airConditionerCapacitySelectedLength = this.airConditionerCapacitySelected.length;
        // console.log("airConditionerCapacitySelectedLength",this.airConditionerCapacitySelectedLength);
      } else {
        this.airConditionerCapacitySelected.splice(removeItemIndex, 1);
        this.airConditionerCapacitySelectedLength = this.airConditionerCapacitySelected.length;
        // console.log("airConditionerCapacitySelectedLength",this.airConditionerCapacitySelectedLength);
      }
    }
  }

  clickOnAirConditionerSeries(value) {
    for (let i in this.airConditionerSeries) {
      if (this.airConditionerSeries[i].value == value) {
        this.airConditionerSeries[i].flage = !this.airConditionerSeries[i].flage
      }
    }
    if (this.airConditionerSeriesSelected.length == 0) {
      this.airConditionerSeriesSelected.push(value);
      this.airConditionerSeriesSelectedLength = this.airConditionerSeriesSelected.length;
    } else {
      let count = 0
      let removeItemIndex = 0;
      for (let index in this.airConditionerSeriesSelected) {
        if (this.airConditionerSeriesSelected[index] == value) {
          count = 1
          removeItemIndex = Number(index)
        }
      }
      if (count == 0) {
        this.airConditionerSeriesSelected.push(value);
        this.airConditionerSeriesSelectedLength = this.airConditionerSeriesSelected.length;
      } else {
        this.airConditionerSeriesSelected.splice(removeItemIndex, 1)
        this.airConditionerSeriesSelectedLength = this.airConditionerSeriesSelected.length;
      }
    }
  }

  clickOnAirConditionerStarRating(value) {
    for (let i in this.airConditionerStarRating) {
      if (this.airConditionerStarRating[i].value == value) {
        this.airConditionerStarRating[i].flage = !this.airConditionerStarRating[i].flage
      }
    }
    if (this.airConditionerStarRatingSelected.length == 0) {
      this.airConditionerStarRatingSelected.push(value);
      this.airConditionerStarRatingSelectedLength = this.airConditionerStarRatingSelected.length;
    } else {
      let count = 0
      let removeItemIndex = 0;
      for (let index in this.airConditionerStarRatingSelected) {
        if (this.airConditionerStarRatingSelected[index] == value) {
          count = 1
          removeItemIndex = Number(index)
        }
      }
      if (count == 0) {
        this.airConditionerStarRatingSelected.push(value);
        this.airConditionerStarRatingSelectedLength = this.airConditionerStarRatingSelected.length;
      } else {
        this.airConditionerStarRatingSelected.splice(removeItemIndex, 1);
        this.airConditionerStarRatingSelectedLength = this.airConditionerStarRatingSelected.length;
      }
    }
  }

  clickOnAirConditionerPrise(value) {
    for (let i in this.airConditionerMRP) {
      if (this.airConditionerMRP[i].value == value) {
        this.airConditionerMRP[i].flage = !this.airConditionerMRP[i].flage
      }
    }
    if (this.airConditionerPriseSelected.length == 0) {
      this.airConditionerPriseSelected.push(value);
      this.airConditionerPriseSelectedLength = this.airConditionerPriseSelected.length;
    } else {
      let count = 0
      let removeItemIndex = 0;
      for (let index in this.airConditionerPriseSelected) {
        if (this.airConditionerPriseSelected[index] == value) {
          count = 1
          removeItemIndex = Number(index)
        }
      }
      if (count == 0) {
        this.airConditionerPriseSelected.push(value);
        this.airConditionerPriseSelectedLength = this.airConditionerPriseSelected.length;
      } else {
        this.airConditionerPriseSelected.splice(removeItemIndex, 1);
        this.airConditionerPriseSelectedLength = this.airConditionerPriseSelected.length;
      }
    }
  }


  // Deep Freezer Start
  clickOnDeepFreezerCategory(value) {
    for (let i in this.deepFreezerCategory) {
      if (this.deepFreezerCategory[i].value == value) {
        this.deepFreezerCategory[i].flage = !this.deepFreezerCategory[i].flage
      }
    }
    if (this.deepFreezerCategorySelected.length == 0) {
      this.deepFreezerCategorySelected.push(value);
      this.deepFreezerCategorySelectedLength = this.deepFreezerCategorySelected.length;
      // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
    } else {
      let count = 0
      let removeItemIndex = 0;
      for (let index in this.deepFreezerCategorySelected) {
        if (this.deepFreezerCategorySelected[index] == value) {
          count = 1
          removeItemIndex = Number(index)
        }
      }
      if (count == 0) {
        this.deepFreezerCategorySelected.push(value);
        this.deepFreezerCategorySelectedLength = this.deepFreezerCategorySelected.length;
        // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
      } else {
        this.deepFreezerCategorySelected.splice(removeItemIndex, 1);
        this.deepFreezerCategorySelectedLength = this.deepFreezerCategorySelected.length;
        // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
      }
    }
  }



  clickOnDeepFreezerCapacity(value) {
    for (let i in this.deepFreezerCapacity) {
      if (this.deepFreezerCapacity[i].value == value) {
        this.deepFreezerCapacity[i].flage = !this.deepFreezerCapacity[i].flage
      }
    }
    if (this.deepFreezerCapacitySelected.length == 0) {
      this.deepFreezerCapacitySelected.push(value);
      this.deepFreezerCapacitySelectedLength = this.deepFreezerCapacitySelected.length;
      // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
    } else {
      let count = 0
      let removeItemIndex = 0;
      for (let index in this.deepFreezerCapacitySelected) {
        if (this.deepFreezerCapacitySelected[index] == value) {
          count = 1
          removeItemIndex = Number(index)
        }
      }
      if (count == 0) {
        this.deepFreezerCapacitySelected.push(value);
        this.deepFreezerCapacitySelectedLength = this.deepFreezerCapacitySelected.length;
        // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
      } else {
        this.deepFreezerCapacitySelected.splice(removeItemIndex, 1);
        this.deepFreezerCapacitySelectedLength = this.deepFreezerCapacitySelected.length;
        // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
      }
    }
  }

  clickOnDeepFreezerDoors(value) {
    for (let i in this.deepFreezerDoors) {
      if (this.deepFreezerDoors[i].value == value) {
        this.deepFreezerDoors[i].flage = !this.deepFreezerDoors[i].flage
      }
    }
    if (this.deepFreezerDoorsSelected.length == 0) {
      this.deepFreezerDoorsSelected.push(value);
      this.deepFreezerDoorsSelectedLength = this.deepFreezerDoorsSelected.length;
      // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
    } else {
      let count = 0
      let removeItemIndex = 0;
      for (let index in this.deepFreezerDoorsSelected) {
        if (this.deepFreezerDoorsSelected[index] == value) {
          count = 1
          removeItemIndex = Number(index)
        }
      }
      if (count == 0) {
        this.deepFreezerDoorsSelected.push(value);
        this.deepFreezerDoorsSelectedLength = this.deepFreezerDoorsSelected.length;
        // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
      } else {
        this.deepFreezerDoorsSelected.splice(removeItemIndex, 1);
        this.deepFreezerDoorsSelectedLength = this.deepFreezerDoorsSelected.length;
        // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
      }
    }
  }

  clickOnDeepFreezerRefrigerant(value) {
    for (let i in this.deepFreezerRefrigerant) {
      if (this.deepFreezerRefrigerant[i].value == value) {
        this.deepFreezerRefrigerant[i].flage = !this.deepFreezerRefrigerant[i].flage
      }
    }
    if (this.deepFreezerRefrigerantSelected.length == 0) {
      this.deepFreezerRefrigerantSelected.push(value);
      this.deepFreezerRefrigerantSelectedLength = this.deepFreezerRefrigerantSelected.length;
      // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
    } else {
      let count = 0
      let removeItemIndex = 0;
      for (let index in this.deepFreezerRefrigerantSelected) {
        if (this.deepFreezerRefrigerantSelected[index] == value) {
          count = 1
          removeItemIndex = Number(index)
        }
      }
      if (count == 0) {
        this.deepFreezerRefrigerantSelected.push(value);
        this.deepFreezerRefrigerantSelectedLength = this.deepFreezerRefrigerantSelected.length;
        // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
      } else {
        this.deepFreezerRefrigerantSelected.splice(removeItemIndex, 1);
        this.deepFreezerRefrigerantSelectedLength = this.deepFreezerRefrigerantSelected.length;
        // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
      }
    }
  }
  // Deep Freezer end


  // Bottled Water Dispenser Start
  clickOnBottledWaterDispenserSeries(value) {
    for (let i in this.waterDispenserSeries) {
      if (this.waterDispenserSeries[i].value == value) {
        this.waterDispenserSeries[i].flage = !this.waterDispenserSeries[i].flage
      }
    }
    if (this.waterDispenserSeriesSelected.length == 0) {
      this.waterDispenserSeriesSelected.push(value);
      this.waterDispenserSeriesSelectedLength = this.waterDispenserSeriesSelected.length;
      // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
    } else {
      let count = 0
      let removeItemIndex = 0;
      for (let index in this.waterDispenserSeriesSelected) {
        if (this.waterDispenserSeriesSelected[index] == value) {
          count = 1
          removeItemIndex = Number(index)
        }
      }
      if (count == 0) {
        this.waterDispenserSeriesSelected.push(value);
        this.waterDispenserSeriesSelectedLength = this.waterDispenserSeriesSelected.length;
        // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
      } else {
        this.waterDispenserSeriesSelected.splice(removeItemIndex, 1);
        this.waterDispenserSeriesSelectedLength = this.waterDispenserSeriesSelected.length;
        // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
      }
    }
  }

  clickOnBottledWaterDispenserColour(value) {
    for (let i in this.waterDispenserColour) {
      if (this.waterDispenserColour[i].value == value) {
        this.waterDispenserColour[i].flage = !this.waterDispenserColour[i].flage
      }
    }
    if (this.waterDispenserColourSelected.length == 0) {
      this.waterDispenserColourSelected.push(value);
      this.waterDispenserColourSelectedLength = this.waterDispenserColourSelected.length;
      // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
    } else {
      let count = 0
      let removeItemIndex = 0;
      for (let index in this.waterDispenserColourSelected) {
        if (this.waterDispenserColourSelected[index] == value) {
          count = 1
          removeItemIndex = Number(index)
        }
      }
      if (count == 0) {
        this.waterDispenserColourSelected.push(value);
        this.waterDispenserColourSelectedLength = this.waterDispenserColourSelected.length;
        // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
      } else {
        this.waterDispenserColourSelected.splice(removeItemIndex, 1);
        this.waterDispenserColourSelectedLength = this.waterDispenserColourSelected.length;
        // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
      }
    }
  }

  clickOnBottledWaterDispenserFaucets(value) {
    for (let i in this.waterDispenserFaucets) {
      if (this.waterDispenserFaucets[i].value == value) {
        this.waterDispenserFaucets[i].flage = !this.waterDispenserFaucets[i].flage
      }
    }
    if (this.waterDispenserFaucetsSelected.length == 0) {
      this.waterDispenserFaucetsSelected.push(value);
      this.waterDispenserFaucetsSelectedLength = this.waterDispenserFaucetsSelected.length;
      // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
    } else {
      let count = 0
      let removeItemIndex = 0;
      for (let index in this.waterDispenserFaucetsSelected) {
        if (this.waterDispenserFaucetsSelected[index] == value) {
          count = 1
          removeItemIndex = Number(index)
        }
      }
      if (count == 0) {
        this.waterDispenserFaucetsSelected.push(value);
        this.waterDispenserFaucetsSelectedLength = this.waterDispenserFaucetsSelected.length;
        // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
      } else {
        this.waterDispenserFaucetsSelected.splice(removeItemIndex, 1);
        this.waterDispenserFaucetsSelectedLength = this.waterDispenserFaucetsSelected.length;
        // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
      }
    }
  }
  // Bottled Water Dispenser end



  // Visi cooler Start
  clickOnVisiCoolerSeries(value) {
    for (let i in this.visiCoolerSeries) {
      if (this.visiCoolerSeries[i].value == value) {
        this.visiCoolerSeries[i].flage = !this.visiCoolerSeries[i].flage
      }
    }
    if (this.visiCoolerSeriesSelected.length == 0) {
      this.visiCoolerSeriesSelected.push(value);
      this.visiCoolerSeriesSelectedLength = this.visiCoolerSeriesSelected.length;
      // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
    } else {
      let count = 0
      let removeItemIndex = 0;
      for (let index in this.visiCoolerSeriesSelected) {
        if (this.visiCoolerSeriesSelected[index] == value) {
          count = 1
          removeItemIndex = Number(index)
        }
      }
      if (count == 0) {
        this.visiCoolerSeriesSelected.push(value);
        this.visiCoolerSeriesSelectedLength = this.visiCoolerSeriesSelected.length;
        // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
      } else {
        this.visiCoolerSeriesSelected.splice(removeItemIndex, 1);
        this.visiCoolerSeriesSelectedLength = this.visiCoolerSeriesSelected.length;
        // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
      }
    }
  }

  clickOnVisiCoolerCapacity(value) {
    for (let i in this.visiCoolerCapacity) {
      if (this.visiCoolerCapacity[i].value == value) {
        this.visiCoolerCapacity[i].flage = !this.visiCoolerCapacity[i].flage
      }
    }
    if (this.visiCoolerCapacitySelected.length == 0) {
      this.visiCoolerCapacitySelected.push(value);
      this.visiCoolerCapacitySelectedLength = this.visiCoolerCapacitySelected.length;
      // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
    } else {
      let count = 0
      let removeItemIndex = 0;
      for (let index in this.visiCoolerCapacitySelected) {
        if (this.visiCoolerCapacitySelected[index] == value) {
          count = 1
          removeItemIndex = Number(index)
        }
      }
      if (count == 0) {
        this.visiCoolerCapacitySelected.push(value);
        this.visiCoolerCapacitySelectedLength = this.visiCoolerCapacitySelected.length;
        // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
      } else {
        this.visiCoolerCapacitySelected.splice(removeItemIndex, 1);
        this.visiCoolerCapacitySelectedLength = this.visiCoolerCapacitySelected.length;
        // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
      }
    }
  }


  clickOnVisiCoolerDoors(value) {
    for (let i in this.visiCoolerDoors) {
      if (this.visiCoolerDoors[i].value == value) {
        this.visiCoolerDoors[i].flage = !this.visiCoolerDoors[i].flage
      }
    }
    if (this.visiCoolerDoorsSelected.length == 0) {
      this.visiCoolerDoorsSelected.push(value);
      this.visiCoolerDoorsSelectedLength = this.visiCoolerDoorsSelected.length;
      // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
    } else {
      let count = 0
      let removeItemIndex = 0;
      for (let index in this.visiCoolerDoorsSelected) {
        if (this.visiCoolerDoorsSelected[index] == value) {
          count = 1
          removeItemIndex = Number(index)
        }
      }
      if (count == 0) {
        this.visiCoolerDoorsSelected.push(value);
        this.visiCoolerDoorsSelectedLength = this.visiCoolerDoorsSelected.length;
        // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
      } else {
        this.visiCoolerDoorsSelected.splice(removeItemIndex, 1);
        this.visiCoolerDoorsSelectedLength = this.visiCoolerDoorsSelected.length;
        // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
      }
    }
  }

  clickOnVisiCoolerCoolingType(value) {
    for (let i in this.visiCoolerCoolingType) {
      if (this.visiCoolerCoolingType[i].value == value) {
        this.visiCoolerCoolingType[i].flage = !this.visiCoolerCoolingType[i].flage
      }
    }
    if (this.visiCoolerCoolingTypeSelected.length == 0) {
      this.visiCoolerCoolingTypeSelected.push(value);
      this.visiCoolerCoolingTypeSelectedLength = this.visiCoolerCoolingTypeSelected.length;
      // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
    } else {
      let count = 0
      let removeItemIndex = 0;
      for (let index in this.visiCoolerCoolingTypeSelected) {
        if (this.visiCoolerCoolingTypeSelected[index] == value) {
          count = 1
          removeItemIndex = Number(index)
        }
      }
      if (count == 0) {
        this.visiCoolerCoolingTypeSelected.push(value);
        this.visiCoolerCoolingTypeSelectedLength = this.visiCoolerCoolingTypeSelected.length;
        // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
      } else {
        this.visiCoolerCoolingTypeSelected.splice(removeItemIndex, 1);
        this.visiCoolerCoolingTypeSelectedLength = this.visiCoolerCoolingTypeSelected.length;
        // console.log("airCoolerCapacitySelectedLength",this.airCoolerCapacitySelectedLength);
      }
    }
  }


  // Visi Cooler end

  getFilterAirConditioner() {
    this.route.queryParams.subscribe(params => {
      if (params && params.title) {
        this.title = params.title
        let param = {};
        if (params.title == "Air Conditioners") {
          param = { air_conditioner: "Air Conditioners" }
        }
        this.loadingController.create({
          message: 'Please wait',
        }).then((res) => {
          res.present();
          if (navigator.onLine) {
            this.http.post(this.categoriesPage.apiBaseUrl + '/bluestar_api/category_filter', param).subscribe((response) => {
              Object.keys(response).map(key => {
                //console.log("Res******", response[key]);
                this.airConditionerSubCategory = []
                this.airConditionerCapacity = []
                this.airConditionerSeries = []
                this.airConditionerStarRating = []
                this.airConditionerMRP = []
                for (let index in response[key]) {
                  if (index == "capacity") {
                    for (let i in response[key][index][1]) {
                      let object = {
                        value: "",
                        showValue: "",
                        flage: false,
                      }
                      object.value = response[key][index][1][i]
                      object.showValue = response[key][index][1][i]
                      this.airConditionerCapacity.push(object)
                    }
                  }
                  if (index == "mrp") {
                    for (let i in response[key][index][1]) {
                      let object = {
                        value: "",
                        showValue: "",
                        flage: false,
                      }
                      if (response[key][index][1][i].replace(/,/g, '').includes("and above")) {
                        let array = response[key][index][1][i].replace(/,/g, '').split(" ")
                        object.value = array[0] + "-" + "99999999"
                        object.showValue = response[key][index][1][i]
                        this.airConditionerMRP.push(object)
                      } else {
                        object.value = response[key][index][1][i].replace(/,/g, '')
                        object.showValue = response[key][index][1][i]
                        this.airConditionerMRP.push(object)
                      }
                    }
                  }
                  if (index == "series") {
                    for (let i in response[key][index][1]) {
                      let object = {
                        value: "",
                        showValue: "",
                        flage: false,
                      }
                      object.value = response[key][index][1][i]
                      object.showValue = response[key][index][1][i]
                      this.airConditionerSeries.push(object)
                    }
                  }
                  if (index == "star_rating") {
                    for (let i in response[key][index][1]) {
                      let object = {
                        value: "",
                        showValue: "",
                        flage: false,
                      }
                      object.value = response[key][index][1][i] + " star"
                      object.showValue = response[key][index][1][i]
                      this.airConditionerStarRating.push(object)
                    }
                  }
                  if (index == "subcategory") {
                    for (let i in response[key][index][1]) {
                      let object = {
                        value: "",
                        showValue: "",
                        flage: false,
                      }
                      object.value = response[key][index][1][i]
                      object.showValue = response[key][index][1][i]
                      this.airConditionerSubCategory.push(object)
                    }
                  }
                }
                this.assignFilterPreveas()
                res.dismiss();
              })
            }, err => {
              res.dismiss();
              console.log("err.........", JSON.stringify(err))
            });
          } else {
            res.dismiss();
            console.log("no internat connection")
          }
        });
      }
    })
  }

  getFilterAirCooler() {
    this.route.queryParams.subscribe(params => {
      if (params && params.title) {
        this.title = params.title
        let param = {};
        if (params.title == "Air Coolers") {
          param = { air_cooler: "Air Coolers" }
        }
        this.loadingController.create({
          message: 'Please wait',
        }).then((res) => {
          res.present();
          if (navigator.onLine) {
            this.http.post(this.categoriesPage.apiBaseUrl + '/bluestar_api/category_filter', param).subscribe((response) => {
              Object.keys(response).map(key => {
                //console.log("Res******", response[key]);
                this.airCoolerType = []
                this.airCoolerMRP = []
                this.airCoolerCapacity = []
                for (let index in response[key]) {
                  if (index == "capacity") {
                    for (let i in response[key][index][1]) {
                      let object = {
                        value: "",
                        showValue: "",
                        flage: false,
                      }
                      object.value = response[key][index][1][i]
                      object.showValue = response[key][index][1][i]
                      this.airCoolerCapacity.push(object)
                    }
                  }
                  if (index == "mrp") {
                    for (let i in response[key][index][1]) {
                      let object = {
                        value: "",
                        showValue: "",
                        flage: false,
                      }
                      if (response[key][index][1][i].replace(/,/g, '').includes("and above")) {
                        let array = response[key][index][1][i].replace(/,/g, '').split(" ")
                        object.value = array[0] + "-" + "99999999"
                        object.showValue = response[key][index][1][i]
                        this.airCoolerMRP.push(object)
                      } else {
                        object.value = response[key][index][1][i].replace(/,/g, '')
                        object.showValue = response[key][index][1][i]
                        this.airCoolerMRP.push(object)
                      }
                    }
                  }
                  if (index == "type") {
                    for (let i in response[key][index][1]) {
                      let object = {
                        value: "",
                        showValue: "",
                        flage: false,
                      }
                      object.value = response[key][index][1][i]
                      object.showValue = response[key][index][1][i]
                      this.airCoolerType.push(object)
                    }
                  }
                }
                this.assignFilterPreveas()
                res.dismiss();
              })
            }, err => {
              res.dismiss();
              console.log("err.........", JSON.stringify(err))
            });
          } else {
            res.dismiss();
            console.log("no internat connection")
          }
        });
      }
    })
  }

  getFilterAirPurifier() {
    this.route.queryParams.subscribe(params => {
      if (params && params.title) {
        this.title = params.title
        let param = {};
        if (params.title == "Air Purifiers") {
          param = { air_purifier: "Air Purifiers" }
        }
        this.loadingController.create({
          message: 'Please wait',
        }).then((res) => {
          res.present();
          if (navigator.onLine) {
            this.http.post(this.categoriesPage.apiBaseUrl + '/bluestar_api/category_filter', param).subscribe((response) => {
              Object.keys(response).map(key => {
                //console.log("Res******", response[key]);
                this.airPurifierMRP = []
                this.airPurifierCoverageArea = []
                this.airPurifierCADR = []
                for (let index in response[key]) {
                  if (index == "area_cover") {
                    for (let i in response[key][index][1]) {
                      let object = {
                        value: "",
                        showValue: "",
                        flage: false,
                      }
                      object.value = response[key][index][1][i]
                      object.showValue = response[key][index][1][i]
                      this.airPurifierCoverageArea.push(object)
                    }
                  }
                  if (index == "mrp") {
                    for (let i in response[key][index][1]) {
                      let object = {
                        value: "",
                        showValue: "",
                        flage: false,
                      }
                      if (response[key][index][1][i].replace(/,/g, '').includes("and above")) {
                        let array = response[key][index][1][i].replace(/,/g, '').split(" ")
                        object.value = array[0] + "-" + "99999999"
                        object.showValue = response[key][index][1][i]
                        this.airPurifierMRP.push(object)
                      } else {
                        object.value = response[key][index][1][i].replace(/,/g, '')
                        object.showValue = response[key][index][1][i]
                        this.airPurifierMRP.push(object)
                      }
                    }
                  }
                  if (index == "cadr") {
                    for (let i in response[key][index][1]) {
                      let object = {
                        value: "",
                        showValue: "",
                        flage: false,
                      }
                      object.value = response[key][index][1][i]
                      object.showValue = response[key][index][1][i]
                      this.airPurifierCADR.push(object)
                    }
                  }
                }
                this.assignFilterPreveas()
                res.dismiss();
              })
            }, err => {
              res.dismiss();
              console.log("err.........", JSON.stringify(err))
            });
          } else {
            res.dismiss();
            console.log("no internat connection")
          }
        });
      }
    })
  }

  getFilterWaterPurifier() {
    this.route.queryParams.subscribe(params => {
      if (params && params.title) {
        this.title = params.title
        let param = {};
        if (params.title == "Water Purifiers") {
          param = { water_purifier: "Water Purifiers" }
        }
        this.loadingController.create({
          message: 'Please wait',
        }).then((res) => {
          res.present();
          if (navigator.onLine) {
            this.http.post(this.categoriesPage.apiBaseUrl + '/bluestar_api/category_filter', param).subscribe((response) => {
              Object.keys(response).map(key => {
                //console.log("Res******", response[key]);
                this.waterPurifieTechnology = []
                this.waterPurifieMRP = []
                this.waterPurifieCapacity = []
                this.waterPurifieModelName = []
                for (let index in response[key]) {
                  if (index == "purification_technology") {
                    for (let i in response[key][index][1]) {
                      let object = {
                        value: "",
                        showValue: "",
                        flage: false,
                      }
                      object.value = response[key][index][1][i]
                      object.showValue = response[key][index][1][i]
                      this.waterPurifieTechnology.push(object)
                    }
                  }
                  if (index == "mrp") {
                    for (let i in response[key][index][1]) {
                      let object = {
                        value: "",
                        showValue: "",
                        flage: false,
                      }
                      if (response[key][index][1][i].replace(/,/g, '').includes("and above")) {
                        let array = response[key][index][1][i].replace(/,/g, '').split(" ")
                        object.value = array[0] + "-" + "99999999"
                        object.showValue = response[key][index][1][i]
                        this.waterPurifieMRP.push(object)
                      } else {
                        object.value = response[key][index][1][i].replace(/,/g, '')
                        object.showValue = response[key][index][1][i]
                        this.waterPurifieMRP.push(object)
                      }
                    }
                  }
                  if (index == "storage_capacity") {
                    for (let i in response[key][index][1]) {
                      let object = {
                        value: "",
                        showValue: "",
                        flage: false,
                      }
                      object.value = response[key][index][1][i]
                      object.showValue = response[key][index][1][i]
                      this.waterPurifieCapacity.push(object)
                    }
                  }
                  if (index == "model_series") {
                    for (let i in response[key][index][1]) {
                      let object = {
                        value: "",
                        showValue: "",
                        flage: false,
                      }
                      object.value = response[key][index][1][i]
                      object.showValue = response[key][index][1][i]
                      this.waterPurifieModelName.push(object)
                    }
                  }
                }
                this.assignFilterPreveas()
                res.dismiss();
              })
            }, err => {
              res.dismiss();
              console.log("err.........", JSON.stringify(err))
            });
          } else {
            res.dismiss();
            console.log("no internat connection")
          }
        });
      }
    })
  }

  getFilterDeepFreezer() {
    this.route.queryParams.subscribe(params => {
      if (params && params.title) {
        this.title = params.title
        let param = {};
        if (params.title == "Deep Freezer") {
          param = { deep_freezer: "Deep Freezer" }
        }
        this.loadingController.create({
          message: 'Please wait',
        }).then((res) => {
          res.present();
          if (navigator.onLine) {
            this.http.post(this.categoriesPage.apiBaseUrl + '/bluestar_api/category_filter', param).subscribe((response) => {
              Object.keys(response).map(key => {
                //console.log("Res******", response[key]);
                this.deepFreezerCategory = []
                this.deepFreezerCapacity = []
                this.deepFreezerDoors = []
                this.deepFreezerRefrigerant = []

                for (let index in response[key]) {
                   if (index == "product_sub_type") {
                    for (let i in response[key][index][1]) {
                      let object = {
                        value: "",
                        showValue: "",
                        flage: false,
                      }
                      object.value = response[key][index][1][i]
                      object.showValue = response[key][index][1][i]
                      this.deepFreezerCategory.push(object)
                    }
                  }
                  if (index == "storage_capacity") {
                    for (let i in response[key][index][1]) {
                      let object = {
                        value: "",
                        showValue: "",
                        flage: false,
                      }
                      object.value = response[key][index][1][i]
                      object.showValue = response[key][index][1][i]
                      this.deepFreezerCapacity.push(object)
                    }
                  }
                  if (index == "doors") {
                    for (let i in response[key][index][1]) {
                      let object = {
                        value: "",
                        showValue: "",
                        flage: false,
                      }
                      object.value = response[key][index][1][i]
                      object.showValue = response[key][index][1][i]
                      this.deepFreezerDoors.push(object)
                    }
                  }
                  if (index == "refrigerant") {
                    for (let i in response[key][index][1]) {
                      let object = {
                        value: "",
                        showValue: "",
                        flage: false,
                      }
                      object.value = response[key][index][1][i]
                      object.showValue = response[key][index][1][i]
                      this.deepFreezerRefrigerant.push(object)
                    }
                  }
                }
                this.assignFilterPreveas()
                res.dismiss();
              })
            }, err => {
              res.dismiss();
              console.log("err.........", JSON.stringify(err))
            });
          } else {
            res.dismiss();
            console.log("no internat connection")
          }
        });
      }
    })
  }


  getFilterBottledWaterDispenser() {
    this.route.queryParams.subscribe(params => {
      if (params && params.title) {
        this.title = params.title
        let param = {};
        if (params.title == "Bottled Water Dispenser") {
          param = { water_dispenser: "Bottled Water Dispenser" }
        }
        this.loadingController.create({
          message: 'Please wait',
        }).then((res) => {
          res.present();
          if (navigator.onLine) {
            this.http.post(this.categoriesPage.apiBaseUrl + '/bluestar_api/category_filter', param).subscribe((response) => {
              Object.keys(response).map(key => {
                //console.log("Res******", response[key]);
                this.waterDispenserSeries = []
                this.waterDispenserColour = []
                this.waterDispenserFaucets = []

                for (let index in response[key]) {
                  if (index == "series") {
                    for (let i in response[key][index][1]) {
                      let object = {
                        value: "",
                        showValue: "",
                        flage: false,
                      }
                      object.value = response[key][index][1][i]
                      object.showValue = response[key][index][1][i]
                      this.waterDispenserSeries.push(object)
                    }
                  }
                  if (index == "colour") {
                    for (let i in response[key][index][1]) {
                      let object = {
                        value: "",
                        showValue: "",
                        flage: false,
                      }
                      object.value = response[key][index][1][i]
                      object.showValue = response[key][index][1][i]
                      this.waterDispenserColour.push(object)
                    }
                  }
                  if (index == "Faucets") {
                    for (let i in response[key][index][1]) {
                      let object = {
                        value: "",
                        showValue: "",
                        flage: false,
                      }
                      object.value = response[key][index][1][i]
                      object.showValue = response[key][index][1][i]
                      this.waterDispenserFaucets.push(object)
                    }
                  }
                }
                this.assignFilterPreveas()
                res.dismiss();
              })
            }, err => {
              res.dismiss();
              console.log("err.........", JSON.stringify(err))
            });
          } else {
            res.dismiss();
            console.log("no internat connection")
          }
        });
      }
    })
  }

  getFilterVisiCooler() {
    this.route.queryParams.subscribe(params => {
      if (params && params.title) {
        this.title = params.title
        let param = {};
        if (params.title == "Visi Cooler") {
          param = { visi_cooler: "Visi Cooler" }
        }
        this.loadingController.create({
          message: 'Please wait',
        }).then((res) => {
          res.present();
          if (navigator.onLine) {
            this.http.post(this.categoriesPage.apiBaseUrl + '/bluestar_api/category_filter', param).subscribe((response) => {
              Object.keys(response).map(key => {
                //console.log("Res******", response[key]);
                this.visiCoolerSeries = []
                this.visiCoolerCapacity = []
                this.visiCoolerDoors = []
                this.visiCoolerCoolingType = []

                for (let index in response[key]) {
                  if (index == "series") {
                    for (let i in response[key][index][1]) {
                      let object = {
                        value: "",
                        showValue: "",
                        flage: false,
                      }
                      object.value = response[key][index][1][i]
                      object.showValue = response[key][index][1][i]
                      this.visiCoolerSeries.push(object)
                    }
                  }
                  if (index == "storage_capacity") {
                    for (let i in response[key][index][1]) {
                      let object = {
                        value: "",
                        showValue: "",
                        flage: false,
                      }
                      object.value = response[key][index][1][i]
                      object.showValue = response[key][index][1][i]
                      this.visiCoolerCapacity.push(object)
                    }
                  }
                  if (index == "doors") {
                    for (let i in response[key][index][1]) {
                      let object = {
                        value: "",
                        showValue: "",
                        flage: false,
                      }
                      object.value = response[key][index][1][i]
                      object.showValue = response[key][index][1][i]
                      this.visiCoolerDoors.push(object)
                    }
                  }
                  if (index == "cooling_type") {
                    for (let i in response[key][index][1]) {
                      let object = {
                        value: "",
                        showValue: "",
                        flage: false,
                      }
                      object.value = response[key][index][1][i]
                      object.showValue = response[key][index][1][i]
                      this.visiCoolerCoolingType.push(object)
                    }
                  }
                }
                this.assignFilterPreveas()
                res.dismiss();
              })
            }, err => {
              res.dismiss();
              console.log("err.........", JSON.stringify(err))
            });
          } else {
            res.dismiss();
            console.log("no internat connection")
          }
        });
      }
    })
  }



}



