import { Test, TestingModule } from '@nestjs/testing';
import { ResiduosService } from './residuos.service';

describe('ResiduosService', () => {
  let service: ResiduosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResiduosService],
    }).compile();

    service = module.get<ResiduosService>(ResiduosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
