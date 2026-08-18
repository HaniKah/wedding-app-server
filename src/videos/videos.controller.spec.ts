import { Test, TestingModule } from '@nestjs/testing';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { VideoBucketName } from '../types/videos/videos.dto';
import { VideosDto, VideosViewModel } from '../types/planner/videos.dto';

// videos.service.ts pulls in fluent-ffmpeg/ffmpeg-static/ffprobe-static/uuid at
// module scope (it sets the ffmpeg/ffprobe binary paths on import) — these need
// mocking even though the service itself is auto-mocked below, otherwise jest
// tries to parse their real (ESM) source.
jest.mock('fluent-ffmpeg', () => {
  const fn = jest.fn();
  (fn as unknown as { ffprobe: unknown }).ffprobe = jest.fn();
  (fn as unknown as { setFfmpegPath: unknown }).setFfmpegPath = jest.fn();
  (fn as unknown as { setFfprobePath: unknown }).setFfprobePath = jest.fn();
  return { __esModule: true, default: fn };
});
jest.mock('ffmpeg-static', () => ({
  __esModule: true,
  default: '/mock/ffmpeg',
}));
jest.mock('ffprobe-static', () => ({
  __esModule: true,
  default: { path: '/mock/ffprobe' },
}));
jest.mock('uuid', () => ({ v4: jest.fn().mockReturnValue('mockUuid') }));

jest.mock('./videos.service');

describe('VideosController', () => {
  let videosController: VideosController;
  let videosService: VideosService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [VideosController],
      providers: [VideosService],
    }).compile();

    videosController = moduleRef.get<VideosController>(VideosController);
    videosService = moduleRef.get<VideosService>(VideosService);
    jest.clearAllMocks();
  });

  describe('uploadFile', () => {
    it('delegates to videosService.uploadFile and returns its result', async () => {
      const mockFile = { path: '/tmp/x.mp4' } as Express.Multer.File;
      const expected = { id: 1 } as VideosDto;
      jest.spyOn(videosService, 'uploadFile').mockResolvedValue(expected);

      const result = await videosController.uploadFile(mockFile, 123);

      expect(jest.spyOn(videosService, 'uploadFile')).toHaveBeenCalledWith(
        123,
        mockFile,
        VideoBucketName.Listings,
      );
      expect(result).toEqual(expected);
    });
  });

  describe('getAllVideos', () => {
    it('wraps videosService.getVideosByPlaceId result in a view model', async () => {
      const videos = [{ id: 1 }, { id: 2 }] as VideosDto[];
      jest.spyOn(videosService, 'getVideosByPlaceId').mockResolvedValue(videos);

      const result: VideosViewModel = await videosController.getAllVideos(123);

      expect(
        jest.spyOn(videosService, 'getVideosByPlaceId'),
      ).toHaveBeenCalledWith(123);
      expect(result).toEqual({ result: videos });
    });
  });

  describe('getVideo', () => {
    it('delegates to videosService.getVideoById and returns its result', async () => {
      const expected = { id: 5 } as VideosDto;
      jest.spyOn(videosService, 'getVideoById').mockResolvedValue(expected);

      const result = await videosController.getVideo(5);

      expect(jest.spyOn(videosService, 'getVideoById')).toHaveBeenCalledWith(5);
      expect(result).toEqual(expected);
    });
  });

  describe('deleteVideo', () => {
    it('delegates to videosService.deleteVideo with the request id', async () => {
      jest.spyOn(videosService, 'deleteVideo').mockResolvedValue(undefined);

      await videosController.deleteVideo({ id: 7 });

      expect(jest.spyOn(videosService, 'deleteVideo')).toHaveBeenCalledWith(7);
    });
  });

  describe('setMain', () => {
    it('delegates to videosService.setMain with videoId and placeId', async () => {
      jest.spyOn(videosService, 'setMain').mockResolvedValue(undefined);

      await videosController.setMain(9, 123);

      expect(jest.spyOn(videosService, 'setMain')).toHaveBeenCalledWith(123, 9);
    });
  });
});
