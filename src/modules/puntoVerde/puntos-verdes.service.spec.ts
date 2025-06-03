import { Test, TestingModule } from '@nestjs/testing';
import { PuntosVerdesService } from './puntos-verdes.service';

describe('PuntosVerdesService', () => {
  let service: PuntosVerdesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PuntosVerdesService],
    }).compile();

    service = module.get<PuntosVerdesService>(PuntosVerdesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
