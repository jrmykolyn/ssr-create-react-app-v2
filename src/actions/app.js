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

export function updateServices( payload ) {
  return {
    type: 'APP_UPDATE_SERVICES',
    payload,
  };
}

export function toggleDrawerNav() {
  return {
    type: 'APP_TOGGLE_DRAWER_NAV',
  };
}

export function closeDrawerNav() {
  return {
    type: 'APP_CLOSE_DRAWER_NAV',
  };
}
