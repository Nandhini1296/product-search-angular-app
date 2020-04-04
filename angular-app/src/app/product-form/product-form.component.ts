import { Component, OnInit, Input } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { ProductSearchServiceService } from "../product-search-service.service";
import { DataService } from "../data.service";
import { ProductList } from "../product-list";
import { CheckVariables } from "../check-variables";
import { delay } from "q";

@Component({
  selector: "app-product-form",
  templateUrl: "./product-form.component.html",
  styleUrls: ["./product-form.component.css"]
  // animations: [
  //   trigger('slide', [
  //     state('results', style({ transform: 'translateX(0)' })),
  //     state('wish_list', style({ transform: 'translateX(-50%)' })),
  //     transition('* => *', animate(300))
  // ])]
})
export class ProductFormComponent implements OnInit {
  options: string[] = [];
  options_json: any;
  current_page: string;
  results_dark: boolean;
  wish_dark: boolean;
  showresult: boolean = false;
  allProductsJSON: any;
  objects_array = [];
  emptyResults: boolean = false;
  checklist: any = [];
  hide_progress: boolean = false;
  hideresultsforwish = false;
  searchclicked = false;
  child_progress: boolean = true;
  progress_flag: boolean = true;
  hidewishlist: boolean = true;

  get keyword_name() {
    return this.formGroup.get("keyword_name");
  }

  get zip_code() {
    return this.formGroup.get("zip_code");
  }

  get category() {
    return this.formGroup.get("category");
  }

  get new_condition() {
    return this.formGroup.get("new_condition");
  }

  get used_condition() {
    return this.formGroup.get("used_condition");
  }

  get unspec_condition() {
    return this.formGroup.get("unspec_condition");
  }

  get local_shipping() {
    return this.formGroup.get("local_shipping");
  }

  get free_shipping() {
    return this.formGroup.get("free_shipping");
  }

  get distance() {
    return this.formGroup.get("distance");
  }

  get location() {
    return this.formGroup.get("location");
  }

  enable_zip() {
    this.zip_code.enable();
  }

  disable_zip() {
    this.zip_code.disable();
    this.zip_code.setValue("");
    this.zip_code.markAsUntouched();
  }

  async get_autocomplete_zips() {
    var temp = [];
    var autocomplete: any;
    var autocomplete_url =
      "http://localhost:8080/autocomplete?pincode=" + this.zip_code.value;
    autocomplete = await this.myservice
      .getAutoCompleteValues(autocomplete_url)
      .toPromise();
    console.log(autocomplete);
    for (var i = 0; i < autocomplete.length; i++) {
      temp.push(autocomplete[i]);
    }
    this.options = temp;
  }

  reset_autocomplete() {
    this.options = [];
  }

  zip_call_function() {
    if (this.zip_code.value.trim().length >= 3) {
      this.get_autocomplete_zips();
    } else {
      this.reset_autocomplete();
    }
  }

  async tab_slider(slide: string) {
    // this.current_page = slide;
    // if (slide == 'results'){
    this.hidewishlist = true;
    this.results_dark = true;
    this.wish_dark = false;
    this.showresult = true;

    if (this.progress_flag) {
      this.child_progress = false;
      this.progress_flag = true;
    }

    // } else {

    // }

    await delay(500);
    this.child_progress = true;
  }

  async tab_slider_w() {
    this.hidewishlist = false;
    this.showresult = false;
    this.results_dark = false;
    this.wish_dark = true;

    await delay(500);
    this.child_progress = true;
  }

  formGroup = new FormGroup({
    keyword_name: new FormControl(""),
    category: new FormControl("0"),
    new_condition: new FormControl(""),
    used_condition: new FormControl(""),
    unspec_condition: new FormControl(""),
    local_shipping: new FormControl(""),
    free_shipping: new FormControl(""),
    distance: new FormControl(""),
    location: new FormControl("current"),
    zip_code: new FormControl("")
  });

