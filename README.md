# dataLayer-shopify

|Pages / Actions |Description |
| --------|---------|
|All Pages |Sitewide |
|Landing Page |When a user first lands on the site|
|Homepage|Primary web page|
|Blog Page|Blog Articles ( will not trigger on blog category pages, only within articles )|
|Product List Page ( Collections )|List of your products|
|Product Page|View of a single product|
|Add to Cart|User adds anything to their cart|
|Cart Page|User views their cart|
|Checkout ( Only Available on Shopify Plus )|Triggers on the “Customer Information” section of the Checkout funnel|
|Add Payment Info ( Only Available on Shopify Plus )|Triggers when user lands on “Payment Information” of Checkout funnel|
|Confirmation Page|Successful Purchase|

|All Variables Collected |Description |Page(s) Available|
| --------|---------|---------|
|Page Type	|The page type ( Landing Page, Blog Page, Product Page, etc )|*All*|
|Event|Same as page type ( used for triggers )|*All* |
|Shopify User ID	|Unique customer ID issued by Shopify either after successful purchase of if customer signs in|*Confirmation Page / All Pages when customer signs in*|
|Log State|If user is logged in or out|*All Pages*|
|Timestamp|Accurately capture time|*All Pages*|
|Blog Author|Author of current article|*Blog Page*|
|Blog Title|Title of current article|*Blog Page*|
|Blog Created|Date current article was created|*Blog Page*|
|Product ID|Unique product ID that defines all variants of single product|*Product Page / Cart / Confirmation Page*|
|Product SKU|Defines the SKU of a product|*Product Page / Cart / Confirmation Page*|
|Product Variant|Defines the variant ID|*Product Page / Cart / Confirmation Page*|
|Product Category ( collections )|Get category of a product|Product List Page / *Product*, **_Cart & Confirmation Page are under construction_**|
|Product Price|Price of a product ( returns price of product regardless of promo discount )|*Product Page / Cart / Confirmation Page*|
|Product Name|Name of a product|*Product Page / Cart / Confirmation Page*|
|Product Quantity|Quantity of a product|*Cart / Confirmation Page*|
|Transaction ID|Unique ID rendered for a successful purchase ( Only accessible via API )|*Confirmation Page*|
|Transaction Number|Unique ID rendered for a successful purchase ( Accessible in Shopify Order Report )|*Confirmation Page*|
|Transaction Affiliation|Shop name|*Confirmation Page*|
|Transaction Total|Total amount of transaction subtracted by discounts|*Confirmation Page*|
|Transaction Tax|Tax of entire transaction|*Confirmation Page*|
|Transaction Shipping|Cost of transaction shipping|*Confirmation Page*|
|Transaction Promo Code|Promotional code |*Confirmation Page*|
|Transaction Promo Discount |Amount of discount promo code provided|*Confirmation Page*|
