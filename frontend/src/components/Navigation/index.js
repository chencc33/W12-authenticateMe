import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import './Navigation.css';
import CreateSpotForm from '../Spot/CreateSpotForm';
import DemoUserLogin from '../DemoUserForm/DemoUserForm';

function Navigation({ isLoaded }) {
    const history = useHistory()
    const sessionUser = useSelector(state => state.session.user);

    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <ProfileButton user={sessionUser} />
        );
    } else {
        sessionLinks = (
            <>
                <LoginFormModal />
                <NavLink to="/signup">Sign Up</NavLink>
            </>
        );
    }

    return (
        <>
            <div className='logo-container'>
                <div className='logo-font'>airbnb</div>
            </div>
            <div class='dropdown'></div>
            <ul>
                <li>
                    <NavLink exact to="/">Home</NavLink>
                    {isLoaded && sessionLinks}
                    <div className='hostButton' onClick={() => (history.push('/spots/create'))}>Become a Host</div>
                    <DemoUserLogin />
                </li>
            </ul>
        </>
    );
}

export default Navigation;
