import { Test, TestingModule } from '@nestjs/testing';
import { RecompensasService } from './recompensas.service';

describe('RecompensasService', () => {
  let service: RecompensasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecompensasService],
    }).compile();

    service = module.get<RecompensasService>(RecompensasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
