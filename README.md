# react-native-route-navigator

react-native [Navigator](https://facebook.github.io/react-native/docs/navigator.html) with URI driven navigation facilitating simple transfer of data between components using query, and body parameters.

[![NPM](https://nodei.co/npm/react-native-route-navigator.png?downloads=true&stars=true)](https://nodei.co/npm/react-native-route-navigator/)

## Quick start

Install the module:

```
npm install --save react-native-route-navigator
```

Add it you your application:

```javascript
var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Navigator
} = React;
var { RouteNavigator, Router } = require('react-native-route-navigator');

class DemoApp extends React.Component {
  render() {
    return (
      <RouteNavigator style={styles.container}
          initialRouteStack={['/page1/my-id-string']}
                     router={this.router}
                        app={this}/>
    );
  }

  get router() {
    if ( !this._router ) {
      this._router = new Router();
      this.addRoutes(this._router);
    }
    return this._router;
  }

  addRoutes(router) {
    // Add our routes here
    router.addRoute( 'page1', '/page1/:id', Page1Component, {
      defaultAnimation: Navigator.SceneConfigs.FadeAndroid,
    });

    router.addRoute( 'page2', '/page2/', Page2Component, {
      defaultAnimation: Navigator.SceneConfigs.FloatFromRight,
      props: {
        name: 'joe',
        didPressButton: () => alert('Action from my app!')
      }
    });
  }
}

class Page1Component extends React.Component {
    render() {
        return (
          <View style={styles.container}>
            <Text style={styles.title}> Page 1! </Text>
            <Text> Called With ID: {this.query.id} </Text>
            <TouchableHighlight style={styles.button}
                              onPress={this.goToPage2.bind(this)}>
              <Text>Go To Page 2!</Text>
            </TouchableHighlight>
          </View>
        );
    }

    goToPage2() {
      this.props.nav.push('/page2/')
    }

    get query() {
      return (this.state || {}).query || {};
    }
}

class Page2Component extends React.Component {
    render() {
        return (
          <View style={styles.container}>
            <Text style={styles.title}> Page 2! </Text>
            <Text> Hello {this.props.name} </Text>
            <TouchableHighlight style={styles.button}
                              onPress={this.goBack.bind(this)}>
              <Text>Go Back!</Text>
            </TouchableHighlight>
          </View>
        );
    }

    goBack() {
        this.props.nav.pop();   
    }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
    marginTop: 10,
    backgroundColor: 'green',
    padding: 15
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

AppRegistry.registerComponent('DemoApp', () => DemoApp);
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

```javascript
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

You can receive URI parameters via `this.state.query` and the body object via `this.state.body` in the constructed component.
