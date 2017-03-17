<script>
/*
===================================
| DATALAYER ARCHITECTURE: SHOPIFY |
-----------------------------------

DEFINITION:
A data layer helps you collect more accurate analytics data, that in turn allows you to better understand what potential buyers are doing on your website and where you can make improvements. It also reduces the time to implement marketing tags on a website, and reduces the need for IT involvement, leaving them to get on with implementing new features and fixing bugs.

RESOURCES:
http://www.datalayerdoctor.com/a-gentle-introduction-to-the-data-layer-for-digital-marketers/
http://www.simoahava.com/analytics/data-layer/

AUTHORS:
Mechelle Warneke = [{
Email: mechellewarneke@gmail.com,
Website: mechellewarneke.com,
BVACCEL: [{
    Email: mechelle@bvaccel.com,
    Position: XO Strategist | Technical Web Analyst
}]
}];

Tyler Shambora = [{
Website: tylershambora.com,
BVACCEL: [{
    Email: tyler@bvaccel.com,
    Position: Lead Web Developer
}]
}];

EXTERNAL DEPENDENCIES:
* jQuery
* jQuery Cookie Plugin v1.4.1 - https://github.com/carhartl/jquery-cookie
* cartjs - https://github.com/discolabs/cartjs

DataLayer Architecture: Shopify v1.3.1
COPYRIGHT 2016
LICENSES: MIT ( https://opensource.org/licenses/MIT )
*/

/* =======================
| PREREQUISITE LIBRARIES |
----------------------- */

// jquery-cookies.js

if(!window.jQuery){
  var jqueryScript = document.createElement('script');
  jqueryScript.setAttribute('src','https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js');
  document.head.appendChild(jqueryScript);
}

