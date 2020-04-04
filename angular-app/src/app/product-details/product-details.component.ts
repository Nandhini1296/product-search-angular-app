import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener
} from "@angular/core";
import { DataService } from "../data.service";
import { ProductList } from "../product-list";
import { ProductSearchServiceService } from "../product-search-service.service";
import { ProductDetails } from "../product-details";
import { SimilarProducts } from "../similar-products";
import { FormGroup, FormControl } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { delay } from "q";

@Component({
  selector: "app-product-details",
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.css"]
})
export class ProductDetailsComponent implements OnInit {
  current_product: ProductList;
  singleJSON: any;
  similarJSON: any;
  parsed_product: ProductDetails = {
    images: [],
    subtitle: "",
    price: "",
    location: "",
    return_policy: "",
    itemspecifics: []
  };
  shipping_info: [string, string][] = [];
  seller_info: [string, string][] = [];
  similar_items = [];
  show = 5;
  show_more: boolean = true;
  checklist: any = [];
  check_similar_items: boolean = true;
  sort_form = new FormGroup({
    category: new FormControl("0"),
    sortMethod: new FormControl("1")
  });
  temp_items = [];
  photosJSON: any;
  photos_array = [];
  show_seller: boolean = true;
  details_progress: boolean = true;
  is_mobile: boolean = false;
  tab_text: string = "";

  @Output() emitted_string = new EventEmitter<PaneType>();

  @Input()
  set each_prod(each_prod: ProductList) {
    // console.log('caught in product-details');
    this.current_product = each_prod;
    if (this.current_product) {
      this.create_single_query();
      this.create_similar_query();
      this.shipping_info = this.current_product.shipping_info;
    }
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    console.log("Width: " + event.target.innerWidth);
    if (event.target.innerWidth <= "726") {
      this.tab_text = "Related";
    } else {
      this.tab_text = "Similar Products";
    }
  }
  //remove input
  fb_share_url = location.href;

  get category() {
    return this.sort_form.get("category");
  }

  get sortMethod() {
    return this.sort_form.get("sortMethod");
  }

  alignment = "end";

  async list_value_changer() {
    this.details_progress = false;
    await delay(300);
    this.emitted_string.emit("results_list");
    await delay(300);
    this.details_progress = true;
  }

  constructor(
    private data: DataService,
    private myservice: ProductSearchServiceService,
    private modalService: NgbModal
  ) {
    if (!window["fbAsyncInit"]) {
      window["fbAsyncInit"] = function() {
        window["FB"].init({
          appId: "838991526451216",
          autoLogAppEvents: true,
          xfbml: true,
          version: "v3.2"
        });
      };
    }

    const fb_share_url = "https://connect.facebook.net/en_US/sdk.js";
    if (!document.querySelector(`script[src='${fb_share_url}']`)) {
      var script = document.createElement("script");
      script.src = fb_share_url;
      document.body.appendChild(script);
    }
  }

  shareToFacebook() {
    var share =
      "Buy " +
      this.current_product.title +
      " at " +
      this.current_product.price +
      " from link below";
    window["FB"].ui({
      method: "share",
      display: "popup",
      quote: share,
      href: this.current_product.share_url
    });
  }

  async getPhotos() {
    var photo_url = "http://localhost:8080/fetchPhotos?";
    photo_url += "title=" + encodeURI(this.current_product.title);
    this.photosJSON = await this.myservice
      .fetchPhotosApiCall(photo_url)
      .toPromise();
    console.log(this.photosJSON);
    this.parsePhotosJSON();
  }

  async create_single_query() {
    var single_url = "http://localhost:8080/singleProduct?";
    single_url += "itemid=" + this.current_product.itemid;
    this.data.modifyCurrentProduct(this.current_product);
    this.singleJSON = await this.myservice
      .singleProductApiCall(single_url)
      .toPromise();
    console.log(this.singleJSON);
    this.parseSingleJSON();
    //this.getPhotos();
  }

  async create_similar_query() {
    var similar_url = "http://localhost:8080/similarProduct?";
    similar_url += "itemid=" + this.current_product.itemid;
    this.similarJSON = await this.myservice
      .similarProductsApiCall(similar_url)
      .toPromise();
    console.log(this.similarJSON);
    this.parseSimilarJSON();
  }

