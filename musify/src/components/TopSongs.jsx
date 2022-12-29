import '../styles/App.css'

const TopSongs = ({track, chooseTrack}) => {
    const handlePlay = () => {
        chooseTrack(track)
      }
    return (
        <div className='top-song-card' style={{ cursor: "pointer" }} onClick={handlePlay}>
          <img src={track.albumUrl}/>
          <div>
            <div className="track-title">{track.title}</div>
            <div className="track-title">{track.artist}</div>
          </div>
        </div>
      )
}

export default TopSongs