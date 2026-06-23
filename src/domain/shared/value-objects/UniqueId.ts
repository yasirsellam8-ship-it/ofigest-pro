/**
 * src/domain/shared/value-objects/UniqueId.ts
 *
 * Value Object para identificadores únicos.
 * Inmutable por diseño - no puede cambiar después de crearse.
 */

import { v4 as uuidv4 } from "uuid";

export class UniqueId {
  private readonly _value: string;

  constructor(value?: string) {
    this._value = value ?? uuidv4();
    this.validate();
  }

  private validate() {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(this._value)) {
      throw new Error(`ID inválido: ${this._value}`);
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: UniqueId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static generate(): UniqueId {
    return new UniqueId();
  }
}
