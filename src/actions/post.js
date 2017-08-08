export function update( payload, slug ) {
  return {
    type: 'POST_UPDATE',
    slug: slug || '', /// TODO[@jmykolyn] - Consider setting an actual fallback value.
    payload,
  };
}

export function initLoadMore( slug ) {
  return {
    type: 'POST_INIT_LOAD_MORE',
    slug: slug || '', /// TODO[@jmykolyn] - Consider setting an actual fallback value.
  };
}

export function resolveLoadMore( payload, slug ) {
  return {
    type: 'POST_RESOLVE_LOAD_MORE',
    slug: slug || '', /// TODO[@jmykolyn] - Consider setting an actual fallback value.
    payload,
  }
}

export function completeLoadMore() {
  return {
    type: 'POST_COMPLETE_LOAD_MORE',
  }
}

export function setActive( post ) {
  return {
    type: 'POST_SET_ACTIVE',
    payload: post,
  }
}

export function removeActive() {
  return {
    type: 'POST_REMOVE_ACTIVE',
  }
}

export function setRecent( payload ) {
  return {
    type: 'POST_SET_RECENT',
    payload,
  }
}

export function setPopular( payload ) {
  return {
    type: 'POST_SET_POPULAR',
    payload,
  }
}
