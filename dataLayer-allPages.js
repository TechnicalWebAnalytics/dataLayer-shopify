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

if(!$.cookie){ 

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

/* =====================
| DYNAMIC DEPENDENCIES |
--------------------- */

bvaDataLayerConfig = {
  dynamicCart: true,  // if cart is dynamic (meaning no refresh on cart add) set to true
  debug: true, // if true, console messages will be displayed
  cart: null
}; 

bindings = [{

// Add to Cart
cartTriggers:{
  custom:'#AddToCart', 
  dataAttrubutes:'[dataLayer-addToCart]', 
  default:'form[action="/cart/add"] [type="submit"]'
}},{ 

// View Cart
viewCart:{
  custom:'a.site-header__cart-toggle', 
  dataAttrubutes:'[dataLayer-viewCart]', 
  default:'[href="/cart"]'
}},{ 


// Visible Cart Selector
cartVisableSelector:{
  custom: '#CartDrawer', 
  dataAttrubutes: null, 
  default: null
}},{

// Promo Subscriptions
promoSubscriptionsSelectors:{
  custom: null, 
  dataAttrubutes: null, 
  default: null
}},{

// Promo Success Message
promoSuccess:{
  custom: null, 
  dataAttrubutes: null, 
  default: null
}},{

// CTA Selector
ctaSelectors:{
  custom: null, 
  dataAttrubutes: null, 
  default: null
}},{

// Newsletter Selector
newsletterSelectors:{
  custom: null, 
  dataAttrubutes: null, 
  default: null
}},{

// Newsletter Success Message
newsletterSuccess:{
  custom: null, 
  dataAttrubutes: null, 
  default: null
}

}];

function applyBindings(array, outputObject){
  for (var i = array.length - 1; i >= 0; i--) {
    array[i]
    var key = Object.keys(array[i]).toString();
    for (var x in array[i]) {
      var objs = array[i][x]
      values = [];
      for (var y in objs) {
        if(objs[y] !== null){
          values.push(objs[y])
        }
      }
      outputObject[key] = values.join(", ")
    }
  }
}

applyBindings(bindings, bvaDataLayerConfig)

/* ======================
| Begin dataLayer Build |
---------------------- */

window.dataLayer = window.dataLayer || [];  // init data layer if doesn't already exist
var template = '{{ template }}';

if (bvaDataLayerConfig.debug) {
  console.log('----------------------\nBEGIN DATALAYER BUILD\nTHEME PAGES\n----------------------');
  console.log('Page Template: {{ template }}');
}


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
if (bvaDataLayerConfig.debug) {
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
if (bvaDataLayerConfig.debug) {
  console.log('Logged In: ' + isLoggedIn + '\nFirst Log: ' + firstLog);
}

/* ==========
| DATALAYERS |
----------- */

if (bvaDataLayerConfig.debug) {
  console.log('=====================\n| DATALAYER SHOPIFY |\n---------------------')
  console.log("Timestamp: " + Date.now());
}

/* DATALAYER: Landing Page
--------------------------
Fires any time a user first lands on the site. */

if ($.cookie('landingPage') === 'landed') {
  dataLayer.push({
    'pageType': 'Landing',
    'event': 'Landing'
  });
  if (bvaDataLayerConfig.debug) {
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
  'currency': '{{shop.currency}}'
}

var dataLayerName = "Log State";

dataLayer.push(logState,{ 'event': dataLayerName });
console.log(dataLayerName+" :"+JSON.stringify(logState,null," "));

/*DATALAYER: Homepage
--------------------------- */

if(document.location.pathname == "/"){
  dataLayer.push({
    'pageType': 'Homepage',
    'event': 'Homepage'
  });
}

/*DATALAYER: Search Results
--------------------------- */

if(document.location.pathname == "/search"){
  var searchQuery = document.location.search.replace("?q=","");
  dataLayer.push({
    'searchQuery': searchQuery
  },{
    'pageType': 'Search',
    'event': 'Search'
  });
}

/*DATALAYER: Blog Articles
---------------------------
Fire on Blog Article Pages */

{% if template contains 'article' %}
dataLayer.push({
  'author': '{{ article.author }}',
  'title': '{{ article.title }}',
  'dateCreated': '{{ article.created_at }}',
}, {
  'pageType': 'Blog',
  'event': 'Blog'
});

console.log("Blog"+" :"+JSON.stringify(logState,null," "));
{% endif %}


/* DATALAYER: Product List Page (Collections, Category)
-------------------------------------------------------
Fire on all product listing pages. */

{% if template contains 'collection' %}
dataLayer.push({
  'productList': "{{ collection.title }}"
}, {
  'pageType': 'Collection',
  'event': 'Collection'
});
if (bvaDataLayerConfig.debug) {
  console.log('DATALAYER: Product List Page fired.');
}
{% endif %}

/* DATALAYER: Product Page
--------------------------
Fire on all Product View pages. */

if (template.match(/.*product.*/gi) && !template.match(/.*collection.*/gi)) {
  sku = '';
  function productView(){
    var sku = '{{product.selected_variant.sku}}';
    dataLayer.push({
      'products': [{
        'id': '{{ product.id }}',
        'sku':'{{product.selected_variant.sku}}',
        'variantId':'{{product.selected_variant.variant.id}}',
        'productType': "{{product.type}}",
        'name': '{{ product.title }}',
        'price': '{{ product.price | money_without_currency | remove: "," }}',
        'imageURL':"https:{{ product.featured_image.src|img_url:'grande' }}", 
        'productURL': '{{ shop.secure_url }}{{product.url}}',
        'brand': ' {{ product.vendor|json }}',              
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
    }, {
      'pageType': 'Product',
      'event': 'Product'
    });
    if (bvaDataLayerConfig.debug) {
      console.log('DATALAYER: Product Page fired.');
    }
  }
  productView();

  $('form[action="/cart/add"]').click(function(){
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
dataLayer.push({
  'products':[{% for line in cart.items %}{
    'id': '{{ line_item.id }}',
    'sku': '{{ line_item.sku }}',
    'variant': '{{line_item.variant_id}}',
    'name': '{{ line_item.title }}',
    'price': '{{ line_item.price | money_without_currency }}',
    'quantity': '{{ line_item.quantity }}'
  },{% endfor %}]
},{
  'pageType': 'Cart',
  'event': 'Cart'
});
{% endif %}

/* DATALAYER Variable: Checkout & Transaction Data */

transactionData = {
  'transactionNumber': '{{checkout.order_id}}',
  'transactionId': '{{checkout.order_number}}',
  'transactionAffiliation': '{{shop.name}}',
  'transactionTotal': '{{checkout.total_price |  money_without_currency| remove: ","}}',
  'transactionTax': '{{checkout.total_price |  money_without_currency| remove: ","}}',
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
        'event':'Checkout',
        'event':'Customer Information'});
    }else if (Shopify.Checkout.step === 'shipping_method'){
      dataLayer.push(transactionData,{
        'event':'Shipping Information'});
    }else if( Shopify.Checkout.step === "payment_method" ){
      dataLayer.push(transactionData,{
        'event':'Add Payment Info'});
    }
  }

/* DATALAYER: Purchase
-------------------------- */
if(Shopify.Checkout.page == "thank_you"){
  dataLayer.push(transactionData,{
    'pageType':'Purchase',
    'event':'Purchase'
  });
}
}

/* DATALAYER: All Pages
-----------------------
Fire all pages trigger after all additional dataLayers have loaded. */

dataLayer.push({
  'event': 'All Pages'
});
if (bvaDataLayerConfig.debug) {
  console.log('DATALAYER: All Pages fired.');
}

/*
============================
| dataLayer Event Bindings |
----------------------------
*/

/* DATALAYER: Add to Cart / Dynamic Cart View
---------------------------------------------
Fire all pages trigger after all additional dataLayers have loaded. */

$(document).ready(function() {

  function mapJSONcartData(){
    jQuery.getJSON('/cart.js', function (response) {
        // --------------------------------------------- get Json response 
        bvaDataLayerConfig.cart = response;
        dataLayer.push({
         'products': bvaDataLayerConfig.cart.items.map(function (line_item) {
          return {
            'id': line_item.id,
            'sku': line_item.sku,
            'variant': line_item.variant_id,
            'name': line_item.title,
            'price': (line_item.price/100),
            'quantity': line_item.quantity
          }
        })
       }, {
        'pageType': 'Cart',
        'event': 'Cart',
        'event': 'All Pages'
      });
          // --------------------------------------------- get Json response 
        });
  }

  $(bvaDataLayerConfig.cartTriggers).on('click', function (event) {
  // ------------------------------------------------------------------------- add to cart
  dataLayer.push({
    'products': {
      'id': '{{ product.id }}',
      'sku':'{{product.selected_variant.sku}}',
      'variantId':'{{product.selected_variant.variant.id}}',
      'productType': "{{product.type}}",
      'name': '{{ product.title }}',
      'price': '{{ product.price | money_without_currency | remove: ","}}',
      'imageURL':"https:{{ product.featured_image.src|img_url:'grande' }}", 
      'productURL': '{{ shop.secure_url }}{{product.url}}',
      'brand': ' {{ product.vendor|json }}',              
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
    }
  }, {
    'pageType': 'Add to Cart',
    'event': 'Add to Cart',
    'event': 'All Pages'
  });

  if (bvaDataLayerConfig.dynamicCart) {
    // ---------------------------------- if dynamic cart is true
    var cartCheck = setInterval(function () {
      // -------------------------------------- begin check interval
      if ($(bvaDataLayerConfig.cartVisableSelector).length > 0) {
        // ------------------------------------------------------------------ check visible selectors
        clearInterval(cartCheck);
        mapJSONcartData();
        // ------------------------------------------------------------------ check visible selectors
      }
      // -------------------------------------- begin check interval
    }, 500);
    // ---------------------------------- if dynamic cart is true
  }
  // ------------------------------------------------------------------------- add to cart
});

  $(bvaDataLayerConfig.viewCart).on('click', function (event) {
  // ------------------------------------------------------------------------- view cart
  if (bvaDataLayerConfig.dynamicCart) {
    // ---------------------------------- if dynamic cart is true
    var cartViewCheck = setInterval(function () {
      // -------------------------------------- begin check interval
      if ($(bvaDataLayerConfig.cartVisableSelector).length > 0) {
        // ------------------------------------------------------------------ check visible selectors
        clearInterval(cartViewCheck);
        mapJSONcartData();
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

$(bvaDataLayerConfig.newsletterSelectors).on('click', function () {
  var newsletterCheck = setInterval(function () {
  // -------------------------------------- begin check interval
  if ($(bvaDataLayerConfig.newsletterSuccess).length > 0) {
      // ------------------------------------------------------------------ check visible selectors
      clearInterval(newsletterCheck);
      dataLayer.push({'event': 'Newsletter Subscription'});
      // ------------------------------------------------------------------ check visible selectors
    }
    // -------------------------------------- begin check interval
  },500);
});

/* DATALAYER: CTAs
------------------ */
$(bvaDataLayerConfig.ctaSelectors).on('click', function () {
  var ctaCheck = setInterval(function () {
  // -------------------------------------- begin check interval
  if ($(bvaDataLayerConfig.ctaSuccess).length > 0) {
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
$(bvaDataLayerConfig.promoSubscriptionsSelectors).on('click', function () {
  var ctaCheck = setInterval(function () {
  // -------------------------------------- begin check interval
  if ($(bvaDataLayerConfig.promoSuccess).length > 0) {
      // ------------------------------------------------------------------ check visible selectors
      clearInterval(ctaCheck);
      dataLayer.push({'event': 'Promo Subscription'});
      // ------------------------------------------------------------------ check visible selectors
    }
    // -------------------------------------- begin check interval
  },500);
});

$()
// document ready
});

</script>