import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';
import { TrackFeature } from '../data/track-feature';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://localhost:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    //TODO: use the injected http Service to make a get request to the Express endpoint and return the response.
    //the http service works similarly to fetch(). It may be useful to call .toPromise() on any responses.
    //update the return to instead return a Promise with the data from the Express server
    //Note: toPromise() is a deprecated function that will be removed in the future.
    //It's possible to do the assignment using lastValueFrom, but we recommend using toPromise() for now as we haven't
    //yet talked about Observables. https://indepth.dev/posts/1287/rxjs-heads-up-topromise-is-being-deprecated
    return firstValueFrom(this.http.get(this.expressBaseUrl + endpoint)).then((response) => {
      return response;
    }, (err) => {
      return err;
    });

  }

  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]> {
    //TODO: identify the search endpoint in the express webserver (routes/index.js) and send the request to express.
    //Make sure you're encoding the resource with encodeURIComponent().
    resource = encodeURIComponent(resource);
    //Depending on the category (artist, track, album), return an array of that type of data.
    //JavaScript's "map" function might be useful for this, but there are other ways of building the array.
    return this.sendRequestToExpress('/search/'+ category +'/'+resource).then((data) => {
      
      if(category === "artist"){
        // console.log(data);
        // console.log("-----");
        // console.log(data.artists.items);
        // let ans = ArtistData;
        // for(let key in data.artists.items){
        // }
        let ans = data.artists.items.map(item => {
          const track = new ArtistData(
            item
          );
          return track;
        });
        // console.log("--------");
        console.log(ans);
        return ans;
      }else if(category === "track"){
        // console.log(data);
        // console.log(data.tracks.items);
        console.log(data.tracks.items.map(item =>{
          return new TrackData(item);
        }));
        return data.tracks.items.map(item =>{
          return new TrackData(item);
        });
      }else{
        // console.log(data);
        // console.log(data.albums);
        // console.log(data.albums.items);
        console.log(data.albums.items.map(item =>{
          return new AlbumData(item);
        }));
        return data.albums.items.map(item =>{
          return new AlbumData(item);
        })
      }
    });
    
  }

  getArtist(artistId:string):Promise<ArtistData> {
    //TODO: use the artist endpoint to make a request to express.
    //Again, you may need to encode the artistId.
    artistId = encodeURIComponent(artistId);
    // console.log("artistID " + artistId);
    console.log("getArtist----over")
    return this.sendRequestToExpress("/artist/" + artistId).then((data)=>{
      return new ArtistData(data);
    });
    // return null as any;
  }

  getRelatedArtists(artistId:string):Promise<ArtistData[]> {
    //TODO: use the related artist endpoint to make a request to express and return an array of artist data.
    artistId = encodeURIComponent(artistId);
    console.log("getRelatedArtists----over");
    return this.sendRequestToExpress('/artist-related-artists/'+artistId).then((data)=>{
      //console.log(data.artists);
      let log = data.artists.map((items) => {
        return new ArtistData(items);
      })
      //console.log(log);
      return log;
    });

    // //console.log(relateArtistData);
    // let log =[];
    // relateArtistData.then((data)=>{
    //   //console.log("getRelatedArtists______")
    //   //console.log(data);
    //   log = data.artists.map(items =>{
    //     new ArtistData(items);
    //   });
    //   console.log(log);
    //   // return data.artist.map(item=>{
    //   //   new ArtistData(item);
    //   // });
    // });


    // return relateArtistData.map(item=>{
    //   return new ArtistData(item);
    // })
    // return this.sendRequestToExpress("/artists/" + artistId + "/related-artists").then((data)=>map(item =>{
    //   return new ArtistData(item);
    // }))


    //return null as any;
  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    //TODO: use the top tracks endpoint to make a request to express.
    console.log("getTopTracksForArtist----over")
    artistId = encodeURIComponent(artistId);
    return this.sendRequestToExpress("/artist-top-tracks/" + artistId).then((data)=>{
      //console.log(data);
      let log = data.tracks.map((items)=>{
        return new TrackData(items);
      })
      //console.log(log);
      return log;
    });
    //return null as any;
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    //TODO: use the albums for an artist endpoint to make a request to express.
    console.log("getAlbumsForArtist----over")
    artistId = encodeURIComponent(artistId);
    return this.sendRequestToExpress("/artist-albums/" + artistId).then((data)=>{
      //console.log(data);
      let log = data.items.map((items)=>{
        return new AlbumData(items);
      })
      console.log(log);
      return log;
    });
    //return null as any;
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    //TODO: use the album endpoint to make a request to express.
    console.log("getAlbum----over")
    albumId = encodeURIComponent(albumId);
    return this.sendRequestToExpress("/album/" + albumId).then((data)=>{
      return new AlbumData(data);
    });
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    //TODO: use the tracks for album endpoint to make a request to express.
    console.log("getTracksForAlbum----over")
    albumId = encodeURIComponent(albumId);
    return this.sendRequestToExpress("/album-tracks/" + albumId).then((data)=>{
      //console.log(data.items);
      let log = data.items.map((items)=>{
        return new TrackData(items);
      })
      return log;
    });
    //return null as any;
  }

  getTrack(trackId:string):Promise<TrackData> {
    //TODO: use the track endpoint to make a request to express.
    console.log("getTrack----over")
    trackId = encodeURIComponent(trackId);
    return this.sendRequestToExpress("/track/" + trackId).then((data)=>{
      console.log(new TrackData(data));
      return new TrackData(data);
    });
    //return null as any;
  }

  getAudioFeaturesForTrack(trackId:string):Promise<TrackFeature[]> {
    //TODO: use the audio features for track endpoint to make a request to express.
    console.log("getAudioFeaturesForTrack----over")
    trackId = encodeURIComponent(trackId);
    let tf = [];
    return this.sendRequestToExpress("/track-audio-features/" + trackId).then((data)=>{
      // console.log(data);
      // console.log(TrackFeature.FeatureTypes)
      for(let key of TrackFeature.FeatureTypes){
        // console.log(key);
        // console.log(data[key]);
        tf.push(new TrackFeature(key, data[key]));
      }
      console.log(tf);
      return tf;
    });
    //return null as any;
  }
}
