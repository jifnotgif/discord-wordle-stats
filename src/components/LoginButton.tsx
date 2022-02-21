import React from 'react';
import { STATE_PARAM_KEY } from '@/constants';
import { constructAuthUrl } from '@utils/urlUtils';

type LoginButtonProps = {
    displayText: string;
};

type LoginButtonState = {
    url?: URL,
    error: Error | null
};

const generateStateHash = async (): Promise<string> => {
    const passphrase: string | undefined = process.env.REACT_APP_SECRET_PASSPHRASE;
    if (!passphrase) {
        throw new Error('Failed to fetch passphrase');
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(passphrase);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
};

class LoginButton extends React.Component<LoginButtonProps, LoginButtonState> {
    constructor(props: LoginButtonProps) {
        super(props);
        this.state = {
            url: undefined,
            error: null
        };
    }

    componentDidMount = async () => {
        try {
            const stateHash: string | undefined = await generateStateHash();
            sessionStorage.setItem(STATE_PARAM_KEY, stateHash);
            const url: URL | undefined = constructAuthUrl(stateHash);
            this.setState({
                url,
                error: null 
            });
        } catch (error: any) {
            this.setState({
                url: undefined,
                error 
            });
        }
    }

    render = () => {
        if (this.state.error) { 
            return <h1>Caught an error</h1>
        }
        return (
            <a className="login-button" href={this.state.url?.href}>
                {this.props.displayText}
            </a>
        );
    }
};

export default LoginButton;