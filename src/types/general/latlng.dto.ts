export class LatLng {
  constructor(
    public latitude: number | undefined | null,
    public longitude: number | undefined | null,
  ) {}

  toString(): string {
    return `${this.latitude},${this.longitude}`;
  }
  getLat(): number | undefined | null {
    return this.latitude;
  }
  getLng(): number | undefined | null {
    return this.longitude;
  }
}
