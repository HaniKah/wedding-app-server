export class VersionDto {
  minSupportedVersion: string;
  latestVersion: string;
  storeUrls: {
    ios: string;
    android: string;
  };
}
