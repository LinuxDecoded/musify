import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"
import '../styles/App.css'

const Player = ({ accessToken, trackUri, playingState }) => {
  const [play, setPlay] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  
  useEffect(() => setPlay(true), [trackUri])
  useEffect(()=>playingState(isPlaying), [isPlaying])
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
          sliderColor: '#46b071',
          trackArtistColor: '#ccc',
          trackNameColor: '#fff',
          
        }}
        play={play}
        uris={trackUri ? [trackUri] : []}
        autoPlay={true}
    />
    </>
  )
  
}

export default Player