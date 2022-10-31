import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import './Navigation.css'
import { useHistory } from 'react-router-dom'

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const history = useHistory()
    const [showMenu, setShowMenu] = useState(false);

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = () => {
            setShowMenu(false);
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        history.push('/')
    };

    return (
        <>
            <div className="profile-dropdown">
                <div className='user-dropdown'>
                    <i className="fa-solid fa-user"></i>
                    {user.username}
                </div >

                <div className='user-dropdown'>
                    <i className="fa-solid fa-envelope"></i>
                    {user.email}
                </div>

                <div className='user-dropdown'>
                    <i class="fa-solid fa-right-from-bracket"></i>
                    <div className='dropdown-logout' onClick={logout}>Log Out</div>
                </div>
            </div>


        </>
    );
}

export default ProfileButton;
