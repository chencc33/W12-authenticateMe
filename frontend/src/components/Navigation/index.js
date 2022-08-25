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
        <div className='nav-bar'>
            <div className='logo-container'>
                <i class="fa-brands fa-airbnb"></i>
                <div className='logo-font'>airbnb</div>
            </div>
            <div className='hostButton' onClick={() => (history.push('/spots/create'))}>Become a Host</div>
            <div class='dropdown-container' tabIndex={1}>
                <div className='dropdown-button'>
                    <i class="fa-solid fa-bars"></i>
                    <i class="fa-solid fa-circle-user"></i>
                </div>
                <div className='dropdown-content'>
                    <div>
                        <NavLink exact to="/">Home</NavLink>
                    </div>
                    <div>
                        {isLoaded && sessionLinks}
                    </div>
                    <div>
                        <DemoUserLogin />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navigation;
