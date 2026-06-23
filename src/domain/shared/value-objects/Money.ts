/**
 * src/domain/shared/value-objects/Money.ts
 *
 * Value Object para cantidades monetarias.
 * Usa enteros (céntimos) internamente para evitar errores de punto flotante.
 */

import { ValidationError } from "../errors/DomainError";

export class Money {
  // Almacenamos en céntimos para evitar aritmética de punto flotante
  private readonly _cents: number;
  private readonly _currency: string;

  constructor(amount: number, currency = "EUR") {
    if (!Number.isFinite(amount) || amount < 0) {
      throw new ValidationError("El importe debe ser un número positivo", {
        amount: ["Importe inválido"],
      });
    }
    // Convertir a céntimos y redondear
    this._cents = Math.round(amount * 100);
    this._currency = currency.toUpperCase();
  }

  // Crear desde céntimos (uso interno)
  static fromCents(cents: number, currency = "EUR"): Money {
    return new Money(cents / 100, currency);
  }

  get amount(): number {
    return this._cents / 100;
  }

  get cents(): number {
    return this._cents;
  }

  get currency(): string {
    return this._currency;
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return Money.fromCents(this._cents + other._cents, this._currency);
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return Money.fromCents(this._cents - other._cents, this._currency);
  }

  multiply(factor: number): Money {
    return Money.fromCents(Math.round(this._cents * factor), this._currency);
  }

  percentage(pct: number): Money {
    return this.multiply(pct / 100);
  }

  equals(other: Money): boolean {
    return this._cents === other._cents && this._currency === other._currency;
  }

  isZero(): boolean {
    return this._cents === 0;
  }

  format(locale = "es-ES"): string {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: this._currency,
    }).format(this.amount);
  }

  toJSON() {
    return {
      amount: this.amount,
      cents: this._cents,
      currency: this._currency,
    };
  }

  private assertSameCurrency(other: Money): void {
    if (this._currency !== other._currency) {
      throw new ValidationError("No se pueden operar monedas distintas", {
        currency: [`${this._currency} !== ${other._currency}`],
      });
    }
  }
}
