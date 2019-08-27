import React, { Fragment, useState } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';

import { LOGIN, LOGOUT, PRODUCTS, FIRMS } from '../../constants/defaults';
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
  component: Login,
}, {
  path: '/firms',
  key: 'firms',
  component: Firms,
}, {
  path: '/products',
  key: 'products',
  component: Products,
}];

export default () => {
  const [isLoggedin, setIsLoggedin] = useState(!!localStorage.getItem('token'));
  const handleLogout = () => {
    if (isLoggedin) {
      localStorage.removeItem('token');
    }
    setIsLoggedin(!isLoggedin);
    window.location = '/login';
  };

  return <BrowserRouter>
    <div style={{ display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100vh' }}>
      <div>
        <div>
          {isLoggedin
            ? <Fragment><span onClick={handleLogout}>{LOGOUT}</span>{links.map((link) => <Links {...link} />)}</Fragment>
            : <span onClick={handleLogout}>{LOGIN}</span>}
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
  </BrowserRouter>
};
