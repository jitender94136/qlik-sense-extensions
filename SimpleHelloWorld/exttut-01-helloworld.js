define( [
        'jquery'
    ],
    function ( $ ) {
        'use strict';

        return {

            //Paint resp.Rendering logic
            paint: function ( $element, layout ) {

				$element.empty();
				var $helloWorld = $( document.createElement( 'div' ) );
                $helloWorld.html( 'Hello World from the extension "SimpleHelloWorld"<br/>' );
                $element.append( $helloWorld );

            }
        };
    } );