  async createEbayQuery(current_location: string) {
    var query = "http://localhost:8080/productsearch?";
    query += "keyword=" + this.keyword_name.value;
    query += "&category=" + this.category.value;

    query += "&new_condition=";
    if (this.new_condition.value == true) {
      query += "true";
    } else {
      query += "false";
    }

    query += "&used_condition=";
    if (this.used_condition.value == true) {
      query += "true";
    } else {
      query += "false";
    }

    query += "&unspec_condition=";
    if (this.unspec_condition.value == true) {
      query += "true";
    } else {
      query += "false";
    }

    query += "&local_shipping=";

    if (this.local_shipping.value == true) {
      query += "true";
    } else {
      query += "false";
    }

    query += "&free_shipping=";
    if (this.free_shipping.value == true) {
      query += "true";
    } else {
      query += "false";
    }

    query += "&distance=";
    if (this.distance.value === "") {
      query += "10";
    } else {
      query += this.distance.value;
    }

    query += "&zip=";
    if (current_location == "zip") {
      query += this.zip_code.value;
    } else {
      query += current_location;
    }

    console.log(query);
    this.allProductsJSON = await this.myservice
      .ebayApiProductsCall(query)
      .toPromise();
    this.data.modifyMessage(this.allProductsJSON);
    this.showresult = true;
    this.parseJSON();
  }

  parseJSON() {
    console.log(this.allProductsJSON);
    if (this.allProductsJSON.findItemsAdvancedResponse[0].ack == "Success") {
      if (
        !this.allProductsJSON.findItemsAdvancedResponse[0].searchResult[0].hasOwnProperty(
          "item"
        )
      ) {
        console.log("Empty Results");
        this.emptyResults = true;
        // console.log(this.emptyResults);
      } else {
        this.emptyResults = false;
        // console.log(this.emptyResults);
        var searchResults = this.allProductsJSON.findItemsAdvancedResponse[0]
          .searchResult[0].item;
        for (var i = 0; i < searchResults.length; i++) {
          if (searchResults[i].hasOwnProperty("sellingStatus")) {
            var s = searchResults[i].sellingStatus[0];
            if (s.hasOwnProperty("currentPrice")) {
              var cur_price = "$" + s.currentPrice[0].__value__;
            }
          }

          if (searchResults[i].hasOwnProperty("shippingInfo")) {
            var s = searchResults[i].shippingInfo[0];
            if (s.hasOwnProperty("shippingServiceCost")) {
              var cost = "";
              if (s.shippingServiceCost[0].__value__ == "0.0") {
                cost = "Free Shipping";
              } else {
                cost = "$" + s.shippingServiceCost[0].__value__;
              }
            }
          }
          var shipping_array = [];
          if (searchResults[i].hasOwnProperty("shippingInfo")) {
            var name = "Shipping Cost";
            var value = cost;
            shipping_array.push([name, value]);
            if (
              searchResults[i].shippingInfo[0].hasOwnProperty("shipToLocations")
            ) {
              shipping_array.push([
                "Shipping Locations",
                searchResults[i].shippingInfo[0].shipToLocations[0]
              ]);
            }
            if (
              searchResults[i].shippingInfo[0].hasOwnProperty("handlingTime")
            ) {
              var ht = searchResults[i].shippingInfo[0].handlingTime[0];
              if (ht == "0" || ht == "1") {
                shipping_array.push(["Handling Time", ht + " " + "Day"]);
              } else {
                shipping_array.push(["Handling Time", ht + " " + "Days"]);
              }
            }

            if (
              searchResults[i].shippingInfo[0].hasOwnProperty(
                "expeditedShipping"
              )
            ) {
              shipping_array.push([
                "Expedited Shipping",
                searchResults[i].shippingInfo[0].expeditedShipping[0]
              ]);
            }

            if (
              searchResults[i].shippingInfo[0].hasOwnProperty(
                "oneDayShippingAvailable"
              )
            ) {
              shipping_array.push([
                "One Day Shipping",
                searchResults[i].shippingInfo[0].oneDayShippingAvailable[0]
              ]);
            }
          }

          if (searchResults[i].hasOwnProperty("returnsAccepted")) {
            shipping_array.push([
              "Return Accepted",
              searchResults[i].returnsAccepted[0]
            ]);
          }

          var pc = "";
          if (searchResults[i].hasOwnProperty("postalCode")) {
            pc = searchResults[i].postalCode[0];
          } else {
            pc = "N/A";
          }
          var sn = "";
          if (searchResults[i].hasOwnProperty("sellerInfo")) {
            if (
              searchResults[i].sellerInfo[0].hasOwnProperty("sellerUserName")
            ) {
              sn = searchResults[i].sellerInfo[0].sellerUserName[0];
            }
          }

          var score = "N/A";
          var feed_star = "N/A";
          var top = "N/A";
          var s_name = "N/A";
          var s_url = "N/A";
          var pos = "N/A";
          var user = "N/A";

          if (searchResults[i].hasOwnProperty("title")) {
            var t = searchResults[i].title[0];
            // var t = "Puma Premimum scuderia Ferrari Teamtogether Events league";
            var c = true;
            if (t.length >= 35) {
              if (t[35] != " ") {
                t = t.substring(0, t.substring(0, 35).lastIndexOf(" ")) + "...";
              } else {
                t = t.substring(0, 35) + "...";
              }
            } else {
              c = false;
            }
          }
          if (searchResults[i].hasOwnProperty("galleryURL")) {
            var img = String(searchResults[i].galleryURL[0]);
          } else {
            var img = " ";
          }

          var check_bool = false;
          var id = searchResults[i].itemId[0];
          for (var k = 0; k < this.checklist.length; k++) {
            if (this.checklist[k].itemid == id) {
              check_bool = true;
            }
          }

          if (searchResults[i].hasOwnProperty("viewItemURL")) {
            var url = String(searchResults[i].viewItemURL[0]);
          }

          var temp: ProductList = {
            itemid: id,
            image: img,
            title: searchResults[i].title[0],
            cut_title: t,
            price: cur_price,
            shipping: cost,
            wishlist: check_bool,
            zip: pc,
            seller: sn,
            shipping_info: shipping_array,
            score: score,
            popularity: pos,
            feedback_rating_star: feed_star,
            top_rated: top,
            store_name: s_name,
            buy_product: s_url,
            condensed: c,
            user_id: user,
            share_url: url
          };
          this.objects_array.push(temp);
        }
        console.log(this.objects_array);
        this.data.modifyTable(this.objects_array);
        this.hide_progress = true;
      }
    }
  }

