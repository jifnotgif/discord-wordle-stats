import React from 'react';

type Props = {
    displayText: string;
};

class LoginButton extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    handleLoginClick = () => {
        return;
    }

    render() {
        return (
            <button className="login-button" onClick={this.handleLoginClick}>
                {this.props.displayText}
            </button>
        );
    }
};

export default LoginButton;