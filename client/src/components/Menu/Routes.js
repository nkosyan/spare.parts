import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';

import Home from '../Home';

const Routes = ({ path, component, subRoute }) => {
  if (subRoute !== undefined) {
    return <Fragment>
      <Route exact path='/' component={Home} />
      <Route path={path} component={component} />
      {subRoute.map((route) => <Routes {...route} />)}
    </Fragment>;
  }
  return <Route path={path} component = {component} />;
};

export default Routes;
