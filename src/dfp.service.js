// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
/**
 * ...
 */
function injectScripts() {
  var gads = document.createElement( 'script' );

  gads.async = true;
  gads.type = 'text/javascript';
  gads.src = document.location.protocol + '//www.googletagservices.com/tag/js/gpt.js';

  var node = document.getElementsByTagName( 'script' )[ 0 ];
  node.parentNode.insertBefore( gads, node );
}

/**
 * ...
 */
function setTargets( targets ) {
  if ( !targets || typeof targets !== 'object' ) {
    return;
  }

  Object.keys( targets ).forEach( ( key ) => {
    window.googletag.pubads().setTargeting( key, targets[ key ] );
  } );
}

/**
 * ...
 */
function addInitialFunction() {
  window.googletag.cmd.push( function() {
    var sjm_dfp_ref = ''; /// TEMP - Where is this supposed to come from?

    window.googletag.pubads().setTargeting( 'ref', sjm_dfp_ref );

    setTargets( window.sjmdfp.targets );

    window.googletag.pubads().enableSingleRequest();

    if ( typeof window.sjmdfp.sjm_dfp_collapse_empty === 'string' && window.sjmdfp.sjm_dfp_collapse_empty === 'on' ) {
      window.googletag.pubads().collapseEmptyDivs();
    }

    window.googletag.pubads().disableInitialLoad();

    window.googletag.enableServices();
  } );
}

// --------------------------------------------------
// DECLARE PRIVATE VARS
// --------------------------------------------------
var instances = [];

// --------------------------------------------------
// DEFINE CLASS
// --------------------------------------------------
export class DfpService {
  /**
   * ...
   */
  constructor() {
    // ...
    if ( instances.length ) {
      return instances[ 0 ];
    } else {
      instances.push( this );
    }

    if ( !window.sjmdfp ) {
      console.warn( 'Whoops! Could not find `sjmdfp` data' );
      return;
    }

    // ...
    injectScripts();
    addInitialFunction();

    return this;
  }

