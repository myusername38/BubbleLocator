import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { VideoMetadata } from '../interfaces/video-metadata';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getVideos() {
    return this.http.get<VideoMetadata[]>(`${ this.url }/get-video-data`).toPromise();
  }

  addVideo(url: string) {
    return this.http.post(`${ this.url }/add-video`, { url }).toPromise();
  }
}
