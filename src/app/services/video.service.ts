import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { VideoMetadata } from '../interfaces/video-metadata';
import { TutorialVideoMetadata } from '../interfaces/tutorial-video-metadata';
import { ReviewVideoData } from '../interfaces/review-video-data';
import { Bubble } from '../interfaces/bubble';
import { unescapeIdentifier } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getVideos() {
    return this.http.get<VideoMetadata[]>(`${ this.url }/get-video-data`).toPromise();
  }

  addVideo(video: { url: string, fps: string }) {
    return this.http.post(`${ this.url }/add-video`, video).toPromise();
  }

  getReviewVideo() {
    return this.http.get<ReviewVideoData>(`${ this.url }/get-review-video`).toPromise();
  }

  deleteVideo(video: { title: string }) {
    const params = new HttpParams().set('title', video.title);
    return this.http.delete(`${ this.url }/delete-video`, { params }).toPromise();
  }

  deleteVideoRating(ratingData: { title: string, uid: string, location: string }) {
    let params = new HttpParams().set('title', ratingData.title);
    params = params.append('uid', ratingData.uid);
    params = params.append('location', ratingData.location);
    return this.http.delete(`${ this.url }/delete-video-rating`, { params }).toPromise();
  }

  resetVideo(video: { title: string }) {
    return this.http.post(`${ this.url }/reset-video`, video).toPromise();
  }

  addTutorialVideo(video: { url: string, fps: string, average: number, washout: boolean, noBubbles: boolean }) {
    return this.http.post(`${ this.url }/add-tutorial-video`, video ).toPromise();
  }

  addVideoRating(rating: { title: string, rating: Bubble[] }) {
    return this.http.post(`${ this.url }/submit-video-rating`, rating).toPromise();
  }
}
