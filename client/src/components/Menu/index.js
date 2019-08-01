import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { PRODUCTS, FIRMS } from '../../constants/defaults';
import Links from './Links.js';
import Routes from './Routes.js';
import Home from '../Home';
import Firms from '../Firms';
import Products from '../Products';

const links = [{
  path: '/',
  content: 'Home',
}, {
  path: '/firms',
  content: FIRMS,
}, {
  path: '/products',
  content: PRODUCTS,
}];

const routes = [{
  path: '/firms',
  component: Firms,
}, {
  path: '/products',
  component: Products,
}];

export default () => <Router>
  {links.map((link) => <Links {...link} />)}
  {routes.map((route) => <Routes {...route} />)}
</Router>;
