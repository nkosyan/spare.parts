import React from 'react';
import {BrowserRouter, Link} from 'react-router-dom';

import { PRODUCTS, FIRMS } from '../../constants/defaults';
import { isAuth, isNotAuth } from '../../configs/auth';
import Links from './Links.js';
import Routes from './Routes.js';
import Home from '../Home';
import Login from '../Login';
import Firms from '../Firms';
import Products from '../Products';

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
}];

const routes = [{
  path: '/login',
  key: 'login',
  component: isNotAuth(Login),
}, {
  path: '/firms',
  key: 'firms',
  component: Firms,
}, {
  path: '/products',
  key: 'products',
  component: Products,
}];

export default () => <BrowserRouter>
    <div style={{ display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100vh' }}>
      <div>
        <div>Header
          <Link to='/login'>Login</Link>
          {links.map((link) => <Links {...link} />)}
        </div>
        {routes.map((route) => <Routes {...route} />)}
      </div>
      <div style={{
        textAlign: 'center',
        fontSize: '14px',
        background: '#FAFAFA',
        borderTop: '1px solid #E7E7E7',
      }}>Footer</div>
    </div>
  </BrowserRouter>;
