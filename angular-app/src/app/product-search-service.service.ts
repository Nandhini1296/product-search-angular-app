import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { DataService } from "./data.service";

@Injectable({
  providedIn: "root"
})
export class ProductSearchServiceService {
  productSearchUrl = "http://localhost:8080/enroll";
  ip_apiUrl = "http://ip-api.com/json";
  displayJSON: any;
  singleJSON: any;
  similarJSON: any;
  photoJSON: any;

  current_location_json: any;

  constructor(private myhttp: HttpClient, private data: DataService) {}

  getCurrentLocation() {
    //console.log('inside_current');
    return this.myhttp.get<any>(this.ip_apiUrl);
  }

  getAutoCompleteValues(auto_url: string) {
    //console.log('inside auto');
    return this.myhttp.get<any>(auto_url);
  }

  getResultsJson(formData) {
    return this.myhttp.post<any>(this.productSearchUrl, formData);
  }

  ebayApiProductsCall(queryString: string) {
    console.log("query string: " + queryString);
    this.displayJSON = this.myhttp.get<any>(queryString);
    return this.displayJSON;
  }

  singleProductApiCall(singleUrl: string) {
    console.log("single url: " + singleUrl);
    this.singleJSON = this.myhttp.get<any>(singleUrl);
    return this.singleJSON;
  }

  similarProductsApiCall(similarUrl: string) {
    console.log("Similar Url: " + similarUrl);
    this.similarJSON = this.myhttp.get<any>(similarUrl);
    return this.similarJSON;
  }

  fetchPhotosApiCall(photoUrl: string) {
    console.log("Photo Url: " + photoUrl);
    this.photoJSON = this.myhttp.get<any>(photoUrl);
    return this.photoJSON;
  }

  modifyJSON(x) {
    this.data.modifyMessage(x);
  }
}
