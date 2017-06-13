<script>
/*
===========================================
| DATALAYER SEGMENT ARCHITECTURE: SHOPIFY |
-------------------------------------------

DEFINITION:
A data layer helps you collect more accurate analytics data, that in turn allows you to better understand what potential buyers are doing on your website and where you can make improvements. It also reduces the time to implement marketing tags on a website, and reduces the need for IT involvement, leaving them to get on with implementing new features and fixing bugs.

EXTERNAL DEPENDENCIES:
* jQuery

DataLayer Architecture: Shopify v1.3.1
COPYRIGHT 2016
LICENSES: MIT ( https://opensource.org/licenses/MIT )
*/

/* 
=====================================
| APPLY CONFIGS FOR DYNAMIC CONTENT |
-------------------------------------
*/

console.log('{{template}}');

function config(){
	__meow__  = {
		dynamicCart : true, // if cart is dynamic (meaning no refresh on cart add) set to true
		debug       : true, // if true, console messages will be displayed
		cart        : null,
		wishlist    : null,
		removeCart  : null
	};

	bindings = {
		cartTriggers                : ['#AddToCart,form[action="/cart/add"] [type="submit"],.add-to-cart,.cart-btn'],
		viewCart                    : ['.icon-cart,form[action="/cart"],.my-cart,.trigger-cart,#mobileCart,[href="/cart"],.cart-link'],
		removeCartTrigger           : ['[href*="/cart/change"]'],
		cartVisableSelector         : ['.inlinecart.is-active,.inline-cart.is-active'],
		promoSubscriptionsSelectors : [],
		promoSuccess                : [],
		ctaSelectors                : [],
		newsletterSelectors         : ['input.contact_email'],
		newsletterSuccess           : ['.success_message'],
		searchTermQuery             : [purr.getURLParams('q')],
		searchPage                  : ['search'],
		wishlistSelector            : [],
		removeWishlist              : [],
		wishlistPage                : []
	}
}

/* 
========================================
| SETUP SEGMENT ANALYTICS ARCHITECTURE |
----------------------------------------
*/

/* Products Searched */
function productSearched(){
	var searchPage = new RegExp(__meow__.searchPage, "g");
	if(document.location.pathname.match(searchPage)){
		analytics.track('Products Searched', {
			query: __meow__.searchTermQuery
		});
	}
}

/* Product List Viewed */
function productListViewed(){
	{% if template contains 'collection' %}
	analytics.track('Product List Viewed', {
		list_id  : "{{collection.title}}",
		category : "{{collection.title}}",
		products : [
		{% for product in collection.products %}{
			product_id : '{{product.id}}',
			sku        : '{{product.selected_or_first_available_variant.sku}}',
			name       : "{{product.title}}",
			price      : '{{product.price | money_without_currency | remove: ","}}',
			position   : '{{forloop.index}}',
			category   : "{{product.type}}",
		},
		{% endfor %}]
	});
	{% endif %}
}

/* Product Viewed */
function productViewed(){
	{% if template contains 'product' %}
	analytics.track('Product Viewed', {
		product_id : '{{product.id}}',
		sku        : '{{product.selected_or_first_available_variant.sku}}',
		variant    : '{{product.selected_or_first_available_variant}}',
		category   : "{{product.type}}",
		name       : "{{product.title}}",
		brand      : '{{shop.name}}',
		price      : '{{product.price | money_without_currency | remove: ","}}',
		currency   : '{{shop.currency}}',
	});
	{% endif %}
}

/* Product Added */
function productAdded(){
	{% if template contains 'product' %}
	$(document).on("click", __meow__.cartTriggers, function(){
		analytics.track('Product Viewed', {
			product_id : '{{product.id}}',
			sku        : '{{product.selected_or_first_available_variant.sku}}',
			variant    : '{{product.selected_or_first_available_variant}}',
			category   : "{{product.type}}",
			name       : "{{product.title}}",
			brand      : '{{shop.name}}',
			price      : '{{product.price | money_without_currency | remove: ","}}',
			currency   : '{{shop.currency}}',
		});
	});
	{% endif %}
}

/* Product Removed */
function productRemoved(){
 // under construction
}

/* Cart Viewed */
function cartViewed(){
	$(__meow__.viewCart).click(function(){
		purr.getProductArrayData('/cart.js', function(){
			analytics.track('Cart Viewed', {
				products: __meow__.data.products
			});
		});
	});
}

