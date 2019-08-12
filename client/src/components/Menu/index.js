import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { FIRMS, PRODUCTS, SELLS } from '../../constants/defaults';
import Links from './Links.js';
import Routes from './Routes.js';
import Home from '../Home';
import Firms from '../Firms';
import Products from '../Products';
import Sells from '../Sells';

const links = [{
  path: '/',
  key: 'home',
  content: 'Home',
}, {
  path: '/firms',
  key: 'firms',
  content: FIRMS,
}, {
  path: '/products',
  key: 'products',
  content: PRODUCTS,
}, {
  path: '/sells',
  key: 'sells',
  content: SELLS,
}];

const routes = [{
  path: '/',
  key: 'home',
  component: Home,
}, {
  path: '/firms',
  key: 'firms',
  component: Firms,
}, {
  path: '/products',
  key: 'products',
  component: Products,
}, {
  path: '/sells',
  key: 'sells',
  component: Sells,
}];

export default () => <Router>
  <div style={{ height: '50px' }}>{links.map((link) => <Links {...link} />)}</div>
  {routes.map((route) => <Routes {...route} />)}
</Router>;
