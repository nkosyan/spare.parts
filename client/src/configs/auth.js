import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect';
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper';
import {
  userIsAuth,
  getRegisteredUser,
  getRouteAccordingPermission,
  getUserRoles,
} from 'selectors/users';

const locationHelper = locationHelperBuilder({});

export const isAuth = connectedRouterRedirect({
  // The url to redirect user to if they fail
  redirectPath: '/sign-in',
  // If selector is true, wrapper will not redirect
  // For example let's check that state contains user data
  authenticatedSelector: userIsAuth,
  // A nice display name for this check
  wrapperDisplayName: 'UserIsAuthenticated',
});

export const isNotAuth = connectedRouterRedirect({
  // This sends the user either to the query param route if we have one, or to the landing page if none is specified and the user is already logged in
  redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(
    ownProps,
  ) || getRouteAccordingPermission(state),
  // This prevents us from adding the query parameter when we send the user away from the login page
  allowRedirectBack: false,
  // If selector is true, wrapper will not redirect
  // So if there is no user data, then we show the page
  authenticatedSelector: state => !userIsAuth(state),
  // A nice display name for this check
  wrapperDisplayName: 'UserIsNotAuthenticated',
});

export const isNotVerified = connectedRouterRedirect({
  // This sends the user either to the query param route if we have one, or to the landing page if none is specified and the user is already logged in
  redirectPath: '/sign-up',
  // This prevents us from adding the query parameter when we send the user away from the login page
  allowRedirectBack: false,
  // If selector is true, wrapper will not redirect
  // So if there is no user data, then we show the page
  authenticatedSelector: (state) => {
    const user = getRegisteredUser(state);
    return user && !user.isVerified;
  },
  // A nice display name for this check
  wrapperDisplayName: 'userIsNotVerified',
});
