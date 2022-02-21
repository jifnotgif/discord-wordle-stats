import React from 'react';
import './App.css';
import LoginButton from './components/LoginButton';

const LOGIN_BUTTON_TEXT: string = 'Login with Discord';

const App = () => {
    return (
        <div className="App">
            <header className="App-header">
                <LoginButton displayText={LOGIN_BUTTON_TEXT} />
            </header>
        </div>
    );
}

export default App;
