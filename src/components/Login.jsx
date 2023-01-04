import React from 'react'
import '../styles/App.css'
import logo from '../assets/logo.svg'


const AuthUrl = 'https://accounts.spotify.com/authorize?client_id=27b1cecea7ef4b93a30575c8f5c997d6&response_type=code&redirect_uri=http://localhost:5173&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20user-top-read'

const Login = () => {
    return(
        <div className='login'>
            <div className='main-page'>
                
                <img className='login-img' src={logo} alt="logo" />
                <p className='musify'>musify</p >
            </div>
            <a href={AuthUrl}>LOGIN WITH SPOTIFY</a>
        </div>
    )
}

export default Login