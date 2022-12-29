import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"
import '../styles/App.css'

const Player = ({ accessToken, trackUri }) => {
  const [play, setPlay] = useState(false)

  useEffect(() => setPlay(true), [trackUri])
  
  if (!accessToken) return null
  return (
    <SpotifyPlayer 
        token={accessToken}
        showSaveIcon
        callback={state => {
          if (!state.isPlaying) setPlay(false)
        }}
        styles={{
          activeColor: '#fff',
          bgColor: '#333',
          color: '#fff',
          loaderColor: '#fff',
          sliderColor: '#1cb954',
          trackArtistColor: '#ccc',
          trackNameColor: '#fff',
          
        }}
        play={play}
        uris={trackUri ? [trackUri] : []}
    />
  )
  
}

export default Player