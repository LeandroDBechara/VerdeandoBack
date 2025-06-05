import { Test, TestingModule } from '@nestjs/testing';
import { RecompensasController } from './recompensas.controller';
import { RecompensasService } from './recompensas.service';

describe('RecompensasController', () => {
  let controller: RecompensasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecompensasController],
      providers: [RecompensasService],
    }).compile();

    controller = module.get<RecompensasController>(RecompensasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
