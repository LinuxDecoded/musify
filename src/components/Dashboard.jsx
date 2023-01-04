import axios from "axios"
import { useState, useEffect } from "react"
import SpotifyWebApi from "spotify-web-api-node"
import useAuth from "./useAuth"
import TrackSearchResult from "./TrackSearchResult"
import Player from "./Player"
import TopSongs from "./TopSongs"


const spotifyApi = new SpotifyWebApi({
    clientId: "27b1cecea7ef4b93a30575c8f5c997d6",
  })

const Dashboard = ({code}) => {
    const accessToken = useAuth(code)
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [playingTrack, setPlayingTrack] = useState()
    const [lyrics, setLyrics] = useState("")
    const [displayName, setDisplayName] = useState('')
    const [topSongs, setTopSongs] = useState([])
    const [showLyrics, setShowLyrics] = useState(false)
    const [playing, setPlaying] = useState()

    const chooseTrack = (track)=> {
        setPlayingTrack(track)
        setSearch("")
        setLyrics("")
    }

    const playingState = (playing)=>{
        setPlaying(playing)
    }

    useEffect(() => {
        if(!playingTrack) return
    
        axios
            .get("https://139.59.12.138/lyrics", {
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

      useEffect(()=>{
        spotifyApi.getMe()
            .then((data)=>{
                setDisplayName(data.body.display_name)
            })
            .catch((err)=>{
                console.log("Problem in fetching user details!", err)
            })
      },[accessToken])

      useEffect(()=>{
        if(!accessToken) return
        spotifyApi.getMyTopTracks()
            .then((data)=>{
                setTopSongs(
                    data.body.items.map(track => {
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
            .catch((err)=>{
                console.log("Can't fetch top songs!", err)
            })
      },[accessToken])

    return(
        <div className="container">
            {displayName==='' ? <p className="user-greeting">Getting user details...</p> : <p className="user-greeting">Welcome {displayName}</p>}
            <input className="search-bar" type="search" placeholder="Search Song/Artist" value={search} onChange={e => setSearch(e.target.value)} />
            
            {searchResults.length != 0 && (<div className="search-results">
                {searchResults.map(track => (
                    <TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack}/>
                ))}
            </div>)}

            {(!showLyrics && searchResults.length === 0) && (<div className="top-song-container">
                {topSongs.length!=0 && topSongs.map(track=>(
                    <TopSongs track={track} key={track.uri} chooseTrack={chooseTrack}/>
                ))}
            </div>)}
            
            
            {playingTrack && 
                (
                    <div className="player">
                    {(searchResults.length === 0 && playing && playingTrack) && (<button className="lyrics-btn" onClick={()=>setShowLyrics(!showLyrics)}>Show/ Hide Lyrics</button>)}
                    <div>
                        <Player accessToken={accessToken} trackUri={playingTrack?.uri} playingState={playingState}/>
                    </div>
                    </div>
                )
            }

            {(searchResults.length === 0 && showLyrics) && (
                <div className="lyrics" style={{ whiteSpace: "pre" }}>
                    {lyrics}
                </div>
            )}
        </div >
    )
}

export default Dashboard