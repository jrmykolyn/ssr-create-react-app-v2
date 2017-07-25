export function update( payload, archiveType ) {
  return {
    type: 'ARCHIVE_UPDATE',
    archiveType: archiveType || '', /// TODO[@jmykolyn] - Consider setting an actual fallback value.
    payload,
  };
}
