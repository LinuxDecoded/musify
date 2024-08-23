import SpotifyWebApi from "spotify-web-api-node";
import  SpotifyWebApiServer from 'spotify-web-api-node/src/server-methods';

SpotifyWebApi._addMethods = function(fncs) {
  Object.assign(this.prototype, fncs);
};
SpotifyWebApi._addMethods(SpotifyWebApiServer);

const spotifyApi = new SpotifyWebApi({
    clientId: import.meta.env.VITE_CLIENT_ID,
    redirectUri: import.meta.env.VITE_REDIRECT_URI,
});

console.log('vite client id is: ', VITE_CLIENT_ID);

export default spotifyApi;