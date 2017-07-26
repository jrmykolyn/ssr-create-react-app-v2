// --------------------------------------------------
// IMPORT MODULES
// --------------------------------------------------
import { stringUtils } from './';

// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
function decorateSocialData( data ) {
  let defaults = {
    alt: '#',
    target: '_blank',
  };

  return { ...defaults, ...data };
}

function extractTwitterData( post ) {
  return {
    url: `https://twitter.com/intent/tweet?text=${stringUtils.urlize( post.post_title )}`,
    img: '/assets/icons/twitter.svg',
  }
}

function extractFacebookData( post ) {
  return {
    url: `https://www.facebook.com/sharer.php?u=${window.location.href}`,
    img: '/assets/icons/facebook.svg',
  }
}

function extractPinterestData( post ) {
  return {
    url: `#http://pinterest.com/pin/create/button/?url=${window.location.href}`, /// TODO[@jmykolyn] - Add `&media=` query string param.
    img: '/assets/icons/pinterest.svg',
  }
}

function extractEmailData( post ) {
  return {
    url: `mailto:?subject=${stringUtils.urlize( post.post_title)}&body=${post.post_title }: ${window.location.href}`,
    img: '/assets/icons/email.svg',
    target: '_self',
  }
}

/**
 * ...
 */
function extractSocialMediaData( post ) {
  // Given a selection of callbacks, invoke each with the `post` data and return the resulting array.
  return [ extractTwitterData, extractFacebookData, extractPinterestData, extractEmailData ]
    .reduce( ( arr, callback ) => {
      return [ ...arr, decorateSocialData( callback( post ) ) ];
    }, [] );
}

// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
export const mediaUtils = {
  extractSocialMediaData,
}
