import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import LoginForm from './LoginForm';

function LoginFormModal() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className='drowpdown login-button' onClick={() => setShowModal(true)}>Log In</div>
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <LoginForm />
                </Modal>
            )}
            <hr></hr>
        </>
    );
}

export default LoginFormModal;
