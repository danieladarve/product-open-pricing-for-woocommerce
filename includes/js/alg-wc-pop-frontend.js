/**
 * alg-wc-pop-frontend.js.
 *
 * @since   1.3.1
 */

(function($){
	
	function alg_wc_pop_force_decimals(e){
		var value = parseFloat( e.val() );
		if ( isNaN( value ) ) {
			value = 0;
		}
		e.val( value.toFixed( alg_wc_pop_data_object.force_decimal_width ) );
	}
	
	function wpw_pop_stripe_applepay_shiv( amount ){
		
		// This is dumb, but since no other hooks are available to us, this is the
		// only way to pass the user-selected amount into the ajax request made by
		// WooCommerce Stripe Gateway (https://wordpress.org/plugins/woocommerce-gateway-stripe/)
		// when the user clicks an Apple Pay button from the product page directly.
		// (i.e. before the product has actually been added to cart.)
		
		// Step 1: create a #product-addons-total element, which will be picked up by 
		// wc_stripe_payment_request.getSelectedProductData()
		// (see woocommerce-gateway-stripe/assets/js/stripe-payment-request.js)
		if ( ! $( '#product-addons-total' ).length ) {
			$( 'body' ).append( '<div id="product-addons-total" style="display:none"></div>' );
		}
		$( '#product-addons-total' ).data( 'price_data', [{ cost: amount }] );
		
		// Step 2: create a form input with name="addon-wpw_pop_open_price", which
		// will be picked up by wc_stripe_payment_request.addToCart()
		// (see woocommerce-gateway-stripe/assets/js/stripe-payment-request.js)
		if ( ! $( '#wpw_pop_open_price' ).length ) {
			$( 'form.cart' ).append( '<input type="hidden" id="wpw_pop_open_price" name="addon-wpw_pop_open_price" />' );
		}
		$( '#wpw_pop_open_price' ).val( amount );
		
		// Step 3: trigger an event to make sure the above is picked up (mostly for step 1)
		$( document.body ).trigger( 'woocommerce_variation_has_changed' );
		
	}
	
	$( document ).ready( function(){
		$( '.alg_open_price' ).each( function(){
			alg_wc_pop_force_decimals( $( this ) );
			$( this ).on( 'change', function(){
				alg_wc_pop_force_decimals( $( this ) );
				wpw_pop_stripe_applepay_shiv( $( this ).val() );
			});
		});
	});
	
})( jQuery );
