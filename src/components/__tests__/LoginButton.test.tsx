import LoginButton from '@components/LoginButton';
import { shallow } from 'enzyme';
import { TextEncoder } from 'util';
import * as urlUtils from '@utils/urlUtils';

global.TextEncoder = TextEncoder;

const localStorageMock = jest.fn(() => 
    ({
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
    })
)();
  
Object.defineProperty(window, 'sessionStorage', {
    value: localStorageMock
});

Object.defineProperty(global, 'crypto', {
    value: {
        subtle: {
            digest: jest.fn()
        }
    }
});

const mockConstructAuthUrl = jest.spyOn(urlUtils, 'constructAuthUrl');

describe('Login button tests', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV };
    });

    afterAll(() => {
        process.env = OLD_ENV;
    });

    test('renders button with text', () => {
        const button = shallow(<LoginButton displayText='test' />);
        button.setState({ 
            url: {
                href: 'link'
            }
        });
        const instance = button.instance();
        expect(button.text().includes('test')).toBe(true);
        expect(instance.state).toEqual({
            error: null,
            url: {
                href: 'link'
            }
        });
        expect(instance.render()).toEqual(<a className="login-button" href="link">test</a>);
    });
    
    test('renders error message', () => {
        const button = shallow(<LoginButton displayText='test' />);
        button.setState({ 
            error: {
                message: 'operation failed'
            }
        });
        const instance = button.instance();
        expect(button.text().includes('test')).toBe(false);
        expect(instance.state).toEqual({
            error: {
                message: 'operation failed'
            }
        });
        expect(instance.render()).toEqual(<h1>Caught an error</h1>);
    });

    test('componentDidMount', async () => {
        expect.assertions(3);
        const button = shallow(<LoginButton displayText='test' />);
        const instance = button.instance();
        await instance.componentDidMount!();
        expect(localStorageMock.setItem).toBeCalled();
        expect(mockConstructAuthUrl).toBeCalled();
        expect(instance.state).toEqual(
            {
                url: undefined,
                error: null
            }
        )
    });

    test('generateStateHash throws error', async () => {
        expect.assertions(1);
        process.env.REACT_APP_SECRET_PASSPHRASE = undefined;
        
        const button = shallow(<LoginButton displayText='test' />);
        const instance = button.instance();
        await instance.componentDidMount!();
        expect(instance.state).toEqual(
            {
                url: undefined,
                error: new Error('Failed to fetch passphrase')
            }
        );
    });
});