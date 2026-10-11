import { BadRequestException } from '@nestjs/common';
import { MathService } from './math.service.js';

describe('MathService', () => {
  const service = new MathService();

  it('suma', () => {
    expect(service.calculate('sum', '2', '3').result).toBe(5);
  });

  it('resta', () => {
    expect(service.calculate('subtract', '10', '4').result).toBe(6);
  });

  it('multiplica', () => {
    expect(service.calculate('multiply', '2.5', '4').result).toBe(10);
  });

  it('divide', () => {
    expect(service.calculate('divide', '9', '3').result).toBe(3);
  });

  it('lanza 400 al dividir por cero', () => {
    expect(() => service.calculate('divide', '1', '0')).toThrow(
      BadRequestException,
    );
  });

  it('lanza 400 con parámetros inválidos o ausentes', () => {
    expect(() => service.calculate('sum', 'abc', '1')).toThrow(
      BadRequestException,
    );
    expect(() => service.calculate('sum', undefined, '1')).toThrow(
      BadRequestException,
    );
    expect(() => service.calculate('sum', '1', '')).toThrow(
      BadRequestException,
    );
  });
});
