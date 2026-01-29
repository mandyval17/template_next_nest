import { Test, TestingModule } from '@nestjs/testing';
import { ExampleController } from './example.controller';
import { ExampleService } from './example.service';

describe('ExampleController', () => {
  let controller: ExampleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExampleController],
      providers: [
        {
          provide: ExampleService,
          useValue: {
            findAll: async () => [],
            create: async () => ({
              id: '1',
              name: 'a',
              email: 'a@x.com',
              createdAt: new Date().toISOString(),
            }),
          },
        },
      ],
    }).compile();
    controller = module.get<ExampleController>(ExampleController);
  });

  it('list returns array', async () => {
    const list = await controller.list();
    expect(Array.isArray(list)).toBe(true);
  });

  it('create returns object with id, name, email, createdAt', async () => {
    const created = await controller.create({ name: 'a', email: 'a@x.com' });
    expect(created).toHaveProperty('id');
    expect(created).toHaveProperty('name', 'a');
    expect(created).toHaveProperty('email', 'a@x.com');
    expect(created).toHaveProperty('createdAt');
  });
});
