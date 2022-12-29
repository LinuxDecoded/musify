import axios from "axios"
import { useState, useEffect } from "react"
import SpotifyWebApi from "spotify-web-api-node"
import useAuth from "./useAuth"
import TrackSearchResult from "./TrackSearchResult"
import Player from "./Player"


const spotifyApi = new SpotifyWebApi({
    clientId: "27b1cecea7ef4b93a30575c8f5c997d6",
  })

const Dashboard = ({code}) => {
    const accessToken = useAuth(code)
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [playingTrack, setPlayingTrack] = useState()
    const [lyrics, setLyrics] = useState("")

    const chooseTrack = (track)=> {
        setPlayingTrack(track)
        setSearch("")
        setLyrics("")
    }

    useEffect(() => {
        if(!playingTrack) return
    
        axios
            .get("http://localhost:3001/lyrics", {
            params: {
                track: playingTrack.title,
                artist: playingTrack.artist,
            },
            })
            .then(res => {
                setLyrics(res.data.lyrics)
          })
    }, [playingTrack])
    
    useEffect(() => {
        if(!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    useEffect(() => {
        if (!search) return setSearchResults([])
        if (!accessToken) return
    
        let cancel = false
        spotifyApi.searchTracks(search).then(res => {
            if (cancel) return
            setSearchResults(
                res.body.tracks.items.map(track => {
                const smallestAlbumImage = track.album.images.reduce(
                    (smallest, image) => {
                        if (image.height < smallest.height) return image
                        return smallest
                    },
                track.album.images[0]
                )
    
                return {
                    artist: track.artists[0].name,
                    title: track.name,
                    uri: track.uri,
                    albumUrl: smallestAlbumImage.url,
                }
                })
            )
        })
    
        return () => (cancel = true)
      }, [search, accessToken])


    return(
        <div className="container" >
            <input type="search" placeholder="Search Song/Artist" value={search} onChange={e => setSearch(e.target.value)} />
            
            <div>
                {searchResults.map(track => (
                    <TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack}/>
                ))}
                {searchResults.length === 0 && (
                    <div style={{ whiteSpace: "pre" }}>
                        {lyrics}
                    </div>
                )}
            </div>
            
        
            <div>
                <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
            </div>
        </div >
    )
}

export default Dashboard