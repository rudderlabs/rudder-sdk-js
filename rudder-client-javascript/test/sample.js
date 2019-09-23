//Sample Usage

/* var client
  = RudderClient.getInstance("1QbNPCBQp2RFWolFj2ZhXi2ER6a", RudderConfig.getDefaultConfig().setFlushQueueSize(1));

client.identify((new RudderTraits()).
  setName("Mini").
  setEmail("minimouse@rudderlabs.com").
  setId(generateUUID())); */

/*
var props = new RudderProperty();
props.setProperty("title","How to create a tracking plan");
props.setProperty("course", "Intro to Analytics");
client.track(new RudderElementBuilder().
                setEvent("Article Completed").
                setProperty(props.getPropertyMap()).
                setUserId("dipanjan").
                build());



client.identify((new RudderTraits()).
                    setName("dipanjan").
                    setEmail("dipanjan@rudderlabs.com").
                    setId(generateUUID));

client.page(new RudderElementBuilder().
             setProperty(new PagePropertyBuilder().
                setTitle("Blog Page").
                setUrl("https://rudderlabs.com").
                setPath("/blogs").
                setReferrer("https://www.rudderlabs.com").
                build().
                getPropertyMap()).
                build());


//e-commerce examples
client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PRODUCTS_SEARCHED).
                setProperty(new ProductSearchedEvent().
                setQuery("Dummy Query 1").
                build().getPropertyMap()).
                build());


client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PRODUCT_LIST_VIEWED).
                setProperty(new ProductListViewedEvent().
                addProduct(new ECommerceProduct().setName("Dummy Product 1")).
                addProduct(new ECommerceProduct().setName("Dummy Product 2")).
                setListId("Dummy List 1").
                setCategory("Dummy Product Category 1").
                build().getPropertyMap()).
                build());

client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PRODUCT_LIST_FILTERED).
                setProperty(new ProductListFilteredEvent().
                addProduct(new ECommerceProduct().setName("Dummy Product 1")).
                addProduct(new ECommerceProduct().setName("Dummy Product 2")).
                addFilter(new ECommerceProductFilter().setType("Dummy Filter 1")).
                addFilter(new ECommerceProductFilter().setType("Dummy Filter 2")).
                addSort(new ECommerceProductSort().setType("Dummy Sort 1")).
                addSort(new ECommerceProductSort().setType("Dummy Sort 2")).
                setListId("Dummy List 3").
                build().getPropertyMap()).
                build());


client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PROMOTION_VIEWED).
                setProperty(new PromotionViewedEvent().
                setPromotion(new ECommercePromotion().
                setPromotionId("Dummy Promotion 1").
                setCreative("Dummy Creative 1")).
                build().getPropertyMap()).
                build());

client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PROMOTION_CLICKED).
                setProperty(new PromotionViewedEvent().
                setPromotion(new ECommercePromotion().
                setPromotionId("Dummy Promotion 2").
                setCreative("Dummy Creative 2").
                setName("Dummy Promotion Name 2")).
                build().getPropertyMap()).
                build());

client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PRODUCT_VIEWED).
                setProperty(new ProductViewedEvent().
                setProduct(new ECommerceProduct().setName("Dummy Product 0A").
                setProductId("Dummy Product ID 0A").
                setSku("Dummy SKU 0A")).
                build().getPropertyMap()).
                build());

client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PRODUCT_CLICKED).
                setProperty(new ProductViewedEvent().
                setProduct(new ECommerceProduct().setName("Dummy Product 0B").
                setProductId("Dummy Product ID 0B").
                setPrice(10.85).
                setCurrency("USD").
                setSku("Dummy SKU 0B")).
                build().getPropertyMap()).
                build());

client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PRODUCT_ADDED).
                setProperty(new ProductAddedToCartEvent().
                setProduct(new ECommerceProduct().setName("Dummy Product 1A")).
                setCartId("Dummy Cart 1A").
                build().getPropertyMap()).
                build());

client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PRODUCT_REMOVED).
                setProperty(new ProductAddedToCartEvent().
                setProduct(new ECommerceProduct().setName("Dummy Product 1B")).
                setCartId("Dummy Cart 1B").
                build().getPropertyMap()).
                build());

client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.CART_VIEWED).
                setProperty(new CartViewedEvent().
                addProduct(new ECommerceProduct().setName("Dummy Product 1")).
                addProduct(new ECommerceProduct().setName("Dummy Product 2")).
                setCartId("Dummy Cart 1").
                build().getPropertyMap()).
                build());

client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.CHECKOUT_STARTED).
                setProperty(new CheckoutStartedEvent().
                setOrder(new ECommerceOrder().setOrderId("Dummy Order 1").
                addProduct(new ECommerceProduct().setName("Dummy Product 1")).
                addProduct(new ECommerceProduct().setName("Dummy Product 2"))).
                build().getPropertyMap()).
                build());


client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.CHECKOUT_STEP_VIEWED).
                setProperty(new CheckoutStepViewedEvent().
                setCheckout(new ECommerceCheckout().
                setCheckoutId("Dummy Checkout Id 1").
                setStep(2).
                setShippingMethod("Dummy Checkout Shipping Method 1").
                setPaymentMethod("Dummy Checkout Payment Method 1")).
                build().getPropertyMap()).
                build());

client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.CHECKOUT_STEP_COMPLETED).
                setProperty(new CheckoutStepViewedEvent().
                setCheckout(new ECommerceCheckout().
                setCheckoutId("Dummy Checkout Id 2").
                setStep(3).
                setShippingMethod("Dummy Checkout Shipping Method 2").
                setPaymentMethod("Dummy Checkout Payment Method 2")).
                build().getPropertyMap()).
                build());

client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PAYMENT_INFO_ENTERED).
                setProperty(new PaymentInfoEnteredEvent().
                setPaymentInfo(new ECommercePaymentInfo().
                setCheckoutId("Dummy Checkout Id 3").
                setStep(4).
                setShippingMethod("Dummy Checkout Shipping Method 3").
                setPaymentMethod("Dummy Checkout Payment Method 3")).
                build().getPropertyMap()).
                build());


client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.ORDER_UPDATED).
                setProperty(new OrderUpdatedEvent().
                setOrder(new ECommerceOrder().setOrderId("Dummy Order 4").
                setAffiliation("Dummy Affiliation 2").
                addProduct(new ECommerceProduct().setName("Dummy Product 5")).
                addProduct(new ECommerceProduct().setName("Dummy Product 6").setSku("Dummy SKU 3"))).
                build().getPropertyMap()).
                build());


client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.ORDER_COMPLETED).
                setProperty(new OrderCompletedEvent().
                setOrder(new ECommerceCompletedOrder().
                setOrderId("Dummy Order 5").
                setCheckoutId("Dummy Checkout Id 2").
                setAffiliation("Dummy Affiliation 2").
                addProduct(new ECommerceProduct().setName("Dummy Product 7")).
                addProduct(new ECommerceProduct().setName("Dummy Product 8").setSku("Dummy SKU 4"))).
                build().getPropertyMap()).
                build());

client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.ORDER_REFUNDED).
                setProperty(new OrderRefundedEvent().
                setOrder(new ECommerceOrder().setOrderId("Dummy Order 5").
                setAffiliation("Dummy Affiliation 3").
                setTotal(45.85).
                setCurrency("USD").
                addProduct(new ECommerceProduct().setName("Dummy Product 5")).
                addProduct(new ECommerceProduct().setName("Dummy Product 6").setSku("Dummy SKU 3"))).
                build().getPropertyMap()).
                build());


client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.ORDER_CANCELLED).
                setProperty(new OrderRefundedEvent().
                setOrder(new ECommerceOrder().
                setOrderId("Dummy Order 9").
                setAffiliation("Dummy Affiliation 4").
                setTotal(30).
                setRevenue(25.00).
                setShipping(3).
                setTax(2).
                setDiscount(2.5).
                setCoupon("hasbros").
                setCurrency("USD").
                addProduct(new ECommerceProduct().setName("Dummy Product 7")).
                addProduct(new ECommerceProduct().setName("Dummy Product 8").setSku("Dummy SKU 4"))).
                build().getPropertyMap()).
                build());




client.track(new RudderElementBuilder().
            setEvent(ECommerceEvents.COUPON_APPLIED).
            setProperty(new CouponAppliedEvent().
            setCoupon(new ECommerceAppliedOrRemovedCoupon().
            setOrderId("Dummy Order Id 10").
            setCartId("Dummy Card Id 3").
            setCouponId("Dummy Coupon Id 1").
            setCouponName("Dummy Coupon Name 1").
            setDiscount(12.32)).
            build().getPropertyMap()).
            build());



client.track(new RudderElementBuilder().
            setEvent(ECommerceEvents.COUPON_DENIED).
            setProperty(new CouponDeniedEvent().
            setCoupon(new ECommerceDeniedCoupon().
            setOrderId("Dummy Order Id 11").
            setCartId("Dummy Card Id 4").
            setCouponId("Dummy Coupon Id 2").
            setCouponName("Dummy Coupon Name 2").
            setReason("Dummy Coupon Deny Reason 1")).
            build().getPropertyMap()).
            build());




client.track(new RudderElementBuilder().
            setEvent(ECommerceEvents.COUPON_REMOVED).
            setProperty(new CouponRemovedEvent().
            setCoupon(new ECommerceAppliedOrRemovedCoupon().
            setOrderId("Dummy Order Id 11").
            setCartId("Dummy Card Id 4").
            setCouponId("Dummy Coupon Id 2").
            setCouponName("Dummy Coupon Name 2").
            setDiscount(23.32)).
            build().getPropertyMap()).
            build());

client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PRODUCT_ADDED_TO_WISHLIST).
                setProperty(new ProductAddedToWishlistEvent().
                setProduct(new ECommerceProduct().
                setName("Dummy Product 2").
                setCategory("Dummy Product Category 413").
                setSku("Dummy Product SKU 43").
                setVariant("Dummy Product Variant 34").
                setCoupon("Dummy Product Coupon 123")).
                setWishlist(new ECommerceWishList().setWishlistId("Dummy Wishlist 1").
                setWishlistName("Dummy Wishlist 1")).
                build().getPropertyMap()).
                build());

client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PRODUCT_REMOVED_FROM_WISHLIST).
                setProperty(new ProductRemovedFromWishlistEvent().
                setProduct(new ECommerceProduct().
                setName("Dummy Product 23").
                setCategory("Dummy Product Category 543").
                setSku("Dummy Product SKU 78").
                setVariant("Dummy Product Variant 98").
                setCoupon("Dummy Product Coupon 113")).
                setWishlist(new ECommerceWishList().setWishlistId("Dummy Wishlist 2").
                setWishlistName("Dummy Wishlist 2")).
                build().getPropertyMap()).
                build());

client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.WISH_LIST_PRODUCT_ADDED_TO_CART).
                setProperty(new WishlistProductAddedToCartEvent().
                setCartId("Dummy Cart ID 2019").
                setProduct(new ECommerceProduct().
                setName("Dummy Product 54").
                setCategory("Dummy Product Category 28").
                setSku("Dummy Product SKU 12").
                setVariant("Dummy Product Variant 76").
                setCoupon("Dummy Product Coupon 3")).
                setWishlist(new ECommerceWishList()
                .setWishlistId("Dummy Wishlist 2").
                setWishlistName("Dummy Wishlist 2")).
                build().getPropertyMap()).
                build());
client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PRODUCT_SHARED).
                setProperty(new ProductSharedEvent().
                setShareVia("Dummy Share Via 1").
                setShareMessage("Dummy Message 1").
                setRecipient("Dummy Recipient 1").
                setProduct(new ECommerceProduct().
                setName("Dummy Product 542").
                setCategory("Dummy Product Category 228").
                setSku("Dummy Product SKU 212").
                setVariant("Dummy Product Variant 276").
                setCoupon("Dummy Product Coupon 23")).
                build().getPropertyMap()).
                build());
client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.CART_SHARED).
                setProperty(new CartSharedEvent().
                setShareVia("Dummy Share Via 2").
                setShareMessage("Dummy Message 2").
                setRecipient("Dummy Recipient 2").
                setCartId("Dummy Shared Cart Id 1").
                addProduct(new ECommerceProductBase().
                setProductId("Dummy Product Id 255")).
                addProduct(new ECommerceProductBase().
                setProductId("Dummy Product Id 522")).
                build().getPropertyMap()).
                build());
client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PRODUCT_REVIEWED).
                setProperty(new ProductReviewedEvent().
                setProductId("Dummy Review Propduct Id 67").
                setReviewId("Dummy Review ID 1").
                setReviewBody("Dummy Review Body 1").
                setRating("Excellent").
                build().getPropertyMap()).
                build());
*/
