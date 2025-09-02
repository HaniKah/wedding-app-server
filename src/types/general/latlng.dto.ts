export class LatLng {
  constructor(
    public latitude: number | undefined,
    public longitude: number | undefined,
  ) {}

  toString(): string {
    return `${this.latitude},${this.longitude}`;
  }
  getLat(): number | undefined {
    return this.latitude;
  }
  getLng(): number | undefined {
    return this.longitude;
  }
}
