# react-native-route-navigator

URI route navigator for react native.

## Quick start

Install the module:

```
npm install --save react-native-route-navigator
```

Add it you your application:

```
var React = require('React'),
 { RouteNavigator, Router } = require('react-native-route-navigator');

class DemoApp extends React.Component {
	render() {
		return <RouteNavigator initialRouteStack={['/page1/my-id-string']]}
                            router={this.router}
                            app={this}/>
	}
	
	get router() {
		if ( !this._router ) {
	    	this._router = new Router();
     		this.addRoutes(this._router);
    	}
	    return this._router;
	}
	
	addRoutes(router) {
    	// Specify Page Name, Page URI, Component, Options 
    	router.addRoute( 'page1', '/page1/:id', Page1, {
      	defaultAnimation: Navigator.SceneConfigs.FadeAndroid,
	      props: {
        	didAuthenticate: this.didAuthenticate.bind(this)
      		}
    	});
    	
    	router.addRoute( 'page2', '/page2/', Page2, {
      	defaultAnimation: Navigator.SceneConfigs.FadeAndroid,
	      props: {
        	didAuthenticate: this.didAuthenticate.bind(this)
      		}
    	});
    }
}

React.AppRegistry.registerComponent('DemoApp',  () => DemoApp);
```

## RouteNavigator

This extends reacts [Navigator](https://facebook.github.io/react-native/docs/navigator.html) class.

- `app` - Application reference to pass to all managed components.
- `Router` - The composed router to use for route navigation.

## Routes


- `name` - The name of the route.
- `URI` - The [route-parser](https://www.npmjs.com/package/route-parser) URI.
- `component` - Unconstructed React component class to use for the page.
- `options`
	- `defaultAnimation` - The default animation to use if none are specific.
	- `props` - The props to construct the component with.
	- `useCache` - States if the component should persist when unmounted.
	
## How To Navigate

The RouteNavigator will construct mounted components with `app` and `nav`. `app` being the `app` prop passed to the route navigator, and `nav` being a reference to the [Navigator](https://facebook.github.io/react-native/docs/navigator.html) component.

The nav object can be an object or a string.

Nav Object Components:

- `name` - The name or URI of the route
- `animation` - The animation to use for the transition
- `props` - Additional props to use for the controller
- `body` - The body object to pass to the controller.

Example calls:

```
// Go back to previous controller in route stack
this.props.nav.pop();

// Navigate By URI
this.props.nav.push('/page1/123');

// URI with Non Default Animation
this.props.nav.push({ 
	name: '/page1/123',
	animation: Navigator.SceneConfigs.FadeAndroid,
	props: {
		isRed: true
	},
	body: {
		cakeIs: 'lie'
	}
});

// Navigate By Name
this.props.nav.push('page1');
this.props.nav.push({ name: 'page1'});
```

## Reading Navigation Query/Body

You can receive URI perameters via `this.state.query` and the body object via `this.state.body`.
