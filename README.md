这个repo是参考阮一峰老师的[react-demos](https://github.com/ruanyf/react-demos)。

这些demo是学习[React](https://reactjs.org)的练手活。

## How to use

First copy the repo into your disk.

```bash
$ git clone git@github:charleserious/react-practices.git
```

Then play with the source files under the repo's * directories.

## HTML Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{title}</title>
</head>
<body>
    <div id="example"></div>
</body>
<script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
<script crossorigin src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
<script type="text/babel">

    // ** Our code goes here! **

</script>
</html>
```

## Index

- [Render JSX](#render-jsx-source)
- [JavaScript in JSX](#javascript-in-jsx-source)
- [Use array in JSX](#use-array-in-jsx-source)
- [Define a component](#define-a-component-source)
- [this.props.children](#thispropschildren-source)
- [PropTypes](#proptypes-source)
- [Finding a DOM node](#finding-a-dom-node-source)
- [this.state](#thisstate-source)
- [Form](#form-source)
- [Component LifeCycle](#component-lifecycle-source)
- [Ajax](#ajax-source)
- [Display value from a Promise](#display-value-from-a-promise-source)
- [Server-side rendering](#server-side-rendering-source)

## Render JSX ([source](https://github.com/charleserious/react-practices/tree/master/render.jsx))

The template syntax in React is called [JSX](http://facebook.github.io/react/docs/displaying-data.html#jsx-syntax). It is allowed in JSX to put HTML tags directly into JavaScript codes. `ReactDOM.render()` is the method which translates JSX into HTML, and renders it into the specified DOM node.

```JavaScript
ReactDOM.render(
    <h1>Hello, World</h1>,
    document.getElementById( 'example' )
);
```

Attention, you have to use `<script type="text/babel">` to indicate JSX codes, and include [`babel.min.js`](https://unpkg.com/babel-standalone@6/babel.min.js), which is a [browser version](https://babeljs.io/docs/setup/) of Babel, to actually perform the transformation in the browser.

## JavaScript in JSX ([source](https://github.com/charleserious/react-practices/tree/master/javascript.in.jsx))

You could also use JavaScript in JSX. It takes angle brackets (`<`) as the beginning of HTML syntax, and curly brackets (`{`) as the beginning of the JavaScript syntax.

```JavaScript
var names = [ 'jinjing', 'woo', 'charleserious' ]

ReactDOM.render(
    <div>
    {
        names.map( function( name ) {

            return <div>Hello, {name}!</div>;

        } );
    }
    </div>,
    document.getElementById( 'example' )
);
```

## Use array in JSX ([source](https://github.com/charleserious/react-practices/tree/master/use.array.in.jsx))

If a JavaScript variable is an array, JSX will implicitly concat all members of the array.

```JavaScript
var tags = [
    <h1 key="0">Hello World!</h1>,
        <h2 key="1">React is awesome!</h2>
];

ReactDOM.render(
    <div>{tags}</div>,
    document.getElementById( 'example' )
);
```

## Define a component ([source](https://github.com/charleserious/react-practices/tree/master/define.a.component))

`React.createClass()` creates a component class, which implements a render method to return an component instance of the class. You don't need to call `new` on the class in order to get an instance, just use it as a normal HTML tag.

```JavaScript
var HelloMessage = React.createClass({
    render: function() {
        return <h1>Hello {this.props.name}</h1>;
    }
});

ReactDOM.render(
    <HelloMessage name="Charles" />,
    document.getElementById( 'example' )
);
```

Components would have attributes, and you can use `this.props.[attribute]` to access them, just like `this.props.name` of `<HelloMessage name="Charles">` is Charles.

Please remember the first letter of the component's name must be capitalized, otherwise React will throw an error. For instance, `HelloMessage` as a component's name is OK, but `helloMessage` is not allowed. And a React component should only have one top child node.

```JavaScript
// wrong 
var HelloMessge = React.createClass({
    render: function() {
        return <h1> Hello {this.props.name}</h1>
                <p>some text</p>
    }
});

var HelloMessage = React.createClass({
    render: function() {
        return <div>
            <h1>Hello {this.props.name}</h1>
            <p>some text</p>
        </div>
    }
});
```

## this.props.children ([source](https://github.com/charleserious/react-practices/tree/master/this.props.children))

React uses `this.props.children` to access a component's children nodes.

```JavaScript
let Notes = React.createClass({
    render: function() {
        return (
            <ol>
            {
                React.Children.map( this.props.children, function( child ) {
                    return <li>{child}</li>
                })
            }
            </ol>
        );
    }
});
ReactDOM.render(
    <Notes>
        <span>Hello</span>
        <span>World</span>
    </Notes>,
    document.getElementById( 'example' )
);
```

Please be mindful that the value of `this.props.children` has three posibilities. If the component has no children node, the value is `undefined`; If single children node, an object; If multiple children nodes, an array. You should be careful to handle it.

React gave us an utility [`React.Children`](https://facebook.github.io/react/docs/top-level-api.html#react.children) for dealing with the `this.props.children`'s opaque data structure. You could use `React.Children.map` to iterate `this.props.children` without worring its data type being `undefined` or `object`. Check [official document](https://facebook.github.io/react/docs/top-level-api.html#react.children) for more methods `React.Children` offers.

## PropTypes ([source](https://github.com/charleserious/react-practices/tree/master/proptypes))

Components have many specific attributes which are called "props" in React and can be of any type.

Sometimes you need a way to validate these props. You don't want users have the freedom to input anything into your components.

React has a solution for this and it's called PropTypes.

```JavaScript
let MyTitle = React.createClass({
    propTypes: {
        title: React.PropTypes.string.isRequired
    },

    render: function() {
        return <h1>{this.props.title}</h1>
    }
});
```

The above component of `MyTitle` has a props of `title`. PropTypes tells React that the title is required and its value should be a string.

Now we give `Title` a number value.

```JavaScript
let data = 1234;

ReactDOM.render(
    <MyTitle title={data} />,
    document.getElementById( 'example' )
);
```

It means the props dosent's pass the value validation, and the console will show you an error message.

```bash
Warring: Failed propType: Invalid prop `title` of type `number` supplied to `MyTitle`, expected `string`.
```

Visit [official doc](http://facebook.github.io/react/docs/reusable-components.html) for more PropTypes options.

P.S. If you want to give the props a default value, use `getDefaultProps()`.

```JavaScript
let MyTitle = React.createClass({
    getDefaultProps: function() {
        return {
            title: 'Hello World'
        }
    },

    render: function() {
        return <h1>{this.props.title}</h1>
    }
});

ReactDOM.render(
    <MyTitle />,
    document.getElementById( 'example' )
);
```

## Finding a DOM node ([source](https://github.com/charleserious/react-practices/tree/master/finding.a.dom.node))

Sometimes you need to reference a DOM node in component. React gives you the `ref` attribute to find it.

```JavaScript
let MyComponent = React.createClass({
    handleClick: function() {
        console.log( this.refs.myTextInput );
        this.refs.myTextInput.focus();
    },

    render: function() {
        return (
            <div>
                <input type="text" ref="myTextInput" />
                <input type="button" value="Focus the text input" onClick={this.handleClick} />
            </div>
        );
    }
});

ReactDOM.render(
    <MyComponent />,
    document.getElementById( 'example' )
);
```

The desired DOM node should have a `ref` attribute, and `this.refs.[refName]` would return the corresponding DOM node. Please be mindful that you could do that only after this component has been mounted into DOM, otherwise you get `null`.

## this.state ([source](https://github.com/charleserious/react-practices/tree/master/this.state))

React thinks of component as state machines, and uses `this.state` to hold component's state, `getInitialStat()` to initialize `this.state` (invokde before a component is mounted), `this.setState()` to update `this.state` and re-render the component.

```JavaScript
let LikeButton = React.createClass({
    getInitialState: function () {
        return { liked: false };
    },

    handleClick: function ( event ) {
        this.setState( { liked: !this.state.liked } );
    },

    render: function () {
        var text = this.state.liked ? 'like' : 'haven\'t liked';
        return (
            <p onClick={this.handleClick}>
                You {text} this. Click to toggle.    
            </p>
        );
    }
});
ReactDOM.render(
    <LikeButton />,
    document.getElementById( 'example' )
);
```

You could use component attributes to regist event handlers,m ,just like `onClick`, `onKeyDown`, `onCopy`, ect. Official Document has all [suppoerted events](http://facebook.github.io/react/docs/events.html#supported-events).

## Form ([source](https://github.com/charleserious/react-practices/tree/master/form))

According to React's design philosophy, `this.state` describes the state of component and is mutated via use interactions, and `this.props` describes the properties of component and is stable and immutable.

Since that, the `value` attribute of Form components, such as &lt;input&gt;, &lt;textarea&gt;, and &lt;option&gt;, is unaffedted by any user input. If you wanted to access or update the value in response to user input, you could use the onChange event.

```JavaScript
class Form extends React.Component {
    constructor( props ) {
        super( props );
        this.state = { value: 'Charles' };
    
        this.handleChange = this.handleChange.bind( this );
        this.handleSubmit = this.handleSubmit.bind( this );
    }
    
    handleChange( event ) {
        this.setState( { value: event.target.value } );
    }
    
    handleSubmit( event ) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
    }
    
    render() {
        let value = this.state.value;
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
                <br/>
                <p>{value}</p>
            </form>
        );
    }
}
    
ReactDOM.render(
    <Form />,
    document.getElementById('example')
);
```

More infomation on [official document](http://facebook.github.io/react/docs/forms.html).

## Component LifeCycle ([source](https://github.com/charleserious/react-practices/tree/master/component.lifecycle))

Components have three main parts of [their lifecycle](https://facebook.github.io/react/docs/working-with-the-browser.html#component-lifecycle): Mounting(being inserted into the DOM), Updating(being re-rendered) and Unmounting(being removed from the DOM). React Provides hooks into these lifecycle part. `will` methods are called right before something going happen, and `did` methods which are called right after something happened.

```JavaScript
class Hello extends React.Component {
    constructor( props ) {
        super( props );
        this.state = { opacity: 1.0 };
    }

    componentDidMount() {

        this.timer = setInterval( function (params) {
            var opacity = this.state.opacity;
            opacity -= 0.45;
            if( opacity < 0.1 ) {
                opacity = 1.0;
            }

            this.setState( { opacity: opacity } );
        }.bind( this ), 100 );
        
    }

    render() {
        return (
            <div style={{opacity: this.state.opacity}}>
                Hello {this.props.name}
            </div>
        );
    }
}

ReactDOM.render(
    <Hello name="Charles" />,
    document.getElementById( 'example' )
);
```

The following is [a whole list of lifecycle methods](http://facebook.github.io/react/docs/component-specs.html#lifecycle-methods).

- **componentWillMound()**: Fired once, before initial rendering occurs. Good place to wire-up message listeners. `this.setState` dosen't work here.
- **componentDidMound**: Fired once, after initial rendering occurs. Can use `this.getDOMNode()`.
- **componentWillUpdate(object nextProps, object nextState)**: Fired after the component's updates are made to the DOM. Can use `this.getDOMNode()` for udpates.
- **componentDidUpdated(object nextProps, object nextState)**: Invoked immediately after the component's udpates are flushed to the DOM. This method is not called for the initial render. Use this as an opportunity to operate on the DOM when the component has been updated.
- **componentWillUnmount()**: Fired immediately before a component is unmounted from the DOM. Good place to remove message listeners or generate clean up.
- **componentWillReceiveProps(object nextProps)**: Fired when a component is receiveing new props. You might want to `this.setState` depending on the props.
- **shouldComponentUpdate(object nextProps, object nextState)**: Fired before rendering when new props or state are received. `return false` if you know an udpate isn't needed.

## Ajax ([source](https://github.com/charleserious/react-practices/tree/master/ajax))

How to get the data of a component from a server or an API provider? The answer is using Ajax to fecth data in the event handler of `componentDidMount`. when the server response arrives, store the data with `this.setState()` to trigger a re-render of your UI

```JavaScript
class UserGist extends React.Component {
    constructor( props ) {
        super( props );
        this.state = { 
            username: '',
            lastGistUrl: ''
        };
    }

    componentDidMount() {

        $.get( this.props.source, function ( result ) {
            
            let lastGist = result[0];
            this.setState( {
                username: lastGist.owner.login,
                lastGistUrl: lastGist.html_url
            } );
        }.bind( this ) );
    }

    render() {
        return (
            <div>
                {this.state.username}'s last gis is <a href={this.state.lastGistUrl}>here</a>
            </div>
        );
    }
}

ReactDOM.render(
    <UserGist source="https://api.github.com/users/octocat/gists" />,
    document.getElementById( 'example' )
);
```

## Display value from a Promise ([source](https://github.com/charleserious/react-practices/tree/master/display.value.from.a.promise))

This demo is inspired by Nat Pryce's article ["Hight Order React Component"](http://natpryce.com/articles/000814.html).

If a React component's data is received asynchronously, we can use a Promise object as the component's property also, just as the follewing.

```JavaScript
ReactDOM.render(
    <Repositories promise={$.getJSON('https://api.github.com/search/repositories?q=javascript&sort=stars')} />,
    document.getElementById( 'example' )
);
```

The above code takes data from Github's API, and the `Repositories` component get a Promise object as its property.

Now, while the promise is pending, the component displays a loading indicator. When the promise is resolved successfully, the component displays a list of repository information. If the promise is rejected, the component displays an error message.

```JavaScript
class Repositories extends React.Component {
    constructor( props ) {
        super( props );

        this.state = {

            loading: true,
            error: null,
            data: null

        };
    }

    componentDidMount() {
        
        this.props.promise.then(
            value => this.setState( { loading: false, data: value } ),
            error => this.setState( { loading: false, error: error } )
        );
    }
    
    render() {
        if ( this.state.loading ) {
            return <span>loading...</span>;
        } else if ( this.state.error != null ) {
            return <span>Error: {this.state.error.message}</span>;
        } else {
            let repos = this.state.data.items;
            let reposList = repos.map(function ( repo ) {
                return (
                    <li key={repo.id}>
                        <a href={repo.html_url}>{repo.name}</a> ({repo.stargazers_count} stars) <br/> {repo.description}
                    </li>
                )
            })
            return (
                <main>
                    <h1>Most Popular JavaScript Projects in Github</h1>
                    <ol>
                        {reposList}
                    </ol>
                </main>
            );
        }
    }
}
```

## Server-side rendering ([source](https://github.com/charleserious/react-practices/tree/master/server.side.rendering))

This demo is copied from [github.com/mhart/react-server-example](https://github.com/mhart/react-server-example).

```bash
# install the dependencies in server.side.rendering directory
$ npm install

# launch http server
$ node server.js
```