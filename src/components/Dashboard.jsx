import axios from "axios";
import { useState, useEffect } from "react";
import spotifyApi from "./spotifyApi";
import useAuth from "./useAuth";
import TrackSearchResult from "./TrackSearchResult";
import Player from "./Player";
import TopSongs from "./TopSongs";

const Dashboard = ({ code }) => {
  var accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [topSongs, setTopSongs] = useState([]);
  const [showLyrics, setShowLyrics] = useState(false);
  const [playing, setPlaying] = useState();

  const chooseTrack = (track) => {
    setPlayingTrack(track);
    setSearch("");
    setLyrics("");
  };

  const playingState = (playing) => {
    setPlaying(playing);
  };

  useEffect(() => { // get lyrics
    if (!playingTrack) return;

    const getLyrics = async () => {
        try {
            const res = await axios.post("http://localhost:3001/lyrics", {
                track: playingTrack.title,
                artist: playingTrack.artist,
            });
            setLyrics(res.data.lyrics);
        } catch (err) {
            console.log(err);
        }
    };

    getLyrics();

  }, [playingTrack]);

  useEffect(() => { // set access token when it changes
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => { // search for songs
    if (!search) return setSearchResults([]);
    if (!accessToken) return;
    let cancel = false;

    const searchTracks = async () => {
        try {
            const res = await spotifyApi.searchTracks(search);
            if (cancel) return;
            setSearchResults(
                res.body.tracks.items.map((track) => {
                    const smallestAlbumImage = track.album.images.reduce(
                        (smallest, image) => {
                            if (image.height < smallest.height) return image;
                            return smallest;
                        },
                        track.album.images[0]
                    );

                    return {
                        artist: track.artists[0].name,
                        title: track.name,
                        uri: track.uri,
                        albumUrl: smallestAlbumImage.url,
                    };
                })
            );
        } catch (err) {
            console.log(err);
        }
    };

    searchTracks()
    
    return () => (cancel = true);
  }, [search, accessToken]);

  useEffect(() => { // get username
    if (!accessToken) return;
    
    const getDisplayName = async () => {
        try {
            // const res = await spotifyApi.getMe();
            const res = await axios.get("https://api.spotify.com/v1/me", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const profile = res.data;
            console.log(profile);
            setDisplayName(profile.display_name);
        } catch (err) {
            console.log(err);
        }
    };

    getDisplayName();
  }, [accessToken]);

  useEffect(() => { // get top songs
    if (!accessToken) return;

    const getTopSongs = async () => {
        try {
            const res = await spotifyApi.getMyTopTracks();
            setTopSongs(
                res.body.items.map((track) => {
                    const smallestAlbumImage = track.album.images.reduce(
                        (smallest, image) => {
                            if (image.height < smallest.height) return image;
                            return smallest;
                        },
                        track.album.images[0]
                    );

                    return {
                        artist: track.artists[0].name,
                        title: track.name,
                        uri: track.uri,
                        albumUrl: smallestAlbumImage?.url,
                    };
                })
            );
        } catch (err) {
            console.log(err);
        }
    };

    getTopSongs();
  }, [accessToken]);

  return (
    <>
      { accessToken ?
        <div className="container">
          {displayName === "" ? (
            <p className="user-greeting">Getting user details...</p>
          ) : (
            <p className="user-greeting">Welcome {displayName || "User"}</p>
          )}
          <input
            className="search-bar"
            type="search"
            placeholder="Search Song/Artist"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {searchResults.length != 0 && (
            <div className="search-results">
              {searchResults.map((track) => (
                <TrackSearchResult
                  track={track}
                  key={track.uri}
                  chooseTrack={chooseTrack}
                />
              ))}
            </div>
          )}

          {!showLyrics && searchResults.length === 0 && (
            <div className="top-song-container">
              {topSongs.length != 0 &&
                topSongs.map((track) => (
                  <TopSongs
                    track={track}
                    key={track.uri}
                    chooseTrack={chooseTrack}
                  />
                ))}
            </div>
          )}

          {playingTrack && (
            <div className="player">
              {searchResults.length === 0 && playing && playingTrack && (
                <button
                  className="lyrics-btn"
                  onClick={() => setShowLyrics(!showLyrics)}
                >
                  Show/ Hide Lyrics
                </button>
              )}
              <div>
                <Player
                  accessToken={accessToken}
                  trackUri={playingTrack?.uri}
                  playingState={playingState}
                />
              </div>
            </div>
          )}

          {searchResults.length === 0 && showLyrics && (
            <div className="lyrics" style={{ whiteSpace: "pre" }}>
              {lyrics}
            </div>
          )}
        </div> : <p className="user-greeting">Please login to continue!</p>
      }
    </>
  );
};

export default Dashboard;
