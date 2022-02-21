import React from 'react';
import CONSTANTS from '../constants';

type LoginButtonProps = {
    displayText: string;
};

type LoginButtonState = {
    url?: URL,
    error: Error | null
};

// Implicit grant URL (documentation: https://discord.com/developers/docs/topics/oauth2#implicit-grant)
const DISCORD_AUTH_BASE_URL: string = 'https://discord.com/api/oauth2/authorize'

const RESPONSE_TYPE_PARAM_KEY: string = 'response_type';
const CLIENT_ID_PARAM_KEY: string = 'client_id';
const SCOPE_PARAM_KEY: string = 'scope';

const OAUTH2_RESPONSE_TYPE: string = 'token';
 
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

const constructAuthUrl = (stateHash?: string): URL => {
    if (!process.env.REACT_APP_DISCORD_CLIENT_ID) {
        throw new Error('Failed to fetch client ID');
    }
    const url = new URL(DISCORD_AUTH_BASE_URL);
    url.searchParams.append(RESPONSE_TYPE_PARAM_KEY, OAUTH2_RESPONSE_TYPE);
    url.searchParams.append(CLIENT_ID_PARAM_KEY, process.env.REACT_APP_DISCORD_CLIENT_ID);
    url.searchParams.append(SCOPE_PARAM_KEY, CONSTANTS.OAUTH2_SCOPE);
    if (stateHash) {
        url.searchParams.append(CONSTANTS.STATE_PARAM_KEY, stateHash);
    }
    return url;
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
            sessionStorage.setItem(CONSTANTS.STATE_PARAM_KEY, stateHash);
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