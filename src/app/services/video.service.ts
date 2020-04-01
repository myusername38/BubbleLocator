import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { VideoMetadata } from '../interfaces/video-metadata';
import { TutorialVideoMetadata } from '../interfaces/tutorial-video-metadata';
import { ReviewVideoData } from '../interfaces/review-video-data';
import { Bubble } from '../interfaces/bubble';

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

  getTutorialVideos() {
    return this.http.get<TutorialVideoMetadata[]>(`${ this.url }/get-tutorial-videos`).toPromise();
  }

  addTutorialVideo(video: { url: string, fps: string, average: number, washout: boolean, noBubbles: boolean }) {
    return this.http.post(`${ this.url }/add-tutorial-video`, video ).toPromise();
  }

  addVideoRating(rating: { title: string, rating: Bubble[] }) {
    return this.http.post(`${ this.url }/submit-video-rating`, rating).toPromise();
  }
}
