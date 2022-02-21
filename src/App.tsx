import React from 'react';
import './App.css';
import LoginButton from '@components/LoginButton';
import UserStatTable from '@components/UserStatTable';
import { createHashMap, validateUrlHash } from '@utils/urlUtils';

const LOGIN_BUTTON_TEXT: string = 'Login with Discord';

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
