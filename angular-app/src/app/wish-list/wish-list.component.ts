import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ProductList } from '../product-list';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css']
})
export class WishListComponent implements OnInit {
  wishlist: any = [];
  wishlist_cost: string = '';

  slideToProductDetails(product){
    this.data.modifySlide(product);
  }

  constructor(private data: DataService) { }


  checkoutitems(prod){
    prod.wishlist = false;
    this.data.removeWishList(prod);
  }

  calculate_cost(){
    var wish = 0;
    for (var i=0; i<this.wishlist.length; i++){
      console.log(parseFloat(this.wishlist[i].price.substring(1,this.wishlist[i].price.length)));
      wish += parseFloat(this.wishlist[i].price.substring(1,this.wishlist[i].price.length));
    }
    this.wishlist_cost = "$ " + String(wish);
    
    var index = this.wishlist_cost.indexOf('.');
    if (index == -1){
      this.wishlist_cost = this.wishlist_cost + ".0";
    }

  }
  // delItem(prod: any){
  //   var del_index = this.wishlist.indexOf(prod);
  //   console.log("del_index", del_index);
  //   this.wishlist=this.wishlist.filter(x=>x!=prod)
  //   // this.wishlist.splice(del_index, 1);
  // }
  
  ngOnInit() {
  
    console.log(this.wishlist)
    this.data.new_wish_observe.subscribe
    (
      message => {this.wishlist = message; this.calculate_cost()}
    )
console.log(this.wishlist)
  }
  



}
