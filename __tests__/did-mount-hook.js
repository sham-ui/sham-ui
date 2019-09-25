import { Component, options, configureOptions } from '../src/index';
import { renderComponent } from './helpers';

it( 'didMount', () => {
    expect.assertions( 2 );
    class Dummy extends Component {
        @options name = 'default';

        didMount() {
            expect( this.container ).toBeInstanceOf( Element );
            expect( this.options.name ).toBe( 'default' );
        }
    }
    renderComponent( Dummy );
} );

it( 'didMount without decorator', () => {
    expect.assertions( 2 );
    class Dummy extends Component {
        configureOptions() {
            super.configureOptions( ...arguments );
            configureOptions( Dummy.prototype, this, {
                name: 'default'
            } );
        }

        didMount() {
            expect( this.container ).toBeInstanceOf( Element );
            expect( this.options.name ).toBe( 'default' );
        }
    }
    renderComponent( Dummy );
} );

it( 'didMount call after resolve options', () => {
    expect.assertions( 2 );
    class Dummy extends Component {
        @options name = 'default';

        didMount() {
            expect( this.container ).toBeInstanceOf( Element );
            expect( this.options.name ).toBe( 'overriden' );
        }
    }
    renderComponent( Dummy, {
        name: 'overriden'
    } );
} );

it( 'didMount call after resolve options without decorator', () => {
    expect.assertions( 2 );
    class Dummy extends Component {
        configureOptions() {
            super.configureOptions( ...arguments );
            configureOptions( Dummy.prototype, this, {
                name: 'default'
            } );
        }

        didMount() {
            expect( this.container ).toBeInstanceOf( Element );
            expect( this.options.name ).toBe( 'overriden' );
        }
    }
    renderComponent( Dummy, {
        name: 'overriden'
    } );
} );
