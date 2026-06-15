import Decimal from 'decimal.js';
import { ColumnType } from 'kysely';

export type MoneyColumn = ColumnType<
  Money | null,
  string | number | null,
  string | number | null
>;

export class Money {
  private value: Decimal;
  // private currency: string;

  constructor(value: string | number | Decimal) {
    // Always create Decimal from string to avoid JS float issues
    this.value = new Decimal(value);
  }

  // --- Formatting ---
  getFormatted(): string {
    return this.formatMoney(this.value);
  }

  add(money: Money): Money {
    return new Money(this.value.plus(money.value));
  }

  subtract(money: Money): Money {
    return new Money(this.value.minus(money.value));
  }

  multiply(multiplier: number | string): Money {
    return new Money(this.value.times(multiplier));
  }

  divide(divisor: number | string): Money {
    return new Money(this.value.div(divisor));
  }

  toString(): string {
    return this.value.toString();
  }

  private formatMoney(amount: Decimal): string {
    const hasFractions = !amount.isInteger();
    const formatter = new Intl.NumberFormat('en-JO', {
      // style: 'currency',
      // currency: 'JOD',
      minimumFractionDigits: hasFractions ? 2 : 0,
      maximumFractionDigits: hasFractions ? 2 : 0,
    });
    return formatter.format(amount.toNumber());
  }

  // --- Utility ---
  // private ensureSameCurrency(other: Money) {
  //   if (this.currency !== other.currency) {
  //     throw new Error('Currency mismatch');
  //   }
  // }
}
