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
