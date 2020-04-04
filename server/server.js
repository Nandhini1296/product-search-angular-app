const request = require("request");
const express = require("express");
const cors = require("cors");

const port = 8080;

const productserver = express();

var path = require("path");
productserver.use(express.static(path.join(__dirname + "dist")));
productserver.use(cors());
const allowedExt = [
  ".js",
  ".ico",
  ".css",
  ".png",
  ".jpg",
  ".woff2",
  ".woff",
  ".ttf",
  ".svg",
];

productserver.get("/autocomplete", async function (req, res) {
  var code = req.query.pincode;
  var codes = [];
  //console.log(code);
  request(
    "http://api.geonames.org/postalCodeSearchJSON?postalcode_startsWith=" +
      code +
      "&username=username&country=US&maxRows=5",
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        //console.log(body);
        content = JSON.parse(body).postalCodes;
        for (var item in content) {
          if (content.hasOwnProperty(item)) {
            codes.push(content[item].postalCode);
          }
        }
        res.status(200).send(codes);
      }
    }
  );
});

productserver.get("/productsearch", async function (req, res) {
  var ebay_api_url =
    "http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=app_name&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&paginationInput.entriesPerPage=50";
  console.log(req.query);
  ebay_api_url += "&keywords=" + encodeURI(req.query.keyword);
  if (req.query.category != "0") {
    ebay_api_url += "&categoryId=" + req.query.category;
  }
  ebay_api_url += "&buyerPostalCode=" + req.query.zip;
  ebay_api_url +=
    "&itemFilter(0).name=MaxDistance&itemFilter(0).value=" + req.query.distance;
  ebay_api_url +=
    "&itemFilter(1).name=FreeShippingOnly&itemFilter(1).value=" +
    req.query.free_shipping;
  ebay_api_url +=
    "&itemFilter(2).name=LocalPickupOnly&itemFilter(2).value=" +
    req.query.local_shipping;
  ebay_api_url +=
    "&itemFilter(3).name=HideDuplicateItems&itemFilter(3).value=true&";
  var cond_array = [];
  if (req.query.used_condition == "true") {
    cond_array.push("Used");
  }
  if (req.query.new_condition == "true") {
    cond_array.push("New");
  }
  if (req.query.unspec_condition == "true") {
    console.log(req.query.unspec_condition);
    cond_array.push("Unspecified");
  }
  if (cond_array.length != 0) {
    ebay_api_url += "itemFilter(4).name=Condition&";
    for (var i = 0; i < cond_array.length; i++) {
      ebay_api_url += "itemFilter(4).value(" + i + ")=" + cond_array[i] + "&";
    }
  }
  ebay_api_url += "outputSelector(0)=SellerInfo&outputSelector(1)=StoreInfo";
  console.log(ebay_api_url);
  request(ebay_api_url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log(JSON.parse(body));
      content = JSON.parse(body);
      //console.log(content);
      res.status(200).send(content);
    }
  });
});

productserver.get("/fetchPhotos", async function (req, res) {
  var google_photo_url = "https://www.googleapis.com/customsearch/v1?q=";
  google_photo_url += encodeURI(req.query.title);
  google_photo_url +=
    "&cx=005353111134805744157:elipuiyp90i&imgSize=huge&imgType=news&num=8&searchType=image&key=key";
  console.log(google_photo_url);
  request(google_photo_url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      content = JSON.parse(body);
      res.status(200).send(content);
    }
  });
});

productserver.get("/singleProduct", async function (req, res) {
  var ebay_single_url =
    "http://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=app_name&version=967&ItemID=";
  ebay_single_url += req.query.itemid;
  ebay_single_url += "&IncludeSelector=Description,Details,ItemSpecifics";
  console.log(ebay_single_url);
  request(ebay_single_url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      content = JSON.parse(body);
      res.status(200).send(content);
    }
  });
});

productserver.get("/similarProduct", async function (req, res) {
  var ebay_similar_url =
    "http://svcs.ebay.com/MerchandisingService?OPERATION-NAME=getSimilarItems&SERVICE-NAME=MerchandisingService&SERVICE-VERSION=1.1.0&CONSUMER-ID=app_name&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&itemId=";
  ebay_similar_url += req.query.itemid;
  ebay_similar_url += "&maxResults=20";
  console.log(ebay_similar_url);
  request(ebay_similar_url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      content = JSON.parse(body);
      res.status(200).send(content);
    }
  });
});

productserver.post("/enroll", function (req, res) {
  //console.log(req.body);
  res.status(200).send({ message: "Data received" });
});

productserver.get("*", (req, res) => {
  if (allowedExt.filter((ext) => req.url.indexOf(ext) > 0).length > 0) {
    res.sendFile(path.resolve(`dist/${req.url}`));
  } else {
    res.sendFile(path.resolve("dist/index.html"));
  }
});

productserver.listen(port, function () {
  console.log("Server running on localhost:" + port);
});
