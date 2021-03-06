import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { VideoMetadata } from '../interfaces/video-metadata';
import { TutorialVideoMetadata } from '../interfaces/tutorial-video-metadata';
import { ReviewVideoData } from '../interfaces/review-video-data';
import { Bubble } from '../interfaces/bubble';
import { TutorialVideoData } from '../interfaces/tutorial-video-data';
import { TutorialResponse } from '../interfaces/tutorial-response';

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

  getTutorialVideo() {
    return this.http.get<TutorialVideoData>(`${ this.url }/get-tutorial-video`).toPromise();
  }

  getReviewVideo() {
    return this.http.get<ReviewVideoData>(`${ this.url }/get-review-video`).toPromise();
  }

  deleteVideo(video: { title: string, location: string }) {
    let params = new HttpParams().set('title', video.title);
    params = params.append('location', video.location);
    return this.http.delete(`${ this.url }/delete-video`, { params }).toPromise();
  }

  deleteVideoRating(ratingData: { title: string, uid: string, location: string }) {
    let params = new HttpParams().set('title', ratingData.title);
    params = params.append('uid', ratingData.uid);
    params = params.append('location', ratingData.location);
    return this.http.delete(`${ this.url }/delete-video-rating`, { params }).toPromise();
  }

  searchVideo(video: { title: string} ) {
    const params = new HttpParams().set('title', video.title);
    return this.http.get<{ video: VideoMetadata }>(`${ this.url }/get-video`, { params }).toPromise();
  }

  resetVideo(video: { title: string }) {
    return this.http.post(`${ this.url }/reset-video`, video).toPromise();
  }

  addTutorialVideo(video: { url: string, stdev: number, average: number, fps: string, washout: boolean, noBubbles: boolean }) {
    return this.http.post(`${ this.url }/add-tutorial-video`, video ).toPromise();
  }

  reviewFlaggedVideo(title: string) {
    return this.http.post(`${ this.url }/review-flagged-video`, { title }).toPromise();
  }

  addVideoRating(rating: { title: string, rating: Bubble[] }) {
    return this.http.post(`${ this.url }/submit-video-rating`, rating).toPromise();
  }

  addTutorialRating(video: { title: string, average: number }) {
    return this.http.post<TutorialResponse>(`${ this.url }/add-tutorial-rating`, video ).toPromise();
  }

  updateLocationCount(location: string) {
    return this.http.post(`${ this.url }/update-count`, { location }).toPromise();
  }
}
