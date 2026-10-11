import { Controller, Get, Query } from '@nestjs/common';
import { MathService, type MathResult } from './math.service.js';

@Controller('math')
export class MathController {
  constructor(private readonly mathService: MathService) {}

  @Get('sum')
  sum(@Query('a') a?: string, @Query('b') b?: string): MathResult {
    return this.mathService.calculate('sum', a, b);
  }

  @Get('subtract')
  subtract(@Query('a') a?: string, @Query('b') b?: string): MathResult {
    return this.mathService.calculate('subtract', a, b);
  }

  @Get('multiply')
  multiply(@Query('a') a?: string, @Query('b') b?: string): MathResult {
    return this.mathService.calculate('multiply', a, b);
  }

  @Get('divide')
  divide(@Query('a') a?: string, @Query('b') b?: string): MathResult {
    return this.mathService.calculate('divide', a, b);
  }
}
