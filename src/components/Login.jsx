import React from 'react'
import '../styles/App.css'
import logo from '../assets/logo.svg'
import spotifyApi from './spotifyApi'

const scopes = ['streaming', 'user-read-email', 'user-read-private', 'user-library-read', 'user-library-modify', 'user-read-playback-state', 'user-modify-playback-state', 'user-read-currently-playing', 'user-read-recently-played', 'playlist-read-private', 'playlist-read-collaborative', 'playlist-modify-public', 'playlist-modify-private', 'user-top-read', 'user-read-playback-position', 'user-read-recently-played', 'user-follow-read', 'user-follow-modify'];
const authUrl = spotifyApi.createAuthorizeURL(scopes)

const Login = () => {
    return(
        <div className='login'>
            <div className='main-page'>
                
                <img className='login-img' src={logo} alt="logo" />
                <p className='musify'>musify</p >
            </div>
            <a href={authUrl}>LOGIN WITH SPOTIFY</a>
        </div>
    )
}

export default Login