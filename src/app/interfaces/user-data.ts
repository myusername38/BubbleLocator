
export interface UserData {
  accepted: number;
  outliers: number;
  rejectedRatings: [{ added: Date, rating: [{ frame: number, time: number, x: number, y: number }], video: string }];
  role: string;
  userScore: number;
  videosReviewed: number;
  videosRated: [string];
  uid: string;
}
