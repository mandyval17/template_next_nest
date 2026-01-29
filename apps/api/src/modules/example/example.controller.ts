import { Body, Controller, Get, Post } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { CreateExampleDto, ExampleResponseDto } from './dto';
import { ExampleService } from './example.service';

@Controller()
export class ExampleController {
  constructor(private readonly example: ExampleService) {}

  @Get('examples')
  async list() {
    return this.example.findAll();
  }

  @Post('example')
  @ZodSerializerDto(ExampleResponseDto)
  async create(@Body() dto: CreateExampleDto) {
    return this.example.create(dto);
  }
}
