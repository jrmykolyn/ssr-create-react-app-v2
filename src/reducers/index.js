import { combineReducers } from 'redux';

import archive from './archive';
import home from './home';
import page from './page';
import post from './post';
import user from './user';

export default combineReducers( {
  archive,
  home,
  page,
  post,
  user,
} );
