var http = require( 'http' );
var browserify = require( 'browserify' );
var literalify = require( 'literalify' );
var React = require( 'react' );
var ReactDOMServer = require( 'react-dom/server' );
var DOM = React.DOM;
var body = DOM.body;
var div = DOM.div;
var script = DOM.script;
var App = React.createFactory( require( './App' ) );

http.createServer( function( req, res ) {

    if ( req.url == '/' ) {

        res.setHeader( 'Content-Type', 'text/html; charset=utf-8' );

        var props = {
            items: [ 'Item 0', 'Item 1', 'Item </scRIpt>\u2028', 'Item <!--inject!-->\u2029' ]
        };

        var html = ReactDOMServer.renderToStaticMarkup( body( null, 
            div( { id: 'content', dangerouslySetInnerHTML: { __html: 
                ReactDOMServer.renderToString( App( props ) )
            }} ),

            script( { dangerouslySetInnerHTML: { __html: 'var APP_PROPS = ' + safeStringify( props ) + ';' }} ),

            script( { src: '//cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react.js' } ),
            script( { src: '//cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react-dom.js' } ),

            script( { src: 'bundle.js' } )
        ) );

        res.end( html );
    } else if ( req.url == '/bundle.js' ) {

        res.setHeader( 'Content-Type', 'text/javascript' );

        browserify()
            .add( './browser.js' )
            .transform( literalify.configure( {
                'react': 'window.React',
                'react-dom': 'window.ReactDOM'
            } ) )
            .bundle()
            .pipe( res );

    } else {

        res.statusCode = 404;
        res.end();
    }
} ).listen( 9020, function( err ) { 

    if ( err ) {
        throw err;
    }
    console.log( 'Listening on 9020...' );
} );

function safeStringify( obj ) {
    return JSON.stringify( obj )
        .replace(/<\/(script)/ig, '<\\/$1')
        .replace(/<!--/g, '<\\!--')
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');
}