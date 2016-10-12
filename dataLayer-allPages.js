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

/* =====================
| DYNAMIC DEPENDENCIES |
--------------------- */

bvaDataLayerConfig = {
  dynamicCart: true,  // if cart is dynamic (meaning no refresh on cart add) set to true
  cartTriggers: ['.my-cart,.add-to-cart,.cart-btn'],
  cartVisableSelector: ['.inlinecart.is-active'],
  promoSubscriptionsSelectors: [],
  ctaSelectors: [],
  debug: true,
  cart: null
}; 

jQuery.getJSON('/cart.js', function (response) {
  bvaDataLayerConfig.cart = response;
});


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
  console.log('==============\n| DATALAYERS |\n--------------')
  console.log("Timestamp: " + Date.now());
}

/* DATALAYER: Landing Page
--------------------------
Fires any time a user first lands on the site. */

if ($.cookie('landingPage') === 'landed') {
  dataLayer.push({
    'pageType': 'Landing Page',
    'event': 'Landing Page'
  });
  if (bvaDataLayerConfig.debug) {
    console.log('DATALAYER: Landing Page fired.');
  }
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
  'customerFirstName': '{{customer.first_name}}',
  'customerLastName': '{{customer.last_name}}',
  'logState': 'Logged In',
  {% else %}
  'logState': 'Logged Out',
  {% endif %}
  {% endif %}
  {% if customer.orders_count > 0 %}
  'customerType': 'Returning',
  {% else %}
  'customerType': 'New',
  {% endif %}
  'firstLog': firstLog,
  'customerEmail': '{{customer.email}}',
  'timestamp': Date.now()
}, {'event': 'Log State'});
if (bvaDataLayerConfig.debug) {
  console.log('DATALAYER: Log State fired.');
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
  'event': 'Blog Page'
});
if (bvaDataLayerConfig.debug) {
  console.log('DATALAYER: Blog Articles fired.');
  console.log('----------------------\nBLOG PAGE DATA\n----------------------');
  console.log('Author: {{ article.author }}\nTitle: {{ article.title }}\nDate Created: {{ article.created_at }}');
}
{% endif %}


/* DATALAYER: Product List Page (Collections, Category)
-------------------------------------------------------
Fire on all product listing pages. */

{% if template contains 'collection' %}
dataLayer.push({
  'productList': "{{ collection.title }}"
}, {
  'pageType': 'Category',
  'event': 'Product List Page'
});
if (bvaDataLayerConfig.debug) {
  console.log('DATALAYER: Product List Page fired.');
}
{% endif %}

/* DATALAYER: Product Page
--------------------------
Fire on all Product View pages. */

if (template.match(/.*product.*/gi) && !template.match(/.*collection.*/gi)) {
  dataLayer.push({
    'products': {
      'id': '{{ product.id }}',
      'sku':'{{variant.sku}}',
      'variantId':'{{variant.id}}',
      'productType': "{{product.type}}",
      'name': '{{ product.title }}',
      'price': '{{ product.price | money_without_currency }}',
      'imageURL':"https:{{ product.featured_image.src|img_url:'grande' }}", 
      'productURL': '{{ shop.secure_url }}{{product.url}}',
      'brand': ' {{ product.vendor|json }}',              
      'comparePrice':'{{ product.compare_at_price_max|money_without_currency}}',
      'categories': {{ product.collections|map:'title'|json }},
      'currentCategory': "{{ collection.title }}"
    }
  }, {
    'pageType': 'Product',
    'event': 'Product Page'
  });
  if (bvaDataLayerConfig.debug) {
    console.log('DATALAYER: Product Page fired.');
  }
}

/* DATALAYER: Cart View
-----------------------
1. Fire anytime a user views their cart (non-dynamic) */

{% if template contains 'cart' %}
dataLayer.push({
  'cartProducts':{% for line in cart.items %}{
    'id': '{{ line_item.id }}',
    'sku': '{{ line_item.sku }}',
    'variant': '{{line_item.variant_id}}',
    'name': '{{ line_item.title }}',
    'price': '{{ line_item.price | money_without_currency }}',
    'quantity': '{{ line_item.quantity }}'
  },{% endfor %}
},{
  'pageType': 'Cart',
  'event': 'Cart Page'
});
if (bvaDataLayerConfig.debug) {
  console.log('DATALAYER: Static Cart View fired.');
}
{% endif %}

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

// bindings
$(document).ready(function() {

  $('form[action*="/cart/add"] input[type="submit"]').on('click', function () {
    if (bvaDataLayerConfig.dynamicCart) {
      var cartCheck = setInterval(function () {
        if ($(bvaDataLayerConfig.cartVisableSelector.join(',')).length > 0) {
          clearInterval(cartCheck);
          jQuery.getJSON('/cart.js', function (response) {
            bvaDataLayerConfig.cart = response;
            dataLayer.push({
              'cartProducts': bvaDataLayerConfig.cart.items.map(function (line_item) {
                return {
                  'id': '{{ line_item.id }}',
                  'sku': '{{ line_item.sku }}',
                  'variant': '{{line_item.variant_id}}',
                  'name': '{{ line_item.title }}',
                  'price': toFixed({{ line_item.price | money_without_currency }}),
                  'quantity': '{{ line_item.quantity }}'
                }
              })
            }, {
              'pageType': 'Cart',
              'event': 'Cart Page'
            },{
              'event': 'Add to Cart'
            });
            if (bvaDataLayerConfig.debug) {
              console.log('DATALAYER: Dynamic Cart View fired.');
              console.log('DATALAYER: Add to Cart fired.');
            }
          });
        }
      }, 500);
    } else {
      dataLayer.push({
        'event': 'Add to Cart'
      });
      if (bvaDataLayerConfig.debug) {
        console.log('DATALAYER: Add to Cart fired.');
      }
    }
  });

  /*
  DATALAYER: Cart View
  --------------------
  2. Any dynamic carts require an interval detect.
  */

  $(bvaDataLayerConfig.cartTriggers.join(',')).on('click', function (event) {
    if (bvaDataLayerConfig.dynamicCart && event.hasOwnProperty('originalEvent')) {
      dataLayer.push({
        'cartProducts': bvaDataLayerConfig.cart.items.map(function (line_item) {
          return {
            'id': line_item.id,
            'sku': line_item.sku,
            'name': line_item.title,
            'price': line_item.price,
            'quantity': line_item.quantity
          }
        })
      }, {
        'pageType': 'Cart',
        'event': 'Cart Page'
      },{
        'event': 'Add to Cart'
      });
      if (bvaDataLayerConfig.debug) {
        console.log('DATALAYER: Dynamic Cart View fired.');
        console.log('DATALAYER: Add to Cart fired.');
      }
    }
  });

  $('[data-email-signup]').on('click', function () {
    dataLayer.push({'event': 'Newsletter Subscription'});
    if (bvaDataLayerConfig.debug) {
      console.log('DATALAYER: Newsletter Subscription fired.');
    }
  });

  $(bvaDataLayerConfig.promoSubscriptionsSelectors.join(',')).on('click', function () {
    dataLayer.push({'event': 'Promo Subscription'});
    if (bvaDataLayerConfig.debug) {
      console.log('DATALAYER: Promo Subscription fired.');
    }
  });

  $()

});

</script>
