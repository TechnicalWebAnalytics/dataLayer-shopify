<script>
/**********************
* DATALAYER ARCHITECTURE: SHOPIFY 
* DEFINITION: A data layer helps you collect more accurate analytics data, that in turn allows you to better understand what potential buyers are doing on your website and where you can make improvements. It also reduces the time to implement marketing tags on a website, and reduces the need for IT involvement, leaving them to get on with implementing new features and fixing bugs.

* RESOURCES:
* http://www.datalayerdoctor.com/a-gentle-introduction-to-the-data-layer-for-digital-marketers/
* http://www.simoahava.com/analytics/data-layer/

* EXTERNAL DEPENDENCIES:
* jQuery
* jQuery Cookie Plugin v1.4.1 - https://github.com/carhartl/jquery-cookie
* cartjs - https://github.com/discolabs/cartjs

* DataLayer Architecture: Shopify v1.2
* COPYRIGHT 2021
* LICENSES: MIT ( https://opensource.org/licenses/MIT )
*/

/**********************
* PRELOADS 
* load jquery if it doesn't exist
***********************/ 

if(!window.jQuery){
    var jqueryScript = document.createElement('script');
    jqueryScript.setAttribute('src','https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js'); 
    document.head.appendChild(jqueryScript); 
}

__DL__jQueryinterval = setInterval(function(){
    // wait for jQuery to load & run script after jQuery has loaded
    if(window.jQuery){
        // search parameters
        getURLParams = function(name, url){
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        };
        
        /**********************
        * DYNAMIC DEPENDENCIES
        ***********************/
        
        __DL__ = {
            dynamicCart: true,  // if cart is dynamic (meaning no refresh on cart add) set to true
            debug: true, // if true, console messages will be displayed
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
            searchPage: [],
            wishlistSelector: [],
            removeWishlist: [],
            wishlistPage: [],
            searchTermQuery: [getURLParams('q')], // replace var with correct query
        };
        
        /* DO NOT EDIT */
        defaultBindings = {
            cartTriggers: ['form[action="/cart/add"] [type="submit"],.add-to-cart,.cart-btn'],
            viewCart: ['form[action="/cart"],.my-cart,.trigger-cart,#mobileCart'],
            removeCartTrigger: ['[href*="/cart/change"]'],
            cartVisableSelector: ['.inlinecart.is-active,.inline-cart.is-active'],
            promoSubscriptionsSelectors: [],
            promoSuccess: [],
            ctaSelectors: [],
            newsletterSelectors: ['input.contact_email'],
            newsletterSuccess: ['.success_message'],
            searchPage: ['search'],
            wishlistSelector: [],
            removeWishlist: [],
            wishlistPage: []
        };
        
        // stitch bindings
        objectArray = customBindings;
        outputObject = __DL__;
        
        applyBindings = function(objectArray, outputObject){
            for (var x in objectArray) {  
                var key = x;
                var objs = objectArray[x]; 
                values = [];    
                if(objs.length > 0){    
                    values.push(objs);
                    if(key in outputObject){              
                        values.push(outputObject[key]); 
                        outputObject[key] = values.join(", "); 
                    }else{        
                        outputObject[key] = values.join(", ");
                    }   
                }  
            }
        };
        
        applyBindings(customBindings, __DL__);
        applyBindings(defaultBindings, __DL__);
        
        /**********************
        * PREREQUISITE LIBRARIES 
        ***********************/
        
        clearInterval(__DL__jQueryinterval);
        
        // jquery-cookies.js
        if(typeof $.cookie!==undefined){(function(a){if(typeof define==='function'&&define.amd){define(['jquery'],a)}else if(typeof exports==='object'){module.exports=a(require('jquery'))}else{a(jQuery)}}(function($){var g=/\+/g;function encode(s){return h.raw?s:encodeURIComponent(s)}function decode(s){return h.raw?s:decodeURIComponent(s)}function stringifyCookieValue(a){return encode(h.json?JSON.stringify(a):String(a))}function parseCookieValue(s){if(s.indexOf('"')===0){s=s.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,'\\')}try{s=decodeURIComponent(s.replace(g,' '));return h.json?JSON.parse(s):s}catch(e){}}function read(s,a){var b=h.raw?s:parseCookieValue(s);return $.isFunction(a)?a(b):b}var h=$.cookie=function(a,b,c){if(arguments.length>1&&!$.isFunction(b)){c=$.extend({},h.defaults,c);if(typeof c.expires==='number'){var d=c.expires,t=c.expires=new Date();t.setMilliseconds(t.getMilliseconds()+d*864e+5)}return(document.cookie=[encode(a),'=',stringifyCookieValue(b),c.expires?'; expires='+c.expires.toUTCString():'',c.path?'; path='+c.path:'',c.domain?'; domain='+c.domain:'',c.secure?'; secure':''].join(''))}var e=a?undefined:{},cookies=document.cookie?document.cookie.split('; '):[],i=0,l=cookies.length;for(;i<l;i++){var f=cookies[i].split('='),name=decode(f.shift()),cookie=f.join('=');if(a===name){e=read(cookie,b);break}if(!a&&(cookie=read(cookie))!==undefined){e[name]=cookie}}return e};h.defaults={};$.removeCookie=function(a,b){$.cookie(a,'',$.extend({},b,{expires:-1}));return!$.cookie(a)}}))}
        
        /**********************
        * Begin dataLayer Build 
        ***********************/
        
        /**
        * DEBUG
        * Set to true or false to display messages to the console
        */
        if(__DL__.debug){
            console.log('=====================\n| DATALAYER SHOPIFY |\n---------------------');
            console.log('Page Template: {{ template }}');
        }
        
        window.dataLayer = window.dataLayer || [];  // init data layer if doesn't already exist
        dataLayer.push({'event': 'Begin DataLayer'}); // begin datalayer
        
        var template = "{{template}}"; 
        
        /**
        * Landing Page Cookie
        * 1. Detect if user just landed on the site
        * 2. Only fires if Page Title matches website */
        
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
        if (__DL__.debug) {
            console.log('Landing Page: ' + landingPage);
        }
        
        /** 
        * Log State Cookie */
        
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
        
        /**********************
        * DATALAYER SECTIONS 
        ***********************/
        
        /**
        * DATALAYER: Landing Page
        * Fires any time a user first lands on the site. */
        
        if ($.cookie('landingPage') === 'landed') {
            dataLayer.push({
                'pageType': 'Landing',
                'event': 'Landing'
            });
            
            if (__DL__.debug) {
                console.log('DATALAYER: Landing Page fired.');
            }
        }
        
        /** 
        * DATALAYER: Log State
        * 1. Determine if user is logged in or not.
        * 2. Return User specific data. */
        
        var logState = {
            {% if shop.customer_accounts_enabled %}
            {% if customer %}
            'userId'        : {{customer.id | json}},
            'customerEmail' : {{customer.email | json}},
            'logState'      : "Logged In",
            'customerInfo'  : {
                'firstName'   : {{customer_address.first_name | json}},
                'lastName'    : {{customer_address.last_name | json}},
                'address1'    : {{customer_address.address1 | json}},
                'address2'    : {{customer_address.address2 | json}},
                'street'      : {{customer_address.street | json}},
                'city'        : {{customer_address.city | json}},
                'province'    : {{customer_address.province | json}},
                'zip'         : {{customer_address.zip | json}},
                'country'     : {{customer_address.country | json}},
                'phone'       : {{customer_address.phone | json}},
                'totalOrders' : {{customer.orders_count | json}},
                'totalSpent'  : {{customer.total_spent | money_without_currency | remove: "," | json}}
            },
            {% else %}
            'logState' : "Logged Out",
            {% endif %}
            {% endif %}
            'firstLog'      : firstLog,
            'customerEmail' : {{customer.email | json}},
            'timestamp'     : Date.now(),  
            {% if customer.orders_count > 2 %}
            'customerType'       : 'Returning',
            'customerTypeNumber' : '0',
            {% else %}
            'customerType'       : 'New',
            'customerTypeNumber' :'1', 
            {% endif %}
            'shippingInfo' : {
                'fullName'  : {{checkout.shipping_address.name | json}},
                'firstName' : {{checkout.shipping_address.first_name | json}},
                'lastName'  : {{checkout.shipping_address.last_name | json}},
                'address1'  : {{checkout.shipping_address.address1 | json}},
                'address2'  : {{checkout.shipping_address.address2 | json}},
                'street'    : {{checkout.shipping_address.street | json}},
                'city'      : {{checkout.shipping_address.city | json}},
                'province'  : {{checkout.shipping_address.province | json}},
                'zip'       : {{checkout.shipping_address.zip | json}},
                'country'   : {{checkout.shipping_address.country | json}},
                'phone'     : {{checkout.shipping_address.phone | json}},
            },
            'billingInfo' : {
                'fullName'  : {{checkout.billing_address.name | json}},
                'firstName' : {{checkout.billing_address.first_name | json}},
                'lastName'  : {{checkout.billing_address.last_name | json}},
                'address1'  : {{checkout.billing_address.address1 | json}},
                'address2'  : {{checkout.billing_address.address2 | json}},
                'street'    : {{checkout.billing_address.street | json}},
                'city'      : {{checkout.billing_address.city | json}},
                'province'  : {{checkout.billing_address.province | json}},
                'zip'       : {{checkout.billing_address.zip | json}},
                'country'   : {{checkout.billing_address.country | json}},
                'phone'     : {{checkout.billing_address.phone | json}},
            },
            'checkoutEmail' : {{checkout.email | json}},
            'currency'      : {{shop.currency | json}},
            'pageType'      : 'Log State',
            'event'         : 'Log State'
        }
        
        dataLayer.push(logState);
        if(__DL__.debug){
            console.log("Log State"+" :"+JSON.stringify(logState, null, " "));
        }
        
        /** 
        * DATALAYER: Homepage */
        
        if(document.location.pathname == "/"){
            var homepage = {
                'pageType' : 'Homepage',
                'event'    : 'Homepage'
            };
            dataLayer.push(homepage);
            if(__DL__.debug){
                console.log("Homepage"+" :"+JSON.stringify(homepage, null, " "));
            }
        }
        
        /** 
        * DATALAYER: Blog Articles
        * Fire on Blog Article Pages */
        
        {% if template contains 'article' %}
        var blog = {
            'author'      : {{article.author | json}},
            'title'       : {{article.title | json}},
            'dateCreated' : {{article.created_at | json}},
            'pageType'    : 'Blog',
            'event'       : 'Blog'
        };
        dataLayer.push(blog);
        if(__DL__.debug){
            console.log("Blog"+" :"+JSON.stringify(blog, null, " "));
        }
        {% endif %}
        
        /** DATALAYER: Product List Page (Collections, Category)
        * Fire on all product listing pages. */
        
        {% if template contains 'collection' %}
        var product = {
            'products': [
                {% for product in collection.products %}{
                    'id'              : {{product.id | json}},
                    'sku'             : {{product.selected_or_first_available_variant.sku | json}},
                    'variantId'       : {{product.selected_or_first_available_variant.id | json}},
                    'productType'     : {{product.type | json}},
                    'name'            : {{product.title | json}},
                    'price'           : {{product.price | money_without_currency | remove: "," | json}},
                    'imageURL'        : "https:{{product.featured_image.src|img_url:'grande'}}", 
                    'productURL'      : '{{shop.secure_url}}{{product.url}}',
                    'brand'           : {{shop.name | json}},
                    'comparePrice'    : {{product.compare_at_price_max | money_without_currency | remove: "," | json}},
                    'categories'      : {{product.collections|map:"title" | json}},
                    'currentCategory' : {{collection.title | json}},
                    'productOptions'  : {
                        {% for option in product.options_with_values %}
                        {% for value in option.values %}
                        {% if option.selected_value == value %}
                        {{option.name | json}} : {{value | json}},
                        {% endif %}
                        {% endfor %}
                        {% endfor %}
                    }
                },
                {% endfor %}]
            };
            var collections = {
                'productList' : {{collection.title | json}},
                'pageType'    : 'Collection',
                'event'       : 'Collection'
            };
            dataLayer.push(product);
            dataLayer.push(collections);
            if(__DL__.debug){
                console.log("Collections"+" :"+JSON.stringify(product, null, " "));
                console.log("Collections"+" :"+JSON.stringify(collections, null, " "));
            }
            {% endif %}
            
            /** DATALAYER: Product Page
            * Fire on all Product View pages. */
            
            if (template.match(/.*product.*/gi) && !template.match(/.*collection.*/gi)) {
                
                sku = '';
                var product = {
                    'products': [{
                        'id'              : {{product.id | json}},
                        'sku'             : {{product.selected_or_first_available_variant.sku | json}},
                        'variantId'       : {{product.selected_or_first_available_variant.id | json}},
                        'productType'     : {{product.type | json}},
                        'name'            : {{product.title | json}},
                        'price'           : {{product.price | money_without_currency | remove: "," | json}},
                        'description'     : {{product.description | strip_newlines | strip_html | json}},
                        'imageURL'        : "https:{{product.featured_image.src|img_url:'grande'}}", 
                        'productURL'      : '{{shop.secure_url}}{{product.url}}',
                        'brand'           : {{shop.name | json}},              
                        'comparePrice'    : {{product.compare_at_price_max | money_without_currency | remove: "," | json}},
                        'categories'      : {{product.collections | map:"title" | json}},
                        'currentCategory' : {{collection.title | json}},
                        'productOptions'  : {
                            {% for option in product.options_with_values %}
                            {% for value in option.values %}
                            {% if option.selected_value == value %}
                            {{option.name | json}} : {{value | json}},
                            {% endif %}
                            {% endfor %}
                            {% endfor %}
                        }
                    }]
                };
                
                function productView(){
                    var sku = {{product.selected_or_first_available_variant.sku | json}};
                    dataLayer.push(product, {
                        'pageType' : 'Product',
                        'event'    : 'Product'});
                        if(__DL__.debug){
                            console.log("Product"+" :"+JSON.stringify(product, null, " "));
                        }
                    }
                    productView();
                    
                    $(__DL__.cartTriggers).click(function(){
                        var skumatch = {{product.selected_or_first_available_variant.sku | json}};
                        if(sku != skumatch){
                            productView();
                        }
                    });
                }
                
                /** DATALAYER: Cart View
                * Fire anytime a user views their cart (non-dynamic) */
                
                {% if template contains 'cart' %}
                var cart = {
                    'products':[{% for line_item in cart.items %}{
                        'id'       : {{line_item.product_id | json}},
                        'sku'      : {{line_item.sku | json}},
                        'variant'  : {{line_item.variant_id | json}},
                        'name'     : {{line_item.title | json}},
                        'price'    : {{line_item.price | money_without_currency | remove: "," | json}},
                        'quantity' : {{line_item.quantity | json}}
                    },{% endfor %}],
                    'pageType' : 'Cart',
                    'event'    : 'Cart'
                };
                
                dataLayer.push(cart);
                if(__DL__.debug){
                    console.log("Cart"+" :"+JSON.stringify(cart, null, " "));
                }
                
                __DL__.cart = cart.products;
                $(__DL__.removeCartTrigger).on('click', function (event) {
                    
                    setTimeout(function(){
                        // remove from cart
                        jQuery.getJSON("/cart", function (response) {
                            // get Json response 
                            __DL__.removeCart = response;
                            var removeFromCart = {
                                'products': __DL__.removeCart.items.map(function (line_item) {
                                    return {
                                        'id'       : line_item.product_id,
                                        'sku'      : line_item.sku,
                                        'variant'  : line_item.variant_id,
                                        'name'     : line_item.title,
                                        'price'    : (line_item.price/100),
                                        'quantity' : line_item.quantity
                                    }
                                }),
                                'pageType' : 'Remove from Cart',
                                'event'    : 'Remove from Cart'         
                            };
                            __DL__.removeCart = removeFromCart;
                            var cartIDs = [];
                            var removeIDs = [];
                            var removeCart = [];
                            
                            // remove from cart logic
                            for(var i=__DL__.cart.length-1;i>=0;i--){var x=parseFloat(__DL__.cart[i].variant);cartIDs.push(x)}for(var i=__DL__.removeCart.products.length-1;i>=0;i--){var x=parseFloat(__DL__.removeCart.products[i].variant);removeIDs.push(x)}function arr_diff(b,c){var a=[],diff=[];for(var i=0;i<b.length;i++){a[b[i]]=true}for(var i=0;i<c.length;i++){if(a[c[i]]){delete a[c[i]]}else{a[c[i]]=true}}for(var k in a){diff.push(k)}return diff};var x=arr_diff(cartIDs,removeIDs)[0];for(var i=__DL__.cart.length-1;i>=0;i--){if(__DL__.cart[i].variant==x){removeCart.push(__DL__.cart[i])}}
                            
                            dataLayer.push(removeCart);
                            if (__DL__.debug) {
                                console.log("Cart"+" :"+JSON.stringify(removeCart, null, " "));
                            }
                        });
                    }, 2000);
                    
                });
                
                {% endif %}
                
                /** 
                * DATALAYER Variable
                * Checkout & Transaction Data */
                
                __DL__products = [];
                
                {% for line_item in checkout.line_items %}
                
                __DL__products.push({
                    'id'          : {{line_item.product_id | json}},
                    'sku'         : {{line_item.sku | json}},
                    'variantId'   : {{line_item.variant_id | json}},
                    'name'        : {{line_item.title | json}},
                    'productType' : {{line_item.product.type | json}},
                    'price'       : {{line_item.price | money_without_currency | remove: "," | json}},
                    'quantity'    : {{line_item.quantity | json}},
                    'description' : {{line_item.product.description | strip_newlines | strip_html  | json }},
                    'imageURL'    : "https:{{line_item.product.featured_image.src|img_url:'grande'}}", 
                    'productURL'  : '{{shop.secure_url}}{{line_item.product.url}}'
                });
                
                {% endfor %}
                transactionData = {
                    'transactionNumber'      : {{checkout.order_id | json}},
                    'transactionId'          : {{checkout.order_number | json}},
                    'transactionAffiliation' : {{shop.name | json}},
                    'transactionTotal'       : {{checkout.total_price | money_without_currency| remove: "," | json}},
                    'transactionTax'         : {{checkout.tax_price | money_without_currency| remove: "," | json}},
                    'transactionShipping'    : {{checkout.shipping_price | money_without_currency| remove: "," | json}},
                    'transactionSubtotal'    : {{checkout.subtotal_price | money_without_currency| remove: "," | json}},
                    {% for discount in checkout.discounts %}
                    'promoCode' : {{discount.code | json}},
                    'discount'  : {{discount.amoun t | money_without_currency | json}},
                    {% endfor %}
                    
                    'products': __DL__products
                };
                
                if(__DL__.debug == true){
                    
                    /** DATALAYER: Transaction */
                    if(document.location.pathname.match(/.*order.*/g)||document.location.pathname.match(/.*thank\_you.*/g)){
                        dataLayer.push(transactionData,{
                            'pageType' :'Transaction',
                            'event'    :'Transaction'
                        });       
                        console.log("Transaction Data"+" :"+JSON.stringify(transactionData, null, " "));
                    }
                }
                
                /** DATALAYER: Checkout */
                if(Shopify.Checkout){
                    if(Shopify.Checkout.step){ 
                        if(Shopify.Checkout.step.length > 0){
                            if (Shopify.Checkout.step === 'contact_information'){
                                dataLayer.push(transactionData,{
                                    'event'    :'Customer Information',
                                    'pageType' :'Customer Information'});
                                    console.log("Customer Information - Transaction Data"+" :"+JSON.stringify(transactionData, null, " "));
                                }else if (Shopify.Checkout.step === 'shipping_method'){
                                    dataLayer.push(transactionData,{
                                        'event'    :'Shipping Information',
                                        'pageType' :'Shipping Information'});
                                        console.log("Shipping - Transaction Data"+" :"+JSON.stringify(transactionData, null, " "));
                                    }else if( Shopify.Checkout.step === "payment_method" ){
                                        dataLayer.push(transactionData,{
                                            'event'    :'Add Payment Info',
                                            'pageType' :'Add Payment Info'});
                                            console.log("Payment - Transaction Data"+" :"+JSON.stringify(transactionData, null, " "));
                                        }
                                    }
                                    
                                    if(__DL__.debug == true){
                                        /** DATALAYER: Transaction */
                                        if(Shopify.Checkout.page == "thank_you"){
                                            dataLayer.push(transactionData,{
                                                'pageType' :'Transaction',
                                                'event'    :'Transaction'
                                            });       
                                            console.log("Transaction Data"+" :"+JSON.stringify(transactionData, null, " "));  
                                        }
                                    }else{
                                        /** DATALAYER: Transaction */
                                        if(Shopify.Checkout.page == "thank_you"){
                                            dataLayer.push(transactionData,{
                                                'pageType' :'Transaction',
                                                'event'    :'Transaction'
                                            });
                                        }
                                    }
                                }
                            }
                            
                            /** DATALAYER: All Pages
                            * Fire all pages trigger after all additional dataLayers have loaded. */
                            
                            dataLayer.push({
                                'event': 'DataLayer Loaded'
                            });
                            
                            console.log('DATALAYER: DataLayer Loaded.');
                            
                            /**********************
                            * DATALAYER EVENT BINDINGS
                            ***********************/
                            
                            /** DATALAYER: 
                            * Add to Cart / Dynamic Cart View
                            * Fire all pages trigger after all additional dataLayers have loaded. */
                            
                            $(document).ready(function() {
                                
                                /** DATALAYER: Search Results */
                                
                                var searchPage = new RegExp(__DL__.searchPage, "g");
                                if(document.location.pathname.match(searchPage)){
                                    var search = {
                                        'searchTerm' : __DL__.searchTermQuery,
                                        'pageType'   : "Search",
                                        'event'      : "Search"
                                    };
                                    
                                    dataLayer.push(search);
                                    if(__DL__.debug){
                                        console.log("Search"+" :"+JSON.stringify(search, null, " "));
                                    }
                                }
                                
                                /** DATALAYER: Cart */
                                
                                // stage cart data
                                function mapJSONcartData(){
                                    jQuery.getJSON('/cart.js', function (response) {
                                        // get Json response 
                                        __DL__.cart = response;
                                        var cart = {
                                            'products': __DL__.cart.items.map(function (line_item) {
                                                return {
                                                    'id'       : line_item.id,
                                                    'sku'      : line_item.sku,
                                                    'variant'  : line_item.variant_id,
                                                    'name'     : line_item.title,
                                                    'price'    : (line_item.price/100),
                                                    'quantity' : line_item.quantity
                                                }
                                            }),
                                            'pageType' : 'Cart',
                                            'event'    : 'Cart'     
                                        };
                                        if(cart.products.length > 0){
                                            dataLayer.push(cart);
                                            if (__DL__.debug) {
                                                console.log("Cart"+" :"+JSON.stringify(cart, null, " "));
                                            }
                                        }
                                    });
                                }
                                
                                viewcartfire = 0;
                                
                                // view cart
                                $(__DL__.viewCart).on('click', function (event) {                                    
                                    if(viewcartfire !== 1){ 
                                        viewcartfire = 1;
                                        // if dynamic cart is TRUE
                                        if (__DL__.dynamicCart) {
                                            cartCheck = setInterval(function () {
                                                // begin check interval
                                                if ($(__DL__.cartVisableSelector).length > 0) {
                                                    // check visible selectors
                                                    clearInterval(cartCheck);
                                                    mapJSONcartData();
                                                    $(__DL__.removeCartTrigger).on('click', function (event) {
                                                        // remove from cart
                                                        var link = $(this).attr("href");
                                                        jQuery.getJSON(link, function (response) {
                                                            // get Json response 
                                                            __DL__.removeCart = response;
                                                            var removeFromCart = {
                                                                'products': __DL__.removeCart.items.map(function (line_item) {
                                                                    return {
                                                                        'id'       : line_item.id,
                                                                        'sku'      : line_item.sku,
                                                                        'variant'  : line_item.variant_id,
                                                                        'name'     : line_item.title,
                                                                        'price'    : (line_item.price/100),
                                                                        'quantity' : line_item.quantity
                                                                    }
                                                                }),
                                                                'pageType' : 'Remove from Cart',
                                                                'event'    : 'Remove from Cart'         
                                                            };
                                                            dataLayer.push(removeFromCart);
                                                            if (__DL__.debug) {
                                                                console.log("Cart"+" :"+JSON.stringify(removeFromCart, null, " "));
                                                            }
                                                        });
                                                    });
                                                }
                                            }, 500);
                                        }       
                                    }
                                });
                                
                                // add to cart
                                jQuery.getJSON('/cart.js', function (response) {
                                    // get Json response 
                                    __DL__.cart = response;
                                    var cart = {
                                        'products': __DL__.cart.items.map(function (line_item) {
                                            return {
                                                'id'       : line_item.id,
                                                'sku'      : line_item.sku,
                                                'variant'  : line_item.variant_id,
                                                'name'     : line_item.title,
                                                'price'    : (line_item.price/100),
                                                'quantity' : line_item.quantity
                                            }
                                        })
                                    }
                                    __DL__.cart = cart;
                                    collection_cartIDs = [];
                                    collection_matchIDs = [];
                                    collection_addtocart = [];
                                    for (var i = __DL__.cart.products.length - 1; i >= 0; i--) {
                                        var x = parseFloat(__DL__.cart.products[i].variant);
                                        collection_cartIDs.push(x);
                                    }
                                });
                                
                                function __DL__addtocart(){

                                {% if template contains 'collection' %}         
                                    
                                    setTimeout(function(){
                                        jQuery.getJSON('/cart.js', function (response) {
                                            // get Json response 
                                            __DL__.cart = response;
                                            var cart = {
                                                'products': __DL__.cart.items.map(function (line_item) {
                                                    return {
                                                        'id'       : line_item.id,
                                                        'sku'      : line_item.sku,
                                                        'variant'  : line_item.variant_id,
                                                        'name'     : line_item.title,
                                                        'price'    : (line_item.price/100),
                                                        'quantity' : line_item.quantity
                                                    }
                                                })
                                            }
                                            __DL__.cart = cart;
                                            for (var i = __DL__.cart.products.length - 1; i >= 0; i--) {
                                                var x = parseFloat(__DL__.cart.products[i].variant);
                                                collection_matchIDs.push(x);
                                            }
                                            function arr_diff(b, c) {
                                                var a = [],
                                                diff = [];
                                                for (var i = 0; i < b.length; i++) {
                                                    a[b[i]] = true
                                                }
                                                for (var i = 0; i < c.length; i++) {
                                                    if (a[c[i]]) {
                                                        delete a[c[i]]
                                                    } else {
                                                        a[c[i]] = true
                                                    }
                                                }
                                                for (var k in a) {
                                                    diff.push(k)
                                                }
                                                return diff
                                            };
                                            var x = arr_diff(collection_cartIDs, collection_matchIDs).pop();
                                            console.log(x);
                                            for (var i = __DL__.cart.products.length - 1; i >= 0; i--) {
                                                if (__DL__.cart.products[i].variant.toString() === x) {
                                                    product = {'products':[__DL__.cart.products[i]]};
                                                    dataLayer.push({'products':product});
                                                    dataLayer.push(product);
                                                    dataLayer.push({
                                                        'pageType' : 'Add to Cart',
                                                        'event'    : 'Add to Cart'
                                                    });
                                                    if (__DL__.debug) {
                                                        console.log("Add to Cart"+" :"+JSON.stringify(product, null, " "));
                                                    }
                                                }
                                            }
                                        });
                                    },1000);
                                    
                                    {% else %}
                                    
                                    dataLayer.push(product, {
                                        'pageType' : 'Add to Cart',
                                        'event'    : 'Add to Cart'
                                    });
                                    
                                    if (__DL__.debug) {
                                        console.log("Add to Cart"+" :"+JSON.stringify(product, null, " "));
                                    }
                                    
                                    {% endif %}
                                    
                                    // if dynamic cart is TRUE
                                    if (__DL__.dynamicCart) {
                                        console.log("dynamic");
                                        var cartCheck = setInterval(function () {
                                            // begin check interval
                                            if ($(__DL__.cartVisableSelector).length > 0) {
                                                // check visible selectors
                                                clearInterval(cartCheck);
                                                mapJSONcartData();
                                                $(__DL__.removeCartTrigger).on('click', function (event) {
                                                    // remove from cart
                                                    var link = $(this).attr("href");
                                                    jQuery.getJSON(link, function (response) {
                                                        // get Json response 
                                                        __DL__.removeCart = response;
                                                        var removeFromCart = {
                                                            'products': __DL__.removeCart.items.map(function (line_item) {
                                                                return {
                                                                    'id'       : line_item.id,
                                                                    'sku'      : line_item.sku,
                                                                    'variant'  : line_item.variant_id,
                                                                    'name'     : line_item.title,
                                                                    'price'    : (line_item.price/100),
                                                                    'quantity' : line_item.quantity
                                                                }
                                                            }),
                                                            'pageType' : 'Remove from Cart',
                                                            'event'    : 'Remove from Cart'         
                                                        };
                                                        dataLayer.push(removeFromCart);
                                                        if (__DL__.debug) {
                                                            console.log("Cart"+" :"+JSON.stringify(removeFromCart, null, " "));
                                                        }
                                                    });
                                                });
                                            }
                                        }, 500);
                                    }       
                                }
                                
                                $(document).on('click', __DL__.cartTriggers, function() {
                                    __DL__addtocart();
                                });
                                
                                /** 
                                 * DATALAYER: Newsletter Subscription */
                                __DL__newsletter_fire = 0;
                                $(document).on('click', __DL__.newsletterSelectors, function () {
                                    if(__DL__newsletter_fire !== 1){
                                        __DL__newsletter_fire = 1;
                                        var newsletterCheck = setInterval(function () {
                                            // begin check interval
                                            if ($(__DL__.newsletterSuccess).length > 0) {
                                                // check visible selectors
                                                clearInterval(newsletterCheck);
                                                dataLayer.push({'event': 'Newsletter Subscription'});
                                            }
                                        },500);
                                    }
                                });
                                
                                /** DATALAYER: Wishlist */
                                setTimeout( function(){
                                    
                                    $(__DL__.wishlistSelector).on('click', function () {
                                        dataLayer.push(product,
                                            {'event': 'Add to Wishlist'});
                                            if(__DL__.debug){
                                                console.log("Wishlist"+" :"+JSON.stringify(product, null, " "));
                                            }
                                        });
                                        
                                        if(document.location.pathname == __DL__.wishlistPage){
                                            var __DL__productLinks = $('[href*="product"]');
                                            var __DL__prods        = [];
                                            var __DL__links        = [];
                                            var __DL__count        = 1;
                                            
                                            $(__DL__productLinks).each(function(){
                                                var href = $(this).attr("href");
                                                if(!__DL__links.includes(href)){
                                                    __DL__links.push(href);
                                                    $(this).attr("dataLayer-wishlist-item",__DL__count++);
                                                    jQuery.getJSON(href, function (response) {
                                                        // get Json response 
                                                        __DL__.wishlist = response;
                                                        var wishlistproducts = {
                                                            'id'   : __DL__.wishlist.product.id,
                                                            'name' : __DL__.wishlist.product.title,
                                                        };
                                                        __DL__prods.push(wishlistproducts);
                                                    });
                                                }
                                            });
                                            
                                            dataLayer.push({'products': __DL__prods, 
                                            'pageType' : 'Wishlist',
                                            'event'    : 'Wishlist'});
                                        }
                                        
                                        var __DL__count = 1;
                                        var wishlistDel  = $(__DL__.removeWishlist);
                                        wishlistDel.each(function(){
                                            $(this).attr("dataLayer-wishlist-item-del",__DL__count++);
                                        });
                                        
                                        $(__DL__.removeWishlist).on('click', function(){
                                            console.log('click')
                                            var index = $(this).attr("dataLayer-wishlist-item-del");
                                            var link  = $("[dataLayer-wishlist-item="+index+"]").attr("href");
                                            console.log(index)
                                            console.log(link)
                                            jQuery.getJSON(link, function (response) {
                                                // get Json response 
                                                __DL__.wishlist     = response;
                                                var wishlistproducts = {
                                                    'id'   : __DL__.wishlist.product.id,
                                                    'name' : __DL__.wishlist.product.title,
                                                };
                                                
                                                dataLayer.push({'products': wishlistproducts,
                                                'pageType' : 'Wishlist',
                                                'event'    : 'Wishlist Delete Product'});
                                            });
                                        })
                                    }, 3000);
                                    
                                    /** DATALAYER: CTAs */
                                    $(__DL__.ctaSelectors).on('click', function () {
                                        var ctaCheck = setInterval(function () {
                                            // begin check interval
                                            if ($(__DL__.ctaSuccess).length > 0) {
                                                // check visible selectors
                                                clearInterval(ctaCheck);
                                                dataLayer.push({'event': 'CTA'});
                                            }
                                        },500);
                                    });
                                    
                                    /** DATALAYER: Promo Subscriptions */
                                    $(__DL__.promoSubscriptionsSelectors).on('click', function () {
                                        var ctaCheck = setInterval(function () {
                                            // begin check interval
                                            if ($(__DL__.promoSuccess).length > 0) {
                                                // check visible selectors
                                                clearInterval(ctaCheck);
                                                dataLayer.push({'event': 'Promo Subscription'});
                                            }
                                        },500);
                                    });
                                    
                                }); // document ready
                            }
                        }, 500);
                        </script>
