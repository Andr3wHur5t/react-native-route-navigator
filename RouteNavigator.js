/**
 * Created by andrewhurst on 9/26/15.
 */
var React = require('react-native');
var { Navigator } = React;

function NavigationError (msg, route) {
  this.message = msg;
  this.type = 'Navigation';
  this.routeName = route.name;
  this.route = route;
  return this;
}
NavigationError.prototype = Object.create(Error);

/**
 * Navigates and manages a set of pages.
 */
class RouteNavigator extends React.Component {
  render() {
    return (
      <Navigator
        initialRouteStack={this.initialRouteStack}
        configureScene={(raw) => {
            return raw.animation || this.routeFor(raw).route.defaultAnimation;
          }}
        renderScene={(raw, nav) => {
            var { body } = raw;
            var { route, query }= this.routeFor(raw);
            if ( !route )
              throw new NavigationError('Failed to find route', route);
            return this.getPage(
              route,
              nav,
              raw,
              ref => {
                if ( !ref ) return;
                ref.props = { ...(ref.props || {}), ...(route.props || {}) };
                ref.setState({ query: query, body: body });
              }
            );
          }}
        />
    );
  }

  get router() {
    if ( !this.props.router )
      throw new Error('Route navigator must have a router.');
    return this.props.router;
  }

  routeFor(raw) {
    if ( typeof raw === 'string' )
      return this.router.getRoute(raw);

    var base = this.router.getRoute(raw.name || raw.URI);
    for ( var k in raw )
      base[k] = raw[k];
    return base;
  }

  /**
   * Gets the initial route stack.
   * @returns {[]}
   */
  get initialRouteStack() {
    return this.props.initialRouteStack || [ this.props.initialRoute ];
  }

  /**
   * Our Component map and cache, you should define your pages and props here.
   * @returns {Object}
   */
  get pages () {
    if ( !this._pages ) this._pages = {};
    return this._pages
  }

  getPage(route, nav, raw, refCallback) {
    var { name, props, component } = route;

    // Construct if needed
    this.pages[name] = this.pages[name] || {};
    var page = this.pages[name];

    // Try to use cached page
    if (page.cached && !props )
      return page.cached;

    // Construct Component
    if (component) {
      // Build Props
      var _props = {
        app: this.props.app,
        nav,
        ref: (c) => { page.ref = c; (refCallback || (()=>{}))(c); },
        ...(props),
        ...(raw.props || {}),
      };

      // Create element
      var com = React.createElement( component, _props );

      // Cache element
      if (page.useCache)
        page.cached = com;
    }
    return com;
  }
}

module.exports = RouteNavigator;
