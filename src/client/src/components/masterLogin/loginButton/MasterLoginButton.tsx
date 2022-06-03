import React, {useRef} from 'react';

const MasterLoginButton = () => {


    function handleLogin(){

    }

    return (
        <button onClick={handleLogin} className='master_login_button'>
            <p>Войти</p>
        </button>
    );
};

export default MasterLoginButton;