  /**
   * ...
   */
  refreshAds() {
    console.log( 'INSIDE `refreshAds()`' ); /// TEMP

    if ( typeof window.sjmdfp === 'undefined' || ! window.sjmdfp.slots ) {
      return;
    }

    console.log( 'DFP DATA EXISTS' ); /// TEMP

    var ads_to_refresh = [];
    var slots = window.sjmdfp.slots || [];

    console.log( 'ADDING NEW FUNCTION TO `googletag.cmd` ARRAY' ); /// TEMP

    window.googletag.cmd.push( function() {
      console.log( 'INSIDE `googletag.cmd` FUNCTIONS' ); /// TEMP

      slots.forEach( function( slot, i ) {

        console.log( 'INSIDE `googletag.cmd` FUNCTIONS' ); /// TEMP

        var network = slot.network_override ? slot.network_override : window.sjmdfp.publisher_id;
        var dfp_slot = '/' + network + '/' + slot.dfpname;
        var sizes = JSON.parse( '[' + slot.sizes + ']' );
        var responsive_map = JSON.parse( '[' + slot.responsive_map + ']' );
        var basename = 'sjm-dfp-' + slot.name.toLowerCase().replace( /\s/g, '-' );
        var op = slot.autopos_type === 'NONE' ? false : slot.autopos_type.toLowerCase();
        var selector = op ? slot.autopos_divid : '.' + basename + '-wrapper';

        var targets = document.querySelectorAll( selector );

        console.log( 'LOGGING OUT MATCHED `targets`' ); /// TEMP
        console.log( targets ); /// TEMP

        targets = Array.prototype.slice.call( targets ).filter( function( elem, i ) {
          return !elem.innerHTML;
        } );

        console.log( 'LOGGING OUT `targets`' ); /// TEMP
        console.log( targets ); /// TEMP

        if ( typeof slots[ i ].rendered === 'undefined' ) {
          slots[ i ].rendered = [];
        }

        targets.forEach( function( target ) {
            console.log( 'LOGGING OUT CURRENT `target`' ); /// TEMP
            console.log( target ); /// TEMP

            // var data = target.data( 'sjm-dfp-rendered' ) || {}; /// FIXME

            // if ( typeof data[ basename ] !== 'undefined' ) {
            //   return;
            // }

            var j = slots[ i ].rendered.length;

            // data[ basename ] = j;

            // target.data( 'sjm-dfp-rendered', data ); /// FIXME

            var divid = basename + '-' + j;

            // Create new <div>
            var div = document.createElement( 'div' );
            div.id = divid;
            div.classList.add( basename );
            div.setAttribute( 'style', slot.slot_css );
            // div.dataset[ 'sjm-dfp-slot' ] = slot;

            // Create new <p> for `indicator` text.
            var indicator = document.createElement( 'p' );
            indicator.classList.add( 'ad-indicator' );
            indicator.innerHTML = ( slot.indicator_text ) ? slot.indicator_text : '';

            // Create new `wrapper` elem.
            var wrapper = document.createElement( 'div' );
            wrapper.id = divid + '-wrapper';
            wrapper.classList.add( 'sjm-dfp-wrapper' );
            wrapper.classList.add( basename + '-wrapper' );
            wrapper.setAttribute( 'style', slot.wrapper_css );

            /// TODO
            if ( op ) {
              wrapper.appendChild( indicator );
              wrapper.appendChild( div );

              target.appendChild( wrapper ); /// FIXME
              // target[ op ]( wrapper ); /// TODO - Review, implement.
            } else {
              target.innerHTML = '';

              wrapper.appendChild( indicator );
              wrapper.appendChild( div );
            }

            var ad;

            if ( typeof slot.oop === 'string' && parseInt( slot.oop, 10 ) === 1 ) {
              ad = window.googletag.defineOutOfPageSlot( dfp_slot, divid ).addService( window.googletag.pubads() );
            } else {
              ad = window.googletag.defineSlot( dfp_slot, sizes, divid ).addService( window.googletag.pubads() );
            }

            if ( responsive_map ) {
              ad.defineSizeMapping( responsive_map );
            }

            slots[ i ].rendered.push( ad );
            ads_to_refresh.push( ad );
            window.googletag.display( divid );
          } );
      } );

      var refreshTimer = setInterval( function() {
        if ( typeof window.googletag.pubads === 'function' ) {
          window.googletag.pubads().refresh( ads_to_refresh );
          clearInterval( refreshTimer );
        }
      }, 10 );

      window.googletag.pubads().addEventListener( 'slotRenderEnded', function( e ) {
        var slot = e.slot.getSlotId().getDomId();
        var adUnit = e.slot.getSlotId().getName().replace( /^\/[0-9]+\//, '' );
        var wrapper =  slot + '-wrapper';
        var wrapperElem = document.getElementById( wrapper );
        var eventObject = { 'hitType': 'event', 'eventCategory': 'DFP Render Event', 'eventAction': adUnit, 'nonInteraction': true };

        if ( e.isEmpty ) {
          eventObject.eventLabel = 'MISS';

          //collapseEmptyDivs is not very effective
          //let's hide the wrapper if a slot is empty after its render event
          if ( typeof window.sjmdfp.collapse === 'string' && window.sjmdfp.collapse === '1' ) {
            wrapperElem.style.display = 'none';

              /// TODO
              // $( window ).trigger( 'SJM_LOG', [ 'Hiding wrapper ' + wrapper + ' because its slot rendered empty', window.sjmdfp ] );
          }
        } else {
          eventObject.eventLabel = 'HIT';

          wrapperElem.classList.add( 'sjm-dfp-rendered' );

          //enforce hide_on_render rules
          // var domElemId = e.slot.getSlotId().getDomId();
          // var elem = document.getElementById( domElemId );
          // var data = elem.dataset[ 'sjm-dfp-slot' ];

          // if( data.hide_on_render ) {
          //     /// TODO
          //     $( data.hide_on_render ).hide();
          //     $( window ).trigger( 'SJM_LOG', [ 'Hiding elements ' + data.hide_on_render + ' because of hide-on-render rules on slot ' + data.name, window.sjmdfp ] );
          //   }
          // }

          if( window.sjmdfp.track ) {
            /// TODO
            // $( window ).trigger( 'SJM_SEND_GA', [ eventObject, window.sjmdfp ] );
          }
        }
      } );
    } );
  } // /refreshAds()
} // /DfpService
