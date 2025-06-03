import { Test, TestingModule } from '@nestjs/testing';
import { PuntosVerdesController } from './puntos-verdes.controller';
import { PuntosVerdesService } from './puntos-verdes.service';

describe('PuntosVerdesController', () => {
  let controller: PuntosVerdesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PuntosVerdesController],
      providers: [PuntosVerdesService],
    }).compile();

    controller = module.get<PuntosVerdesController>(PuntosVerdesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
