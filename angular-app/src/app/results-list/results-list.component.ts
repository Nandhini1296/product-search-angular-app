import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ProductFormComponent } from 'src/app/product-form/product-form.component';
import { ProductSearchServiceService } from '../product-search-service.service';
import { DataService } from '../data.service';
import { ProductList } from '../product-list';
import { ProductDetails } from '../product-details';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { delay } from 'q';


@Component({
  selector: 'app-results-list',
  templateUrl: './results-list.component.html',
  styleUrls: ['./results-list.component.css']
})
export class ResultsListComponent implements OnInit {
  @Output() emitted_string = new EventEmitter<PaneType>();

  displayJSON : any;
  objects_array = [];
  page_number: number = 1;
  page_size: number = 10;
  singleJSON: any;
  details_array = [];
  selected_item: ProductList;
  wishlist: any = [];
  details_enabled:boolean = false;
  wish_product : ProductList;
  list_progress: boolean = true;
  
  async child_page_slider(){
   // console.log('inside child_page_slider'+slide);
   this.list_progress = false;
   await delay(200);
    this.emitted_string.emit(this.selected_item);
    await delay(300);
    this.list_progress = true;

  }

  async onTitleClick(prod: ProductList){
    this.selected_item = prod;
    this.child_page_slider();
    this.details_enabled = true;
    console.log('Title click called');
  }

  addtowishlist(prod){
    this.data.addWishList(prod);
    prod.wishlist = true;
  }

  removefromwishlist(prod){
    this.data.removeWishList(prod);
    prod.wishlist = false;
  }

  constructor(private myservice: ProductSearchServiceService, private data: DataService) {
  }

  // getfromLocalStorage(){
  //   if (localStorage.getItem('wishList') != null){
  //     this.wishlist = JSON.parse(localStorage.getItem('wishList'));
  //     console.log("Subscribed into resultslist", this.wishlist);
  //   }
  // }

  //292862774875  
  ngOnInit() {
    this.details_enabled = false;
    this.data.myjson.subscribe(
      message => this.displayJSON = message
      )

    this.data.mydatatable.subscribe(
      message => this.objects_array = message
    )

    // this.data.mychildslide.subscribe(
    //   message => {
    //     if (message!=null){
    //       this.onTitleClick(message); 
    //       console.log('subscribed into mychild')}
    //     }
    // )

    this.data.mycurrent_observe.subscribe(
      message => this.selected_item = message
    )
}
}

type PaneType = "results_list" | ProductList;
type WishType = "wishes" | ProductList;
