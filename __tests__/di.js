import { DI, Component, FsmStates, Fsm, inject } from '../src/shamUI';
import { renderApp } from './helpers';

afterEach( () => {
    DI.bind( 'service', undefined );
} );

function makeBinding( onRender ) {
    return function() {
        class Label extends Component {
            render() {
                if ( undefined !== onRender ) {
                    onRender();
                }
                this.container.innerHTML = 'label text';
            }
        }
        new Label( {
            ID: 'simple-label-component-text',
            container: document.querySelector( 'body' )
        } );
    };
}

it( 'component-binder', async() => {
    expect.assertions( 2 );
    const render = jest.fn();
    DI.bind( 'component-binder', makeBinding( render ) );
    await renderApp();
    expect( document.querySelector( 'body' ).innerHTML ).toBe( 'label text' );
    expect( render ).toHaveBeenCalledTimes( 1 );
} );


it( 'state:ready', async() => {
    expect.assertions( 1 );
    const onEnterMock = jest.fn();
    DI.bind( 'state:ready', class extends FsmStates.ready {
        _onEnter() {
            super._onEnter( ...arguments );
            onEnterMock();
        }
    } );
    DI.bind( 'component-binder', makeBinding() );
    await renderApp();
    expect( onEnterMock ).toHaveBeenCalledTimes( 2 );
} );

it( 'state:registration', async() => {
    expect.assertions( 1 );
    DI.bind( 'component-binder', makeBinding() );
    DI.bind( 'state:registration', class extends FsmStates.registration {
        register( component ) {
            expect( component.ID ).toBe( 'simple-label-component-text' );
            super.register( ...arguments );
        }
    } );
    await renderApp();
} );

it( 'state:rendering', async() => {
    expect.assertions( 1 );
    DI.bind( 'component-binder', makeBinding() );
    DI.bind( 'state:rendering', class extends FsmStates.rendering {
        renderComponent( component ) {
            expect( component.ID ).toBe( 'simple-label-component-text' );
            super.renderComponent( ...arguments );
        }
    } );
    await renderApp();
} );

it( 'fsm', async() => {
    expect.assertions( 1 );
    DI.bind( 'component-binder', makeBinding() );
    const mock = jest.fn();
    class ExtendedFSM extends Fsm {
        ALL() {
            mock();
            super.ALL( ...arguments );
        }
    }
    DI.bind( 'fsm', ExtendedFSM );
    await renderApp();
    expect( mock ).toHaveBeenCalledTimes( 1 );
} );

it( 'logger', async() => {
    expect.assertions( 1 );
    DI.bind(
        'component-binder',
        makeBinding( () => DI.resolve( 'logger' ).log( 'Logged message' ) )
    );
    DI.bind( 'logger', {
        log( message ) {
            expect( message ).toBe( 'Logged message' );
        }
    } );
    await renderApp();
} );

it( 'inject', async() => {
    expect.assertions( 3 );
    const fakeService = {
        process: jest.fn()
    };
    DI.bind( 'service', fakeService );

    class ServiceConsumer {
        @inject service = 'service';
        constructor() {
            this.service.process( 'from constructor' );
        }

        method() {
            this.service.process( 'from method' );
        }
    }
    new ServiceConsumer().method();
    expect( fakeService.process ).toHaveBeenCalledTimes( 2 );
    expect( fakeService.process.mock.calls[ 0 ] ).toEqual( [ 'from constructor' ] );
    expect( fakeService.process.mock.calls[ 1 ] ).toEqual( [ 'from method' ] );
} );

it( 'new inject syntax (without arg)', async() => {
    expect.assertions( 3 );
    const fakeService = {
        process: jest.fn()
    };
    DI.bind( 'service', fakeService );

    class ServiceConsumer {
        @inject service;
        constructor() {
            this.service.process( 'from constructor' );
        }

        method() {
            this.service.process( 'from method' );
        }
    }
    new ServiceConsumer().method();
    expect( fakeService.process ).toHaveBeenCalledTimes( 2 );
    expect( fakeService.process.mock.calls[ 0 ] ).toEqual( [ 'from constructor' ] );
    expect( fakeService.process.mock.calls[ 1 ] ).toEqual( [ 'from method' ] );
} );

it( 'new inject syntax (with arg)', async() => {
    expect.assertions( 3 );
    const fakeService = {
        process: jest.fn()
    };
    DI.bind( 'service', fakeService );

    class ServiceConsumer {
        @inject( 'service' ) service;
        constructor() {
            this.service.process( 'from constructor' );
        }

        method() {
            this.service.process( 'from method' );
        }
    }
    new ServiceConsumer().method();
    expect( fakeService.process ).toHaveBeenCalledTimes( 2 );
    expect( fakeService.process.mock.calls[ 0 ] ).toEqual( [ 'from constructor' ] );
    expect( fakeService.process.mock.calls[ 1 ] ).toEqual( [ 'from method' ] );
} );

it( 'inject as getter', async() => {
    expect.assertions( 2 );
    const fakeService = {
        process: jest.fn()
    };
    class ServiceConsumer {
        @inject service;

        constructor() {
            expect( this.service ).toBe( undefined );
        }

        method() {
            this.service.process();
        }
    }
    const concusmer = new ServiceConsumer();
    DI.bind( 'service', fakeService );
    concusmer.method();
    expect( fakeService.process ).toHaveBeenCalledTimes( 1 );
} );

it( 'container hasn\t item', () => {
    expect( DI.resolve( 'foo' ) ).toBeUndefined();
} );