  async onMyFormSubmit() {
    this.hidewishlist = true;
    this.hide_progress = false;
    var cur_loc: any;
    this.objects_array = [];
    console.log("entering search");
    if (this.location.value == "current") {
      cur_loc = await this.myservice.getCurrentLocation().toPromise();
      cur_loc = cur_loc.zip;
      console.log(cur_loc);
    } else {
      cur_loc = "zip";
    }
    if (this.current_page == "wish_list") {
      this.tab_slider("results");
      this.progress_flag = false;
    }
    this.createEbayQuery(cur_loc);
    this.searchclicked = true;
    this.resultcolors();
  }

  onClear() {
    this.formGroup.patchValue({
      keyword_name: "",
      category: "0",
      new_condition: "",
      used_condition: "",
      unspec_condition: "",
      local_shipping: "",
      free_shipping: "",
      distance: "",
      location: "current",
      zip_code: ""
    });
    this.zip_code.markAsUntouched();
    this.keyword_name.markAsUntouched();
    this.showresult = false;
    this.hidewishlist = true;
    this.resultcolors();

    console.log(this.formGroup.value);
    // if (this.current_page=='wish_list'){
    //   this.tab_slider('results');
    //   this.progress_flag = false;
    // }
    this.zip_code.disable();
    this.searchclicked = false;
  }

  constructor(
    private http: HttpClient,
    private myservice: ProductSearchServiceService,
    private data: DataService
  ) {
    this.wish_dark = false;
    this.results_dark = true;
  }

  resultcolors() {
    this.wish_dark = false;
    this.results_dark = true;
  }

  wishcolors() {
    this.wish_dark = true;
    this.results_dark = false;
  }

  trackWishList() {
    console.log("only once");
    for (var i = 0; i < this.objects_array.length; i++) {
      if (this.data.already_wished(this.objects_array[i])) {
        this.objects_array[i].wishlist = true;
      } else {
        this.objects_array[i].wishlist = false;
      }
    }
  }

  ngOnInit() {
    this.zip_code.disable();
    this.hide_progress = true;
    this.data.init_wish_list();
    this.progress_flag = true;

    this.data.new_wish_observe.subscribe(message => {
      this.checklist = message;
      this.trackWishList();
    });
    console.log("checklist", this.checklist);

    // this.data.myslide.subscribe(
    //   message => {
    //     if (message != null){
    //       this.tab_slider('results');
    //       this.showresult=true;
    //       this.hideresultsforwish = true;
    //       this.data.modifychildSlide(message)}
    //     }
    // )
  }
}
