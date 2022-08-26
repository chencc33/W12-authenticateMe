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
                <NavLink to="/signup" className='dropdown-signup'>Sign Up</NavLink>
                <hr></hr>
            </>
        );
    }

    return (
        <>
            <div className='nav-bar'>
                <div className='logo-container'>
                    <i className="fa-brands fa-airbnb"></i>
                    <div className='logo-font'>Sweet Home</div>
                </div>
                <div className='nav-bar-right'>
                    <div >
                        <NavLink exact to="/"><i className="fa-solid fa-house"></i></NavLink>
                    </div>
                    <div className='hostButton' onClick={() => {
                        if (!sessionUser) window.alert(`Please login or signup first`)
                        if (sessionUser) history.push(`/create/spots`)
                    }}>Become a Host</div>
                    <div className='dropdown-container'>
                        <div className='dropdown-button'>
                            <i className="fa-solid fa-bars"></i>
                            <i className="fa-solid fa-circle-user"></i>
                        </div>
                        <div className='dropdown-content'>
                            <div >
                                {isLoaded && sessionLinks}
                            </div>
                            <div classNam='dropdown-myspot'>
                                {sessionUser && (
                                    <>
                                        <NavLink to='/current/spots'>My Spot</NavLink>
                                        <hr></hr>
                                    </>
                                )}
                            </div>
                            <div className='dropdown-myreviews'>
                                {sessionUser && (
                                    <>
                                        <NavLink to='/reviews/current'>My Reviews</NavLink>
                                        <hr></hr>
                                    </>
                                )}
                            </div>
                            <div>
                                <DemoUserLogin />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr></hr>
        </>
    );
}

export default Navigation;
