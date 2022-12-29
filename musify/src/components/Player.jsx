import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"
import '../styles/App.css'

const Player = ({ accessToken, trackUri, playingState }) => {
  const [play, setPlay] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  playingState(isPlaying)
  useEffect(() => setPlay(true), [trackUri])
  if (!accessToken) return null
  return (
    <>
    {(trackUri && isPlaying===false) && <p>Playing...</p>}
    <SpotifyPlayer 
        token={accessToken}
        showSaveIcon
        callback={state => {
          if (!state.isPlaying){
            setPlay(false)
          } else
            setIsPlaying(true)
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
    </>
  )
  
}

export default Player