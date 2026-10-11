import { BadRequestException, Injectable } from '@nestjs/common';

export type Operation = 'sum' | 'subtract' | 'multiply' | 'divide';

export interface MathResult {
  operation: Operation;
  a: number;
  b: number;
  result: number;
}

@Injectable()
export class MathService {
  calculate(operation: Operation, rawA: unknown, rawB: unknown): MathResult {
    const a = this.parse('a', rawA);
    const b = this.parse('b', rawB);

    let result: number;
    switch (operation) {
      case 'sum':
        result = a + b;
        break;
      case 'subtract':
        result = a - b;
        break;
      case 'multiply':
        result = a * b;
        break;
      case 'divide':
        if (b === 0) {
          throw new BadRequestException('No se puede dividir por cero');
        }
        result = a / b;
        break;
    }

    return { operation, a, b, result };
  }

  private parse(name: string, value: unknown): number {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new BadRequestException(
        `El parámetro "${name}" es obligatorio y debe ser un número`,
      );
    }
    const n = Number(value);
    if (!Number.isFinite(n)) {
      throw new BadRequestException(
        `El parámetro "${name}" debe ser un número válido (recibido: "${value}")`,
      );
    }
    return n;
  }
}
