export function update( payload, slug ) {
  return {
    type: 'ARCHIVE_UPDATE',
    slug: slug || '', /// TODO[@jmykolyn] - Consider setting an actual fallback value.
    payload,
  };
}
