import Decimal from 'decimal.js';

export class Money {
  private value: Decimal;
  private currency: string;

  constructor(value: string | number | null, currency = 'JOD') {
    if (!value) {
      return null;
    }
    // Always create Decimal from string to avoid JS float issues
    this.value = new Decimal(value);
    this.currency = currency;
  }

  // --- Formatting ---
  get getFormatted(): string {
    return this.formatMoney(this.value);
  }
  get getCurrency(): string {
    return this.currency;
  }

  add(money: Money): Money {
    this.ensureSameCurrency(money);
    return new Money(this.value.plus(money.value).toString(), this.currency);
  }

  subtract(money: Money): Money {
    this.ensureSameCurrency(money);
    return new Money(this.value.minus(money.value).toString(), this.currency);
  }

  multiply(multiplier: number | string): Money {
    return new Money(this.value.times(multiplier).toString(), this.currency);
  }

  divide(divisor: number | string): Money {
    return new Money(this.value.div(divisor).toString(), this.currency);
  }

  toString(): string {
    return this.value.toString();
  }

  private formatMoney(amount: Decimal): string {
    const hasFractions = !amount.isInteger();
    const formatter = new Intl.NumberFormat('en-JO', {
      style: 'currency',
      currency: this.currency,
      minimumFractionDigits: hasFractions ? 2 : 0,
      maximumFractionDigits: hasFractions ? 2 : 0,
    });
    return formatter.format(amount.toNumber());
  }

  // --- Utility ---
  private ensureSameCurrency(other: Money) {
    if (this.currency !== other.currency) {
      throw new Error('Currency mismatch');
    }
  }
}
