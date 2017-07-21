import { combineReducers } from 'redux';

import user from './user';
import home from './home';
import page from './page';
import post from './post';

export default combineReducers( {
  user,
  home,
  page,
  post,
} );
