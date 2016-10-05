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
* jQuery Cookie Plugin v1.4.1 - https://github.com/carhartl/jquery-cookie
DataLayer Architecture: Shopify v1.3.1
COPYRIGHT 2016
LICENSES: MIT ( https://opensource.org/licenses/MIT )
*/

/* =======================
| PREREQUISITE LIBRARIES |
----------------------- */

// jquery-cookies.js


/* ======================
| Begin dataLayer Build |
---------------------- */

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

/* DATALAYER: Checkout
-------------------------- */

if(Shopify.Checkout.step.length > 0){
	if (Shopify.Checkout.step === 'contact_information'){
		dataLayer.push({
			'event':'Checkout',
			'event':'Customer Information'});
	}else if (Shopify.Checkout.step === 'shipping_method'){
		dataLayer.push({
			'event':'Shipping Information'});
	}else if( Shopify.Checkout.step === "payment_method" ){
		dataLayer.push({
			'event':'Add Payment Info'});
	}
}

/* DATALAYER: Confirmation
-------------------------- */

if(Shopify.Checkout.page == "thank_you"){
	{% if first_time_accessed %}
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
	{% endif %}
}


/* DATALAYER: All Pages
-----------------------
Fire all pages trigger after all additional dataLayers have loaded. */

dataLayer.push({
	'event':'All Pages'
});
</script>
