import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateExampleDto } from './dto';

@Injectable()
export class ExampleService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const list = await this.prisma.example.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return list.map((e) => ({
      ...e,
      createdAt: e.createdAt.toISOString(),
    }));
  }

  async create(dto: CreateExampleDto) {
    const ex = await this.prisma.example.create({
      data: { name: dto.name, email: dto.email },
    });
    return { ...ex, createdAt: ex.createdAt.toISOString() };
  }
}