  parsePhotosJSON() {
    var temp_photos = [];
    if (this.photosJSON.hasOwnProperty("items")) {
      var pics = this.photosJSON.items;
      for (var i = 0; i < pics.length; i++) {
        if (pics[i].hasOwnProperty("link")) {
          temp_photos.push(pics[i].link);
        }
      }
    }
    this.photos_array = temp_photos;
    var lener = this.photos_array.length;
    if (lener > 0) {
      if (lener >= 3) {
        this.snaker(1, 3);
      }
      if (lener >= 6) {
        this.snaker(2, 6);
      }
      if (lener >= 7) {
        this.snaker(5, 7);
      }
      while (this.photos_array.length < 8) {
        this.photos_array.push("");
      }
    }
  }

  snaker(a, b) {
    var t = this.photos_array[a];
    this.photos_array[a] = this.photos_array[b];
    this.photos_array[b] = t;
  }

  openCarousal(content) {
    this.modalService.open(content, { centered: true });
  }

  collapseTable() {
    if (this.show <= 5) {
      this.show = this.similar_items.length;
      this.show_more = false;
    } else if (this.show == this.similar_items.length) {
      this.show = 5;
      this.show_more = true;
    }
  }

  SortProducts() {
    var cat = parseInt(this.category.value);
    var order = parseInt(this.sortMethod.value);
    this.sortMethod.enable();
    switch (cat) {
      case 1:
        this.similar_items = this.similar_items.slice(0).sort((a, b) => {
          var x = a.title.toLowerCase();
          var y = b.title.toLowerCase();
          if (x < y) {
            return -1 * order;
          } else if (x > y) {
            return order;
            return 0;
          }
        });
        break;
      case 2:
        this.similar_items = this.similar_items.slice(0).sort((a, b) => {
          var x = a.price.search(/\d/);
          var y = b.price.search(/\d/);
          return (a.price.slice(x) - b.price.slice(y)) * order;
        });
        break;
      case 3:
        this.similar_items = this.similar_items.slice(0).sort((a, b) => {
          var x = a.shipping_cost.search(/\d/);
          var y = b.shipping_cost.search(/\d/);
          return (a.shipping_cost.slice(x) - b.shipping_cost.slice(y)) * order;
        });
        break;
      case 4:
        this.similar_items = this.similar_items.slice(0).sort((a, b) => {
          return (a.days_left - b.days_left) * order;
        });
        break;
      default:
        this.sortMethod.setValue("1");
        this.sortMethod.disable();
        this.similar_items = this.temp_items;
        break;
    }
  }

  showSellerInfo() {
    this.show_seller =
      this.current_product.buy_product != "N/A" ||
      this.current_product.store_name != "N/A" ||
      this.current_product.feedback_rating_star != "N/A" ||
      this.current_product.user_id != "N/A" ||
      this.current_product.score != "N/A" ||
      this.current_product.popularity != "N/A" ||
      this.current_product.top_rated != "N/A";
    return this.show_seller;
  }

  parseSimilarJSON() {
    //console.log("similar json: ",this.similarJSON);
    if (this.similarJSON.getSimilarItemsResponse.ack == "Success") {
      if (
        this.similarJSON.getSimilarItemsResponse.hasOwnProperty(
          "itemRecommendations"
        )
      ) {
        var items = this.similarJSON.getSimilarItemsResponse.itemRecommendations
          .item;
        if (items.length == 0) {
          this.check_similar_items = false;
        } else {
          for (var i = 0; i < items.length; i++) {
            if (items[i].hasOwnProperty("buyItNowPrice")) {
              var cost = "$" + items[i].buyItNowPrice.__value__;
            } else {
              var cost = "N/A";
            }

            //FREEEE SHIPPING
            //
            //
            if (items[i].hasOwnProperty("shippingCost")) {
              console.log(items[i].shippingCost["@currencyId"]);
              if (items[i].shippingCost["@currencyId"] == "USD") {
                var s_cost = "$" + items[i].shippingCost.__value__;
              } else {
                var s_cost =
                  String(items[i].shippingCost["@currencyId"]) +
                  items[i].shippingCost.__value__;
              }
            } else {
              var s_cost = "N/A";
            }

            if (items[i].hasOwnProperty("timeLeft")) {
              var str = items[i].timeLeft;
              var d = str.substring(
                str.lastIndexOf("P") + 1,
                str.lastIndexOf("D")
              );
            }

            if (items[i].hasOwnProperty("imageURL")) {
              var img = String(items[i].imageURL);
            } else {
              var img = "N/A";
            }

            if (items[i].hasOwnProperty("viewItemURL")) {
              var sh = String(items[i].viewItemURL);
            } else {
              var sh = "N/A";
            }

            var temp: SimilarProducts = {
              item_id: items[i].itemId,
              price: cost,
              title: items[i].title,
              shipping_cost: s_cost,
              days_left: d,
              image: img,
              share: sh
            };
            this.similar_items.push(temp);
          }
        }
        console.log(this.similar_items);
        this.temp_items = this.similar_items.slice(0);
      }
    }
  }

