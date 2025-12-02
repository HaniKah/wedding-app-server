import { Money } from '../../common/Money';

export class PriceRangeDto {
  min: Money;
  max: Money;
  constructor(min: Money, max: Money) {
    this.min = min;
    this.max = max;
  }
}
