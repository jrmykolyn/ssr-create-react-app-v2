export function update( payload, query ) {
  return {
    type: 'SEARCH_UPDATE',
    query: query || '',
    payload,
  };
}
