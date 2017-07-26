import { combineReducers } from 'redux';

import app from './app';
import archive from './archive';
import home from './home';
import page from './page';
import post from './post';
import search from './search';
import user from './user';

export default combineReducers( {
  app,
  archive,
  home,
  page,
  post,
  search,
  user,
} );
