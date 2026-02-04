import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateExampleDto } from './dto';

@Injectable()
export class ExampleService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    try {
      const list = await this.prisma.example.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return list.map((e) => ({
        ...e,
        createdAt: e.createdAt.toISOString(),
      }));
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Failed to fetch examples',
      );
    }
  }

  async create(dto: CreateExampleDto) {
    try {
      const ex = await this.prisma.example.create({
        data: { name: dto.name, email: dto.email },
      });
      return { ...ex, createdAt: ex.createdAt.toISOString() };
    } catch (error) {
      const prismaError = error as { code?: string };
      if (prismaError?.code === 'P2002') {
        throw new BadRequestException('Example already exists');
      }
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Failed to create example',
      );
    }
  }
}
