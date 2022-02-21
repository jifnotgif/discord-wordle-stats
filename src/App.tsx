import React from 'react';
import './App.css';
import LoginButton from '@components/LoginButton';
import UserStatTable from '@components/UserStatTable';
import CONSTANTS from '@/constants';

const LOGIN_BUTTON_TEXT: string = 'Login with Discord';

const createHashMap = (hash: string): Record<string, string> | null => {
    if (!hash) {
        return null;
    }
    // remove leading # character
    const hashParameters: string = hash.substring(1);
    return hashParameters.split("&")
            .map(value => value.split("="))
            .reduce( 
                (previousMap, [key, value]) => (
                    { ...previousMap,
                        [key]: value
                    }
                ), {});
}

const validateUrlHash = (hashMap: Record<string, string>): boolean => {
    return !!(
        hashMap.access_token?.length > 0 &&
        hashMap.state === sessionStorage.getItem(CONSTANTS.STATE_PARAM_KEY) &&
        hashMap.scope === CONSTANTS.OAUTH2_SCOPE
    );
};

class App extends React.Component {
    render = () => {
        const hashMap: Record<string, string> | null = createHashMap(window.location.hash);
        return (
            <div className="App">
                <header className="App-header">
                    {
                        hashMap && validateUrlHash(hashMap) ?
                            <UserStatTable accessToken={hashMap.access_token} /> :
                            <LoginButton displayText={LOGIN_BUTTON_TEXT} />
                    }
                </header>
            </div>
        );
    };
}
export default App;
