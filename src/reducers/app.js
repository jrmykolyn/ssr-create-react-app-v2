const initialState = {
  menus: {},
  services: {},
  searchBar: {},
};

export default function reducer( state=initialState, action ) {
  switch ( action.type ) {
    case 'APP_UPDATE_MENUS':
      return { ...state, ...{ menus: action.payload } };
    case 'APP_UPDATE_SERVICES':
      let currentServices = state.services;
      let newServices = { [ action.payload.name ]: action.payload.ref };
      let mergedServices = { ...currentServices, ...newServices };

      return { ...state, ...{ services: mergedServices } };
    case 'APP_TOGGLE_SEARCH_BAR':
      // Capture current `isActive` value, cast as boolean.
      let currVal = !!( state && state.searchBar && state.searchBar.isActive );

      return { ...state, ...{ searchBar: { isActive: !currVal } } };
    default:
      return state
  }
}
