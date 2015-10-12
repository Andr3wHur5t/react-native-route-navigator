/**
 * Created by andrewhurst on 9/26/15.
 */
var Route = require('route-parser');
var { Navigator } = require('react-native');

class Router {
  /**
   * Adds a route to the router.
   * @param name The name of the route.
   * @param URI The URI of the route.
   * @param component The react component of the route.
   * @param opts The options of the route.
   */
  addRoute(name, URI, component, opts) {
    opts = opts || {};
    if ( typeof name !== 'string' )
      throw new Error('Name must be a string.');
    if ( typeof URI !== 'string' )
      throw new Error('URI must be a string.');
    if ( !URI )
      throw new Error('Must set a component.');

    opts.defaultAnimation = opts.defaultAnimation || Navigator.SceneConfigs.FadeAndroid;
    opts.useCache = opts.useCache || false;
    opts.canOpenExternally = opts.canOpenExternally || false;

    this.URIRoutes[URI] = name;
    this.namedRoutes[name] = { name, URI, component, ...opts };
    //console.log(`Added route ${name} with ${URI}`);
  }

  get URIRoutes() {
    if ( !this._URIRoutes )
      this._URIRoutes = {};
    return this._URIRoutes;
  }

  /**
   * Finds the name of the specified URI,
   * @param uri The URI to search for.
   * @returns {String, Boolean}
   */
  nameForURI(uri) {
    // Order matters, do inverse.
    var URIs = Object.keys(this.URIRoutes);
    for ( var i = URIs.length - 1; i >= 0; --i )
      if ((new Route(URIs[i])).match(uri))
        return this.URIRoutes[URIs[i]];
    return false;
  }

  /**
   * Gets the URI for the route with the specified name.
   * @param name The name of the route.
   * @returns {string}
   */
  uriForName(name) {
    for (var k in this.URIRoutes )
      if (this.URIRoutes[k] === name)
        return k;
  }

  get namedRoutes() {
    if ( !this._namedRoutes )
      this._namedRoutes = {};
    return this._namedRoutes;
  }

  /**
   * Gets the route for the specified query.
   * @param q The query to get the route for.
   * @returns {*}
   */
  getRoute(q) {
    if ( typeof q !== 'string' )
      throw new Error('Q must be a string.');
    var name = this.nameForURI(q);
    var ret = {route: this.namedRoutes[ name || q ]};
    if (name)
      ret.query = (new Route(ret.route.URI)).match(q);
    return ret ;
  }
}

module.exports = Router;
