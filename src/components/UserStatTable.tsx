import React from 'react';

type UserStatTableProps = {
    accessToken: string;
};

class UserStatTable extends React.Component<UserStatTableProps> {
    constructor(props: UserStatTableProps) {
        super(props);
    }

    render = () => {
        return (<h1>Welcome to the app</h1>);
    };
}

export default UserStatTable;