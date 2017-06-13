<script>
/*
=================================
| SEGMENT ARCHITECTURE: SHOPIFY |
---------------------------------

EXTERNAL DEPENDENCIES:
* jQuery

Segment Architecture: Shopify v1.1
COPYRIGHT 2017
LICENSES: MIT ( https://opensource.org/licenses/MIT )
AUTHORS: mechellewarneke@gmail.com | mechelle@bvaccel.com
*/

/* 
=====================================
| APPLY CONFIGS FOR DYNAMIC CONTENT |
-------------------------------------
*/

function config(){
	__meow__  = {
		dynamicCart : true, // if cart is dynamic (meaning no refresh on cart add) set to true
		debug       : true, // if true, console messages will be displayed
		cart        : null,
		wishlist    : null,
		removeCart  : null
	};

	bindings = {
		cartTriggers      : ['#AddToCart,form[action="/cart/add"] [type="submit"],.add-to-cart,.cart-btn'],
		viewCart          : ['.cart-link'],
		removeCartTrigger : ['[href*="/cart/change"]'],
		searchTermQuery   : [purr.getURLParams('q')],
		searchPage        : ['search'],
		applyCoupon       : ['.order-summary__section--discount button'],
		checkoutNext      : ['.step__footer__continue-btn'],
		removeFromCart    : ['.icon-minus']
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
		variant    : '{{product.selected_or_first_available_variant.variant}}',
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
	$(__meow__.cartTriggers).on("click", function(){
		analytics.track('Product Added', {
			product_id : '{{product.id}}',
			sku        : '{{product.selected_or_first_available_variant.sku}}',
			variant    : '{{product.selected_or_first_available_variant.variant}}',
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
	function stageRemove(){
		purr.getProductArrayData('/cart.js').then(function(response){
			__meow__stageRemove = __meow__.data.products
		});
	}
	stageRemove();
	setTimeout(function(){
		$(document).on("click",__meow__.removeFromCart,function(){
			console.log('click');
			purr.getProductArrayData('/cart.js').then(function(response){
				x = purr.removeFromCart(__meow__stageRemove,__meow__.data.products);
				if(x.length > 0){
					analytics.track('Product Removed', x);
				}
				stageRemove(); // reset cart data
			});
		});
	},1000);
}

/* Cart Viewed */
function cartViewed(){
	$(__meow__.viewCart).on("click",function(){
		purr.getProductArrayData('/cart.js').then(function(response){
			analytics.track('Cart Viewed', {
				products: __meow__.data.products
			});
		});
	});
	if(document.location.pathname.match(/.*cart.*/g)){
		purr.getProductArrayData('/cart.js').then(function(response){
			analytics.track('Cart Viewed', {
				products: __meow__.data.products
			});
		});
	}
}

/* Checkout Started */
function checkoutStarted(){
	if(Shopify.Checkout){
		if (Shopify.Checkout.step === 'contact_information'){
			purr.getProductArrayData('/cart.js', function(){
				analytics.track('Checkout Started', {
					order_id    : '{{checkout.order_number}}',
					affiliation : '{{shop.name}}',
					value       : '{{checkout.total_price |  money_without_currency| remove: ","}}',
					revenue     : '{{checkout.subtotal_price |  money_without_currency| remove: ","}}',
					shipping    : '{{checkout.shipping_price |  money_without_currency| remove: ","}}',
					tax         : '{{checkout.tax_price |  money_without_currency| remove: ","}}',
					{% for discount in checkout.discounts %}
					discount    :  '{{discount.amount | money_without_currency}}',
					coupon      :  '{{discount.code}}',
					{% endfor %}
					currency    : '{{shop.currency}}',
					products    : __meow__.data.products
				});
			});
		}
	}
}

/* Checkout Step Viewed | Completed */
function checkout(){
	if(Shopify.Checkout){
		function stepcomplete(step){
			$(document).on('click',__meow__.checkoutNext,function(){
				analytics.track('Checkout Step Completed', {
					step: step
				});
			})
		}
		if (Shopify.Checkout.step === 'contact_information'){
			analytics.track('Checkout Step Viewed', {
				step: 1
			});
			stepcomplete('1');
		}else if (Shopify.Checkout.step === 'shipping_method'){
			analytics.track('Checkout Step Viewed', {
				step: 2
			});
			stepcomplete('2');
		}else if( Shopify.Checkout.step === "payment_method" ){
			analytics.track('Checkout Step Viewed', {
				step: 3
			});
			stepcomplete('3');
		}
	}
}

/* Payment Info Entered - In iFrame - cannot be accessed*/

/* Coupon Applied */
function couponApplied(){
	$(document).on("click",__meow__.applyCoupon,function(){ 
		event.stopPropagation();
		var check = setInterval(function(){
			{% for discount in checkout.discounts %}
			if('{{discount.title}}'){
				clearInterval(check);
				analytics.track('Coupon Applied', {
					order_id    : '{{checkout.order_number}}',
					coupon_id   : '{{discount.id}}',
					coupon_name : '{{discount.title}}',
					discount    : '{{discount.amount | money_without_currency}}'
				});
			}
			{% endfor %}
		}, 1000);
		check;
		setTimeout(function( ) { clearInterval( check ); }, 50000);
	});
}

/* Order Cancelled - customer has to call to cancel - no cancellation page */
/* Order Refunded - customer has to call for refund - no refund page */

/* Order Completed */
function orderCompleted(){
	if(Shopify.Checkout){
		if(Shopify.Checkout.page == "thank_you" || document.location.pathname.match(/.*order.*/g)){
			analytics.track('Order Completed', {
				order_id    : '{{checkout.order_number}}',
				affiliation : "{{shop.name}}",
				total       : '{{checkout.total_price |  money_without_currency| remove: ","}}',
				revenue     :'{{checkout.subtotal_price |  money_without_currency| remove: ","}}',
				shipping    : '{{checkout.shipping_price |  money_without_currency| remove: ","}}',
				tax         : '{{checkout.tax_price |  money_without_currency| remove: ","}}',
				{% for discount in checkout.discounts %}
				discount : '{{discount.amoun t | money_without_currency}}',
				coupon   : '{{discount.code}}',
				{% endfor %}
				currency : '{{shop.currency}}',
				products : [{% for line_item in checkout.line_items %}
				{
					product_id : '{{line_item.product_id}}',
					sku        : '{{line_item.sku}}',
					name       : "{{line_item.title}}",
					price      : '{{line_item.price | money_without_currency| remove: ","}}',
					quantity   : '{{line_item.quantity}}',
					category   : "{{line_item.product.type}}",
				},
				{% endfor %}]
			});
		}
	}
}

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
		return jQuery.getJSON(url, function (response) {
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

	this.getProductArrayData = function(url,callback){
		return jQuery.getJSON(url).then(function (response) {
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
		})
		return __meow__.data;
	}

	this.removeFromCart = function(originalCart,newCart){
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
		var cartIDs = [];
		var removeIDs = [];
		var removeCart = [];
		for(var i=originalCart.length-1;i>=0;i--){var x=parseFloat(originalCart[i].variant);cartIDs.push(x)}for(var i=newCart.length-1;i>=0;i--){var x=parseFloat(newCart[i].variant);removeIDs.push(x)}function arr_diff(b,c){var a=[],diff=[];for(var i=0;i<b.length;i++){a[b[i]]=true}for(var i=0;i<c.length;i++){if(a[c[i]]){delete a[c[i]]}else{a[c[i]]=true}}for(var k in a){diff.push(k)}return diff};var x=arr_diff(cartIDs,removeIDs)[0];for(var i=originalCart.length-1;i>=0;i--){if(originalCart[i].variant==x){removeCart.push(originalCart[i])}}
			return removeCart;
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
	checkout();
	orderCompleted();

	$(document).ready(function(){
		productAdded();
		cartViewed();
		couponApplied();
		productRemoved();
	});
}

/* LOAD ARCHITECTURE */
function init(){
	backoff(isReady, setup);
}

init();
</script>