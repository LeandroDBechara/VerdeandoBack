import { Test, TestingModule } from '@nestjs/testing';
import { ResiduosController } from './residuos.controller';
import { ResiduosService } from './residuos.service';

describe('ResiduosController', () => {
  let controller: ResiduosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResiduosController],
      providers: [ResiduosService],
    }).compile();

    controller = module.get<ResiduosController>(ResiduosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
