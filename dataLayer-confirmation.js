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

EXTERNAL DEPENDENCIES:
* jQuery Cookie Plugin v1.4.1 - https://github.com/carhartl/jquery-cookie

DataLayer Architecture: Shopify v1.3.1
COPYRIGHT 2016
LICENSES: MIT ( https://opensource.org/licenses/MIT )
*/

/* 
========================
| DYNAMIC DEPENDENCIES |
------------------------

[ IMPORTANT ]: Review options and make any necessary changes. */

/* ------- CONSOLE DATA [ UNDER CONSTRUCTION ] ------- */
// If you want all data to be logged to the console for reference set to true. 

// var consoleLog = true;

/* =======================
| PREREQUISITE LIBRARIES |
--------------------------

Load jQuery Cookie Library 
--------------------------
jQuery Cookie Plugin v1.4.1
https://github.com/carhartl/jquery-cookie

Copyright 2006, 2014 Klaus Hartl
Released under the MIT license
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

console.log("----------------------\nBEGIN DATALAYER BUILD\nTHEME PAGES\n----------------------");
window.dataLayer = window.dataLayer || []
console.log('Page Template = {{template}}');
var template = '{{template}}';


/* Landing Page Cookie
-----------------------
1. Detect if user just landed on the site
2. Only fires if Page Title matches website */

$.cookie.raw = true;

if( $.cookie('landingPage') === undefined || $.cookie('landingPage').length === 0 ){

  $.cookie('landingPage', unescape);
  $.removeCookie('landingPage',{ path: '/' });
  $.cookie('landingPage', 'landed',{ path: '/' });
  var landingPage = true;
  console.log("Landing Page = True");

}else{

  $.cookie('landingPage', unescape);
  $.removeCookie('landingPage',{ path: '/' });
  $.cookie('landingPage', 'refresh',{ path: '/' });
  console.log("Landing Page = False");

}

/* Log State Cookie
------------------- */

{% if customer %}
var logState = "Logged In";
{% endif %}

if( typeof logState == "undefined" ){
  var logState = "Logged Out";
  $.cookie('logState', unescape);
  $.removeCookie('logState',{ path: '/' });
  $.cookie('logState', 'loggedOut',{ path: '/' })
  console.log("Log State = Logged Out");
}

if( logState === "Logged In"){
  if( $.cookie('logState') === "loggedOut" || $.cookie('logState') === undefined ){

    $.cookie('logState', unescape);
    $.removeCookie('logState',{ path: '/' });
    $.cookie('logState', 'firstLog',{ path: '/' });
    console.log("Log State = Logged In");

  }else if( $.cookie("logState") === "firstLog"  ){

    $.cookie('logState', unescape);
    $.removeCookie('logState',{ path: '/' });
    $.cookie('logState', 'refresh',{ path: '/' });
    console.log("Log State = Logged In");

  }else{
    console.log("Log State = Logged In");
  }
}

if( $.cookie("logState") === "firstLog"  ){
  var firstLog = "True";
}else{
  var firstLog = "False";
}
console.log("First Log = "+firstLog);

    // TIMESTAMP
    var ts = Date.now();
    console.log("Timestamp = "+ts);

/* ==========
| DATALAYERS |
----------- */

/* DATALAYER: Landing Page
--------------------------
Fires any time a user first lands on the site. */

if( $.cookie("landingPage") === "landed"  ){
  dataLayer.push({
    'pageType':'Landing Page',
    'event':'Landing Page'
  });
}

/* DATALAYER: Log State
-----------------------
1. Determine if user is logged in or not.
2. Return User specific data. */

dataLayer.push({
  {% if shop.customer_accounts_enabled %}
  {% if customer %}
  'userId': '{{customer.id}}',
  'customerEmail': '{{customer.email}}',
  'logState': "Logged In",
  {% else %}
  'logState': "Logged Out",
  {% endif %}
  {% endif %}
  'firstLog': firstLog,
  'customerEmail': '{{customer.email}}',
  'timestamp': ts
},{'event':'Log State'});

/* DATALAYER: Confirmation
-------------------------- */

dataLayer.push({
  'transactionId': '{{checkout.order_id}}',
  'transactionNumber': '{{checkout.order_number}}',
  'transactionAffiliation': '{{shop.name}}',
  'transactionTotal': '{{checkout.total_price |  money_without_currency}}',
  'transactionTax': '{{checkout.total_price |  money_without_currency}}',
  'transactionShipping': '{{checkout.shipping_price |  money_without_currency}}',

  {% for discount in checkout.discounts %}
  'promoCode':'{{discount.code}}',
  'discount': '{{discount.amount | money_without_currency}}',
  {% endfor %}
  
  'transactionProducts': [

  {% for line_item in line_items %}
  {
    'id': '{{line_item.product_id}}',
    'sku': '{{line_item.sku}}',
    'variantId': '{{line_item.variant_id}}',
    'name': '{{line_item.title}}',
    'category': '{{ collection.title }}',
    'price': '{{line_item.price | money_without_currency}}',
    'quantity': '{{line_item.quantity}}'
  },
  {% endfor %}

  ]},{
    'pageType':'Confirmation',
    'event':'Confirmation'
  });

/* DATALAYER: All Pages
-----------------------
Fire all pages trigger after all additional dataLayers have loaded. */

dataLayer.push({
  'event':'All Pages'
});
</script>