/* Checkout Started */
function checkoutStarted(){
	if(Shopify.Checkout){
		if (Shopify.Checkout.step === 'contact_information'){
			purr.getProductArrayData('/cart.js');
			analytics.track('Checkout Started', {
				order_id: '{{checkout.order_number}}',
				affiliation: '{{shop.name}}',
				value: '{{checkout.total_price |  money_without_currency| remove: ","}}',
				revenue: '{{checkout.subtotal_price |  money_without_currency| remove: ","}}',
				shipping: '{{checkout.shipping_price |  money_without_currency| remove: ","}}',
				tax: '{{checkout.tax_price |  money_without_currency| remove: ","}}',
				{% for discount in checkout.discounts %}
				discount:  '{{discount.amoun t | money_without_currency}}',
				coupon:  '{{discount.code}}',
				{% endfor %}
				currency: '{{shop.currency}}',
				products: __meow__.data.products
			});
		}
	}
}

/* Checkout Step Viewed */
function stepViewed(){
	if(Shopify.Checkout){
		if (Shopify.Checkout.step === 'contact_information'){
			analytics.track('Checkout Step Viewed', {
				step: 1
			});
		}else if (Shopify.Checkout.step === 'shipping_method'){
			analytics.track('Checkout Step Viewed', {
				step: 2
			});
		}else if( Shopify.Checkout.step === "payment_method" ){
			analytics.track('Checkout Step Viewed', {
				step: 3
			});
		}
	}
}

/* Checkout Step Completed */
/* Payment Info Entered */
/* Coupon Applied */
/* Order Cancelled */
/* Order Completed */
/* Purchased Item */
/* Order Refunded */

/* 
===================================
| LOAD LIBRARIES AND DEPENDENCIES |
-----------------------------------
*/

/* Load libraries */
function jQueryReady(){
	if(!window.jQuery){
		var jqueryScript=document.createElement('script');
		jqueryScript.setAttribute('src','https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js');
		document.head.appendChild(jqueryScript)
	}
	return typeof window.jQuery !== 'undefined';
}

function segmentReady(){
	return typeof window.analytics !== 'undefined';
}

/* Check if libraries are loaded */
function isReady(){
	return jQueryReady() && segmentReady();
}

/* Interval to check library load */
function backoff(test, callback, delay){
	function getNewDelay(){
		if (!delay){
			return 1;
		}

		return (delay >= Number.MAX_VALUE) ? delay : delay * 2;
	}

	if (test()){
		callback();
	} else {
		setTimeout(function (){
			backoff(test, callback, getNewDelay());
		}, Math.log(getNewDelay()) * 100);
	}
}

/* 
==========================
| LOAD UTILITY FUNCTIONS |
--------------------------
Apply any reusable functions here
*/

function loadUtilities(){
	this.getURLParams = function(name, url){
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	this.getProductData = function(url){
		jQuery.getJSON(url, function (response) {
			var data = response.product;
			__meow__.data = {
				product_id : data.id,
				sku        : data.variants[0].sku,
				category   : data.product_type,
				name       : data.title,
				brand      : data.vendor,
				price      : data.variants[0].price,
				variant    : data.variants[0]     
			}
		});
	}

	this.getProductArrayData = function(url){
		jQuery.getJSON(url, function (response) {
			data = response;
			__meow__.data  = {
				'products': data.items.map(function (line_item) {
					return {
						product_id : line_item.id,
						sku        : line_item.sku,
						category   : line_item.product_type,
						name       : line_item.title,
						brand      : line_item.vendor,
						price      : (line_item.price/100),
						variant    : line_item.variant_id 
					}
				})        
			};
		});
	}
}

/* 
==========================
| STITCH CONFIG BINDINGS |
--------------------------
*/

function stichConfig(){

	config();

	// stitch bindings
	objectArray = bindings;
	outputObject = __meow__;

	function applyBindings(objectArray, outputObject){
		for (var x in objectArray){  
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

	applyBindings(bindings, __meow__);
}

/*
=================
| FINALIZE LOAD |
-----------------
*/

/* SETUP ARCHITECTURE */
function setup(){
	console.log('Segment Analytcs Loaded');
	purr = (new loadUtilities());
	stichConfig();
	productSearched();
	productListViewed();
	productViewed();
	productAdded();
	cartViewed();
}

/* LOAD ARCHITECTURE */
function init(){
	backoff(isReady, setup);
}

init();
</script>