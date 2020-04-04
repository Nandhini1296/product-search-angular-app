import { Injectable } from '@angular/core';
import { BehaviorSubject, empty } from 'rxjs';
import { ProductList } from './product-list';
import { CheckVariables } from './check-variables';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private messageSource =  new BehaviorSubject({});
  myjson =  this.messageSource.asObservable();
  private tableSource = new BehaviorSubject([]);
  mydatatable = this.tableSource.asObservable();
  private singleSource = new BehaviorSubject([]);
  mysingletable = this.singleSource.asObservable();

  private slideSource = new BehaviorSubject<ProductList>(null);
  myslide = this.slideSource.asObservable();

  private childSlideSource = new BehaviorSubject<ProductList>(null);
  mychildslide = this.childSlideSource.asObservable();

  private currentProdSource = new BehaviorSubject<ProductList>(null);
  mycurrent_observe = this.currentProdSource.asObservable();


  new_wishlist = []
  private newWishSource = new BehaviorSubject(this.new_wishlist);
  new_wish_observe = this.newWishSource.asObservable();
  constructor() { }

  modifyCurrentProduct(cur_prod: ProductList){
    this.currentProdSource.next(cur_prod);
  }

  modifychildSlide(wish_prod: ProductList){
    this.childSlideSource.next(wish_prod);
    console.log('Modified in dataservice',wish_prod);
  }

  modifySlide(new_prod: ProductList){
    this.slideSource.next(new_prod);
    console.log(new_prod);
  }

  modifyMessage(new_msg: any){
    this.messageSource.next(new_msg);
    console.log(new_msg);
  }


  modifySingle(new_table: any){
    this.singleSource.next(new_table);
    console.log(new_table);
  }

  modifyTable(new_table: any){
    this.tableSource.next(new_table);
    console.log(new_table);
  }

  addWishList(new_wishes: any){
    this.new_wishlist.push(new_wishes);
    this.newWishSource.next(this.new_wishlist);
    console.log("To add", new_wishes);
    localStorage.setItem('wish-list-nrengara',JSON.stringify(this.new_wishlist));
  }

  removeWishList(new_wishes: any){
    this.new_wishlist = this.new_wishlist.filter(x=>x.itemid!=new_wishes.itemid);
    this.newWishSource.next(this.new_wishlist);
    console.log("To rem", new_wishes);
    localStorage.setItem('wish-list-nrengara',JSON.stringify(this.new_wishlist));
  }

  init_wish_list(){
    if (localStorage.getItem('wish-list-nrengara') != null){
      this.new_wishlist = JSON.parse(localStorage.getItem('wish-list-nrengara'))
    }
    this.newWishSource.next(this.new_wishlist);
  }

  already_wished(prod){
    console.log("prod",prod);
    console.log("wish", this.new_wishlist)
    return this.new_wishlist.filter(x=>x.itemid==prod.itemid).length>0?true:false;
  }

}