// set loader variable
// keep checking loader is done
__bva__jQueryinterval = setInterval(function(){

  if( window.jQuery ){

  // when loader is done stop interval 
  clearInterval(__bva__jQueryinterval)

if(typeof $.cookie !== undefined){ 

  /*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
 (function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD (Register as an anonymous module)
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {

  var pluses = /\+/g;

  function encode(s) {
    return config.raw ? s : encodeURIComponent(s);
  }

  function decode(s) {
    return config.raw ? s : decodeURIComponent(s);
  }

  function stringifyCookieValue(value) {
    return encode(config.json ? JSON.stringify(value) : String(value));
  }

  function parseCookieValue(s) {
    if (s.indexOf('"') === 0) {
      // This is a quoted cookie as according to RFC2068, unescape...
      s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }

    try {
      // Replace server-side written pluses with spaces.
      // If we can't decode the cookie, ignore it, it's unusable.
      // If we can't parse the cookie, ignore it, it's unusable.
      s = decodeURIComponent(s.replace(pluses, ' '));
      return config.json ? JSON.parse(s) : s;
    } catch(e) {}
  }

  function read(s, converter) {
    var value = config.raw ? s : parseCookieValue(s);
    return $.isFunction(converter) ? converter(value) : value;
  }

  var config = $.cookie = function (key, value, options) {

    // Write

    if (arguments.length > 1 && !$.isFunction(value)) {
      options = $.extend({}, config.defaults, options);

      if (typeof options.expires === 'number') {
        var days = options.expires, t = options.expires = new Date();
        t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
      }

      return (document.cookie = [
        encode(key), '=', stringifyCookieValue(value),
        options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
        options.path    ? '; path=' + options.path : '',
        options.domain  ? '; domain=' + options.domain : '',
        options.secure  ? '; secure' : ''
        ].join(''));
    }

    // Read

    var result = key ? undefined : {},
      // To prevent the for loop in the first place assign an empty array
      // in case there are no cookies at all. Also prevents odd result when
      // calling $.cookie().
      cookies = document.cookie ? document.cookie.split('; ') : [],
      i = 0,
      l = cookies.length;

      for (; i < l; i++) {
        var parts = cookies[i].split('='),
        name = decode(parts.shift()),
        cookie = parts.join('=');

        if (key === name) {
        // If second argument (value) is a function it's a converter...
        result = read(cookie, value);
        break;
      }

      // Prevent storing a cookie that we couldn't decode.
      if (!key && (cookie = read(cookie)) !== undefined) {
        result[name] = cookie;
      }
    }

    return result;
  };

  config.defaults = {};

  $.removeCookie = function (key, options) {
    // Must not alter options, thus extending a fresh object...
    $.cookie(key, '', $.extend({}, options, { expires: -1 }));
    return !$.cookie(key);
  };

}));

}

// SEARCH PARAMETERS
QueryString = function () {
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  }
  return query_string;
} ();

/* =====================
| DYNAMIC DEPENDENCIES |
--------------------- */

var template = '{{ template }}';

__bva__ = {
  dynamicCart: false,  // if cart is dynamic (meaning no refresh on cart add) set to true
  debug: false, // if true, console messages will be displayed
  cart: null,
  wishlist: null,
  removeCart: null
}; 

customBindings = {
  cartTriggers: [],
  viewCart: [],
  removeCartTrigger: [],
  cartVisableSelector: [],
  promoSubscriptionsSelectors: [],
  promoSuccess: [],
  ctaSelectors: [],
  newsletterSelectors: [],
  newsletterSuccess: [],
  searchTermQuery: [QueryString.q],
  searchPage: ['search'],
  wishlistSelector: [],
  removeWishlist: [],
  wishlistPage: []
}

/* DO NOT EDIT */
defaultBindings = {
  cartTriggers: ['form[action="/cart/add"] [type="submit"]'],
  viewCart: ['form[action="/cart"]'],
  removeCartTrigger: ['[href*="/cart/change"]'],
  cartVisableSelector: [],
  promoSubscriptionsSelectors: [],
  promoSuccess: [],
  ctaSelectors: [],
  newsletterSelectors: [],
  newsletterSuccess: [],
  searchTermQuery: [],
  searchPage: [],
  wishlistSelector: [],
  removeWishlist: [],
  wishlistPage: []
}

objectArray = customBindings;
outputObject = __bva__;

function applyBindings(objectArray, outputObject){
  for (var x in objectArray) {  
    var key = x;
    var objs = objectArray[x]; 
    values = [];    
    if(objs.length > 0){    
      values.push(objs) 
      if(key in outputObject){              
        values.push(outputObject[key]); 
        outputObject[key] = values.join(", "); 
      }else{        
        outputObject[key] = values.join(", ");
      }   
    }  
  }
}

applyBindings(customBindings, __bva__);
applyBindings(defaultBindings, __bva__);

/* ======================
| Begin dataLayer Build |
---------------------- */
if(__bva__.debug){
console.log('=====================\n| DATALAYER SHOPIFY |\n---------------------')
console.log('Page Template: {{ template }}');
}

window.dataLayer = window.dataLayer || [];  // init data layer if doesn't already exist

dataLayer.push({'event': 'Begin DataLayer'});

/* Landing Page Cookie
-----------------------
1. Detect if user just landed on the site
2. Only fires if Page Title matches website */

$.cookie.raw = true;
if ($.cookie('landingPage') === undefined || $.cookie('landingPage').length === 0) {
  var landingPage = true;
  $.cookie('landingPage', unescape);
  $.removeCookie('landingPage', {path: '/'});
  $.cookie('landingPage', 'landed', {path: '/'});
} else {
  var landingPage = false;
  $.cookie('landingPage', unescape);
  $.removeCookie('landingPage', {path: '/'});
  $.cookie('landingPage', 'refresh', {path: '/'});
}
if (__bva__.debug) {
  console.log('Landing Page: ' + landingPage);
}

/* Log State Cookie
------------------- */

{% if customer %}
var isLoggedIn = true;
{% else %}
var isLoggedIn = false;
{% endif %}
if (!isLoggedIn) {
  $.cookie('logState', unescape);
  $.removeCookie('logState', {path: '/'});
  $.cookie('logState', 'loggedOut', {path: '/'});
} else {
  if ($.cookie('logState') === 'loggedOut' || $.cookie('logState') === undefined) {
    $.cookie('logState', unescape);
    $.removeCookie('logState', {path: '/'});
    $.cookie('logState', 'firstLog', {path: '/'});
  } else if ($.cookie('logState') === 'firstLog') {
    $.cookie('logState', unescape);
    $.removeCookie('logState', {path: '/'});
    $.cookie('logState', 'refresh', {path: '/'});
  }
}

if ($.cookie('logState') === 'firstLog') {
  var firstLog = true;
} else {
  var firstLog = false;
}

/* ==========
| DATALAYERS |
----------- */

/* DATALAYER: Landing Page
--------------------------
Fires any time a user first lands on the site. */

if ($.cookie('landingPage') === 'landed') {
  dataLayer.push({
    'pageType': 'Landing',
    'event': 'Landing'
  });
  if (__bva__.debug) {
    console.log('DATALAYER: Landing Page fired.');
  }
}

/* DATALAYER: Log State
-----------------------
1. Determine if user is logged in or not.
2. Return User specific data. */

var logState = {
  {% if shop.customer_accounts_enabled %}
  {% if customer %}
  'userId': '{{customer.id}}',
  'customerEmail': '{{customer.email}}',
  'logState': "Logged In",
  'customerInfo': {
    'firstName': '{{customer_address.first_name}}',
    'lastName': '{{customer_address.last_name}}',
    'address1': '{{customer_address.address1}}',
    'address2': '{{customer_address.address2}}',
    'street': '{{customer_address.street}}',
    'city': '{{customer_address.city}}',
    'province': '{{customer_address.province}}',
    'zip': '{{customer_address.zip}}',
    'country': '{{customer_address.country}}',
    'phone': '{{customer_address.phone}}',
  },
  {% else %}
  'logState': "Logged Out",
  {% endif %}
  {% endif %}
  'firstLog': firstLog,
  'customerEmail': '{{customer.email}}',
  'timestamp': Date.now(),
  {% if customer.orders_count >= 2 %}
  'customerType': 'Returning',
  'customerTypeNumber': '0',
  {% else %}
  'customerType': 'New',
  'customerTypeNumber':'1',
  {% endif %}
  'shippingInfo': {
    'fullName':'{{checkout.shipping_address.name}}',
    'firstName': '{{checkout.shipping_address.first_name}}',
    'lastName': '{{checkout.shipping_address.last_name}}',
    'address1': '{{checkout.shipping_address.address1}}',
    'address2': '{{checkout.shipping_address.address2}}',
    'street': '{{checkout.shipping_address.street}}',
    'city': '{{checkout.shipping_address.city}}',
    'province': '{{checkout.shipping_address.province}}',
    'zip': '{{checkout.shipping_address.zip}}',
    'country': '{{checkout.shipping_address.country}}',
    'phone': '{{checkout.shipping_address.phone}}',
  },
  'billingInfo': {
    'fullName':'{{checkout.billing_address.name}}',
    'firstName': '{{checkout.billing_address.first_name}}',
    'lastName': '{{checkout.billing_address.last_name}}',
    'address1': '{{checkout.billing_address.address1}}',
    'address2': '{{checkout.billing_address.address2}}',
    'street': '{{checkout.billing_address.street}}',
    'city': '{{checkout.billing_address.city}}',
    'province': '{{checkout.billing_address.province}}',
    'zip': '{{checkout.billing_address.zip}}',
    'country': '{{checkout.billing_address.country}}',
    'phone': '{{checkout.billing_address.phone}}',
  },
  'checkoutEmail': '{{checkout.email}}',
  'currency': '{{shop.currency}}',
  'pageType': 'Log State',
  'event': 'Log State'
}

dataLayer.push(logState);
if(__bva__.debug){
console.log("Log State"+" :"+JSON.stringify(logState, null, " "));
}

/*DATALAYER: Homepage
--------------------------- */

if(document.location.pathname == "/"){
  var homepage = {
    'pageType': 'Homepage',
    'event': 'Homepage'
  };
  dataLayer.push(homepage);
  if(__bva__.debug){
  console.log("Homepage"+" :"+JSON.stringify(homepage, null, " "));
  }
}

/*DATALAYER: Blog Articles
---------------------------
Fire on Blog Article Pages */

{% if template contains 'article' %}
var blog = {
  'author': '{{ article.author }}',
  'title': '{{ article.title }}',
  'dateCreated': '{{ article.created_at }}',
  'pageType': 'Blog',
  'event': 'Blog'
};
dataLayer.push(blog);
if(__bva__.debug){
console.log("Blog"+" :"+JSON.stringify(blog, null, " "));
}
{% endif %}


/* DATALAYER: Product List Page (Collections, Category)
-------------------------------------------------------
Fire on all product listing pages. */

{% if template contains 'collection' %}
  var product = {
    'products': [
      {% for product in collection.products %}{
      'id': '{{ product.id }}',
      'sku':'{{product.selected_variant.sku}}',
      'variantId':'{{product.selected_variant.variant.id}}',
      'productType': "{{product.type}}",
      'name': '{{ product.title }}',
      'price': '{{ product.price | money_without_currency | remove: "," }}',
      'imageURL':"https:{{ product.featured_image.src|img_url:'grande' }}", 
      'productURL': '{{ shop.secure_url }}{{product.url}}',
      'brand': '{{ shop.name }}',              
      'comparePrice':'{{ product.compare_at_price_max|money_without_currency}}',
      'categories': {{ product.collections|map:"title"|json }},
      'currentCategory': "{{ collection.title }}",
      'productOptions': {
        {% for option in product.options_with_values %}
        {% for value in option.values %}
        {% if option.selected_value == value %}
        "{{ option.name }}":"{{ value }}"
        {% endif %}
        {% endfor %}
        {% endfor %}
      }
    },
    {% endfor %}]
  };
var collections = {
  'productList': "{{ collection.title }}",
  'pageType': 'Collection',
  'event': 'Collection'
};
dataLayer.push(product);
dataLayer.push(collections);
if(__bva__.debug){
console.log("Collections"+" :"+JSON.stringify(collections, null, " "));
}
{% endif %}

/* DATALAYER: Product Page
--------------------------
Fire on all Product View pages. */

if (template.match(/.*product.*/gi) && !template.match(/.*collection.*/gi)) {
  sku = '';
  var product = {
    'products': [{
      'id': '{{ product.id }}',
      'sku':'{{product.selected_variant.sku}}',
      'variantId':'{{product.selected_variant.variant.id}}',
      'productType': "{{product.type}}",
      'name': '{{ product.title }}',
      'price': '{{ product.price | money_without_currency | remove: "," }}',
      'imageURL':"https:{{ product.featured_image.src|img_url:'grande' }}", 
      'productURL': '{{ shop.secure_url }}{{product.url}}',
      'brand': '{{ shop.name }}',              
      'comparePrice':'{{ product.compare_at_price_max|money_without_currency}}',
      'categories': {{ product.collections|map:"title"|json }},
      'currentCategory': "{{ collection.title }}",
      'productOptions': {
        {% for option in product.options_with_values %}
        {% for value in option.values %}
        {% if option.selected_value == value %}
        "{{ option.name }}":"{{ value }}"
        {% endif %}
        {% endfor %}
        {% endfor %}
      }
    }]
  };
  function productView(){
    var sku = '{{product.selected_variant.sku}}';
    dataLayer.push(product,
      {'pageType': 'Product',
      'event': 'Product'});
    if(__bva__.debug){
    console.log("Product"+" :"+JSON.stringify(product, null, " "));
  }
  }
  productView();

  $(__bva__.cartTriggers).click(function(){
    var skumatch = '{{product.selected_variant.sku}}';
    if(sku != skumatch){
      productView();
    }
  });
}

/* DATALAYER: Cart View
-----------------------
1. Fire anytime a user views their cart (non-dynamic) */

{% if template contains 'cart' %}
var cart = {
  'products':[{% for line_item in cart.items %}{
    'id': parseFloat({{ line_item.product_id }}),
    'sku': '{{ line_item.sku }}',
    'variant': '{{line_item.variant_id}}',
    'name': '{{ line_item.title }}',
    'price': '{{ line_item.price | money_without_currency }}',
    'quantity': '{{ line_item.quantity }}'
  },{% endfor %}],
  'pageType': 'Cart',
  'event': 'Cart'
};

dataLayer.push(cart);
if(__bva__.debug){
console.log("Cart"+" :"+JSON.stringify(cart, null, " "));
}
__bva__.cart = cart.products;
$(__bva__.removeCartTrigger).on('click', function (event) {
  setTimeout(function(){
  // ------------------------------------------------------------------- remove from cart
  jQuery.getJSON("/cart", function (response) {
        // --------------------------------------------- get Json response 
        __bva__.removeCart = response;
        var removeFromCart = {
          'products': __bva__.removeCart.items.map(function (line_item) {
            return {
              'id': line_item.product_id,
              'sku': line_item.sku,
              'variant': line_item.variant_id,
              'name': line_item.title,
              'price': (line_item.price/100),
              'quantity': line_item.quantity
            }
          }),
          'pageType': 'Remove from Cart',
          'event': 'Remove from Cart'         
        };

        __bva__.removeCart = removeFromCart;
        var cartIDs = [];
        var removeIDs = [];
        var removeCart = [];
        for (var i = __bva__.cart.length - 1; i >= 0; i--) {
          var x = parseFloat(__bva__.cart[i].variant);
          cartIDs.push(x);
        }

        for (var i = __bva__.removeCart.products.length - 1; i >= 0; i--) {
          var x = parseFloat(__bva__.removeCart.products[i].variant);
          removeIDs.push(x);
        }

        function arr_diff (a1, a2) {
            var a = [], diff = [];
            for (var i = 0; i < a1.length; i++) {
                a[a1[i]] = true;
            }
            for (var i = 0; i < a2.length; i++) {
                if (a[a2[i]]) {
                    delete a[a2[i]];
                } else {
                    a[a2[i]] = true;
                }
            }
            for (var k in a) {
                diff.push(k);
            }
            return diff;
        };

        var x = arr_diff(cartIDs,removeIDs)[0];
        for (var i = __bva__.cart.length - 1; i >= 0; i--) {
          if(__bva__.cart[i].variant == x){
            removeCart.push(__bva__.cart[i]);
          }
        }

        dataLayer.push(removeCart);
        if (__bva__.debug) {
          console.log("Cart"+" :"+JSON.stringify(removeCart, null, " "));
        }

          // --------------------------------------------- get Json response 
        });
}, 2000);
  // ------------------------------------------------------------------- remove from cart
});
{% endif %}

/* DATALAYER Variable: Checkout & Transaction Data */

transactionData = {
  'transactionNumber': '{{checkout.order_id}}',
  'transactionId': '{{checkout.order_number}}',
  'transactionAffiliation': '{{shop.name}}',
  'transactionTotal': '{{checkout.total_price |  money_without_currency| remove: ","}}',
  'transactionTax': '{{checkout.tax_price |  money_without_currency| remove: ","}}',
  'transactionShipping': '{{checkout.shipping_price |  money_without_currency| remove: ","}}',
  'transactionSubtotal': '{{checkout.subtotal_price |  money_without_currency| remove: ","}}',

  {% for discount in checkout.discounts %}
  'promoCode':'{{discount.code}}',
  'discount': '{{discount.amount | money_without_currency}}',
  {% endfor %}

  'products': [

  {% for line_item in checkout.line_items %}
  {
    'id': '{{line_item.product_id}}',
    'sku': '{{line_item.sku}}',
    'variantId': '{{line_item.variant_id}}',
    'name': '{{line_item.title}}',
    'category': '{{ collection.title }}',
    'price': '{{line_item.price | money_without_currency| remove: ","}}',
    'quantity': '{{line_item.quantity}}'
  },
  {% endfor %}

  ]}
  
/* DATALAYER: Checkout
-------------------------- */
if(Shopify.Checkout){
  if(Shopify.Checkout.step.length > 0){
    if (Shopify.Checkout.step === 'contact_information'){
      dataLayer.push(transactionData,{
        'event':'Customer Information',
        'pageType':'Customer Information'});
    }else if (Shopify.Checkout.step === 'shipping_method'){
      dataLayer.push(transactionData,{
        'event':'Shipping Information',
        'pageType':'Shipping Information'});
    }else if( Shopify.Checkout.step === "payment_method" ){
      dataLayer.push(transactionData,{
        'event':'Add Payment Info',
        'pageType':'Add Payment Info'});
    }
  }

__bva__dateNow = (new Date(Date.now() - 100000)).toUTCString();
__bva__orderDate = new Date({{transaction.created_at}}).toUTCString();

if(__bva__dateNow >= __bva__orderDate){

  console.log("Order Date Match");
    dataLayer.push(transactionData,{
    'pageType':'Transaction',
    'event':'Transaction'
  });

}else if(__bva__.debug == true){

/* DATALAYER: Transaction
-------------------------- */
if(Shopify.Checkout.page == "thank_you"){
  dataLayer.push(transactionData,{
    'pageType':'Transaction',
    'event':'Transaction'
  });
  }
}else{

  /* DATALAYER: Transaction
-------------------------- */
if(Shopify.Checkout.page == "thank_you"){
  dataLayer.push(transactionData,{
    'pageType':'Transaction',
    'event':'Transaction'
  });
  }
}
}

/* DATALAYER: All Pages
-----------------------
Fire all pages trigger after all additional dataLayers have loaded. */

dataLayer.push({
  'event': 'DataLayer Loaded'
});

console.log('DATALAYER: DataLayer Loaded.');
/*
============================
| dataLayer Event Bindings |
----------------------------
*/

/* DATALAYER: Add to Cart / Dynamic Cart View
---------------------------------------------
Fire all pages trigger after all additional dataLayers have loaded. */

$(document).ready(function() {

/* DATALAYER: Search Results
--------------------------- */

var searchPage = new RegExp(__bva__.searchPage, "g");
if(document.location.pathname.match(searchPage)){
  var search = {
    'searchTerm': QueryString.__bva__.searchTermQuery,
    'pageType': "Search",
    'event': "Search"
  };

  dataLayer.push(search);
  if(__bva__.debug){
  console.log("Search"+" :"+JSON.stringify(search, null, " "));
}
}

/* DATALAYER: Cart
------------------- */

// STAGE CART DATA
function mapJSONcartData(){
  jQuery.getJSON('/cart.js', function (response) {
    // --------------------------------------------- get Json response 
    __bva__.cart = response;
    var cart = {
     'products': __bva__.cart.items.map(function (line_item) {
      return {
        'id': line_item.id,
        'sku': line_item.sku,
        'variant': line_item.variant_id,
        'name': line_item.title,
        'price': (line_item.price/100),
        'quantity': line_item.quantity
      }
    }),
     'pageType': 'Cart',
     'event': 'Cart'     
   };

   dataLayer.push(cart);
   if (__bva__.debug) {
    console.log("Cart"+" :"+JSON.stringify(cart, null, " "));
  }
  // --------------------------------------------- get Json response 
});
}

// ADD TO CART
$(__bva__.cartTriggers).on('click', function (event) {
  // ------------------------------------------------------------------------- add to cart

  dataLayer.push(product, 
    {'pageType': 'Add to Cart',
    'event': 'Add to Cart'    });
  
  if (__bva__.debug) {
    console.log("Add to Cart"+" :"+JSON.stringify(product, null, " "));
  }

  // IF DYNAMIC CART IS TRUE
  if (__bva__.dynamicCart) {
    console.log("dynamic");
    // ---------------------------------- if dynamic cart is true
    var cartCheck = setInterval(function () {
      // -------------------------------------- begin check interval
      if ($(__bva__.cartVisableSelector).length > 0) {
        // ------------------------------------------------------------------ check visible selectors
        clearInterval(cartCheck);
        mapJSONcartData();
        // ------------------------------------------------------------------ check visible selectors
        $(__bva__.removeCartTrigger).on('click', function (event) {
        // ------------------------------------------------------------------- remove from cart
        console.log('testremove')
        var link = $(this).attr("href");
        jQuery.getJSON(link, function (response) {
        // --------------------------------------------- get Json response 
        __bva__.removeCart = response;
        var removeFromCart = {
          'products': __bva__.removeCart.items.map(function (line_item) {
            return {
              'id': line_item.id,
              'sku': line_item.sku,
              'variant': line_item.variant_id,
              'name': line_item.title,
              'price': (line_item.price/100),
              'quantity': line_item.quantity
            }
          }),
          'pageType': 'Remove from Cart',
          'event': 'Remove from Cart'         
        };

        dataLayer.push(removeFromCart);

        if (__bva__.debug) {
          console.log("Cart"+" :"+JSON.stringify(removeFromCart, null, " "));
        }

        // --------------------------------------------- get Json response 
      });
    // ------------------------------------------------------------------- remove from cart
  });
      }
  // -------------------------------------- begin check interval
}, 500);
  // ---------------------------------- if dynamic cart is true
}
// ------------------------------------------------------------------------- add to cart
});

$(__bva__.viewCart).on('click', function (event) {
  // ------------------------------------------------------------------------- view cart
  if (__bva__.dynamicCart) {
    // ---------------------------------- if dynamic cart is true
    var cartViewCheck = setInterval(function () {
      // -------------------------------------- begin check interval
      if ($(__bva__.cartVisableSelector).length > 0) {
        // ------------------------------------------------------------------ check visible selectors
        clearInterval(cartViewCheck);
        mapJSONcartData();

        $(__bva__.removeCartTrigger).on('click', function (event) {
        // ------------------------------------------------------------------- remove from cart
        console.log('testremove')
        var link = $(this).attr("href");
        jQuery.getJSON(link, function (response) {
        // --------------------------------------------- get Json response 
        __bva__.removeCart = response;
        var removeFromCart = {
          'products': __bva__.removeCart.items.map(function (line_item) {
            return {
              'id': line_item.id,
              'sku': line_item.sku,
              'variant': line_item.variant_id,
              'name': line_item.title,
              'price': (line_item.price/100),
              'quantity': line_item.quantity
            }
          }),
          'pageType': 'Remove from Cart',
          'event': 'Remove from Cart'         
        };

        dataLayer.push(removeFromCart);

        if (__bva__.debug) {
          console.log("Cart"+" :"+JSON.stringify(removeFromCart, null, " "));
        }

          // --------------------------------------------- get Json response 
        });
  // ------------------------------------------------------------------- remove from cart
});
        // ------------------------------------------------------------------ check visible selectors
      }
      // -------------------------------------- begin check interval
    }, 500);
    // ---------------------------------- if dynamic cart is true
  }
  // ------------------------------------------------------------------------- view cart
});

/* DATALAYER: Newsletter Subscription
------------------------------------- */
$(__bva__.newsletterSelectors).on('click', function () {
  var newsletterCheck = setInterval(function () {
  // -------------------------------------- begin check interval
  if ($(__bva__.newsletterSuccess).length > 0) {
      // ------------------------------------------------------------------ check visible selectors
      clearInterval(newsletterCheck);
      dataLayer.push({'event': 'Newsletter Subscription'});
      // ------------------------------------------------------------------ check visible selectors
    }
    // -------------------------------------- begin check interval
  },500);
});

/* DATALAYER: Wishlist
------------------------------------- */
setTimeout( function(){

  $(__bva__.wishlistSelector).on('click', function () {
    dataLayer.push(product,
      {'event': 'Add to Wishlist'});
    if(__bva__.debug){
    console.log("Wishlist"+" :"+JSON.stringify(product, null, " "));
}
  });

  if(document.location.pathname == __bva__.wishlistPage){
    var __bva__productLinks = $('[href*="product"]');
    var __bva__prods = [];
    var __bva__links = [];
    var __bva__count = 1;
    $(__bva__productLinks).each(function(){
      var href = $(this).attr("href")
      if(!__bva__links.includes(href)){
        __bva__links.push(href);
        $(this).attr("dataLayer-wishlist-item",__bva__count++);
        jQuery.getJSON(href, function (response) {
        // --------------------------------------------- get Json response 
        __bva__.wishlist = response;
        var wishlistproducts = {
          'id': __bva__.wishlist.product.id,
          'name': __bva__.wishlist.product.title,
        };

        __bva__prods.push(wishlistproducts);

         // --------------------------------------------- get Json response 
       });
      }
    });
    dataLayer.push({'products': __bva__prods, 
    'pageType': 'Wishlist',
    'event': 'Wishlist'});
  }

  var __bva__count = 1;
  var wishlistDel = $(__bva__.removeWishlist)
  wishlistDel.each(function(){
    $(this).attr("dataLayer-wishlist-item-del",__bva__count++);
  });
  $(__bva__.removeWishlist).click(function(){
    console.log('click')
    var index = $(this).attr("dataLayer-wishlist-item-del");
    var link = $("[dataLayer-wishlist-item="+index+"]").attr("href");
    console.log(index)
    console.log(link)
    jQuery.getJSON(link, function (response) {
        // --------------------------------------------- get Json response 
        __bva__.wishlist = response;
        var wishlistproducts = {
          'id': __bva__.wishlist.product.id,
          'name': __bva__.wishlist.product.title,
        };

        dataLayer.push({'products': wishlistproducts,
        'pageType': 'Wishlist',
        'event': 'Wishlist Delete Product'});
         // --------------------------------------------- get Json response 
       });
  })
}, 10000);

/* DATALAYER: CTAs
------------------ */
$(__bva__.ctaSelectors).on('click', function () {
  var ctaCheck = setInterval(function () {
  // -------------------------------------- begin check interval
  if ($(__bva__.ctaSuccess).length > 0) {
      // ------------------------------------------------------------------ check visible selectors
      clearInterval(ctaCheck);
      dataLayer.push({'event': 'CTA'});
      // ------------------------------------------------------------------ check visible selectors
    }
    // -------------------------------------- begin check interval
  },500);
});

/* DATALAYER: Promo Subscriptions
--------------------------------- */
$(__bva__.promoSubscriptionsSelectors).on('click', function () {
  var ctaCheck = setInterval(function () {
  // -------------------------------------- begin check interval
  if ($(__bva__.promoSuccess).length > 0) {
      // ------------------------------------------------------------------ check visible selectors
      clearInterval(ctaCheck);
      dataLayer.push({'event': 'Promo Subscription'});
      // ------------------------------------------------------------------ check visible selectors
    }
    // -------------------------------------- begin check interval
  },500);
});

// Goal Tracking

// Contact
// ?contact_posted=true
if(document.location.search.match(/contact_posted\=true/g)){
  dataLayer.push({'event':'Contact Form Submission'});
}

$()
// document ready
});
// console.log("success")

}

}, 500); 

</script>