export function updateMenus( payload ) {
  return {
    type: 'APP_UPDATE_MENUS',
    payload,
  };
}

export function toggleSearchBar() {
  return {
    type: 'APP_TOGGLE_SEARCH_BAR',
  };
}