  removefromCart() {
    this.current_product.wishlist = false;
    this.data.removeWishList(this.current_product);
  }

  addtoCart() {
    this.current_product.wishlist = true;
    this.data.addWishList(this.current_product);
  }

  parseSingleJSON() {
    console.log(this.singleJSON.Ack);
    if (this.singleJSON.Ack == "Success") {
      if (this.singleJSON.Item.hasOwnProperty("ItemSpecifics")) {
        var temp2 = this.singleJSON.Item.ItemSpecifics.NameValueList;
        var items_array: [string, string][] = [];
        for (var i = 0; i < temp2.length; i++) {
          var name = temp2[i].Name;
          var val = temp2[i].Value;
          items_array.push([name, val]);
        }
      }

      if (this.singleJSON.Item.hasOwnProperty("ReturnPolicy")) {
        if (
          this.singleJSON.Item.ReturnPolicy.ReturnsAccepted ==
          "ReturnsNotAccepted"
        ) {
          var rp = "ReturnsNotAccepted";
        } else {
          var rp =
            this.singleJSON.Item.ReturnPolicy.ReturnsAccepted +
            " " +
            this.singleJSON.Item.ReturnPolicy.ReturnsWithin;
        }
      } else {
        var rp = "N/A";
      }

      if (this.singleJSON.Item.hasOwnProperty("Seller")) {
        var sr = this.singleJSON.Item.Seller;
        if (sr.hasOwnProperty("FeedbackScore")) {
          console.log(sr.FeedbackScore);
          this.current_product.score = sr.FeedbackScore;
        }
        if (sr.hasOwnProperty("PositiveFeedbackPercent")) {
          this.current_product.popularity = sr.PositiveFeedbackPercent;
        }
        if (sr.hasOwnProperty("FeedbackRatingStar")) {
          this.current_product.feedback_rating_star = sr.FeedbackRatingStar;
        }
        if (sr.hasOwnProperty("TopRatedSeller")) {
          this.current_product.top_rated = String(sr.TopRatedSeller);
        }
        if (sr.hasOwnProperty("UserID")) {
          this.current_product.user_id = sr.UserID;
        }
      }

      if (this.singleJSON.Item.hasOwnProperty("Storefront")) {
        var sti = this.singleJSON.Item.Storefront;
        if (sti.hasOwnProperty("StoreName")) {
          this.current_product.store_name = sti.StoreName;
        }
        if (sti.hasOwnProperty("StoreURL")) {
          this.current_product.buy_product = sti.StoreURL;
        }
      }

      var img_new = [];
      var sub_new = "N/A";
      var price_new = "N/A";
      var location_new = "N/A";

      if (this.singleJSON.Item.hasOwnProperty("PictureURL")) {
        img_new = this.singleJSON.Item.PictureURL;
      }

      if (this.singleJSON.Item.hasOwnProperty("Subtitle")) {
        sub_new = this.singleJSON.Item.Subtitle;
      }

      if (this.singleJSON.Item.hasOwnProperty("CurrentPrice")) {
        price_new = "$ " + this.singleJSON.Item.CurrentPrice.Value;
      }

      if (this.singleJSON.Item.hasOwnProperty("Location")) {
        location_new = this.singleJSON.Item.Location;
      }

      var temp: ProductDetails = {
        images: img_new,
        subtitle: sub_new,
        price: price_new,
        location: location_new,
        return_policy: rp,
        itemspecifics: items_array
      };
      this.parsed_product = temp;
    }
    console.log("Current Pro", this.current_product);
    this.showSellerInfo();
  }

  ngOnInit() {
    console.log("win", window.screen.width);
    console.log("winh", window.screen.height);

    this.details_progress = true;
    if (window.screen.width <= 726) {
      this.is_mobile = true;
    }

    if (this.is_mobile) {
      this.tab_text = "Related";
    } else {
      this.tab_text = "Similar Products";
    }
  }
}

type PaneType = "results_list" | ProductList;
