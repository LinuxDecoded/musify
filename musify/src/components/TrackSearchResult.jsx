const TrackSearchResult = ({ track, chooseTrack }) => {
    function handlePlay() {
      chooseTrack(track)
    }
  
    return (
      <div style={{ cursor: "pointer" }} onClick={handlePlay}>
        <img src={track.albumUrl} style={{ height: "64px", width: "64px" }} />
        <div>
          <div className="track-title">{track.title}</div>
          <div className="track-title">{track.artist}</div>
        </div>
      </div>
    )
}

export default TrackSearchResult