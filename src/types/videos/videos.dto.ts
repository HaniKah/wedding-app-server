// this enum is used to identify the bucket name , dont delete any of existing bucket name
export enum VideoBucketName {
  Listings = 'listings',
}

export const MAX_VIDEO_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB
export const MAX_VIDEO_DURATION_MS = 90 * 1000; // 90 seconds
export const ALLOWED_VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/webm',
];

export class DeleteVideoRequest {
  id: number;
}
