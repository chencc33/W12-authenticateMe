import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import './DemoUser.css'

function DemoUserLogin() {
    const dispatch = useDispatch()

    return (
        <div className='button' onClick={() => { dispatch(sessionActions.login({ credential: 'user1@user.io', password: 'password2' })) }}>Demo User Login</div>
    )
}

export default DemoUserLogin
