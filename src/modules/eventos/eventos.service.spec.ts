import { Test, TestingModule } from '@nestjs/testing';
import { EventosService } from './eventos.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import CustomError from 'src/utils/custom.error';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

// Mock de los módulos fs
jest.mock('fs');
jest.mock('path');

const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;
const mockUnlinkSync = unlinkSync as jest.MockedFunction<typeof unlinkSync>;
const mockJoin = join as jest.MockedFunction<typeof join>;

describe('EventosService', () => {
  let service: EventosService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockPrismaService = {
    evento: {
      create: jest.fn().mockResolvedValue({}),
      findFirst: jest.fn().mockResolvedValue({}),
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
    },
    puntoVerde: {
      findMany: jest.fn().mockResolvedValue([]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventosService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<EventosService>(EventosService);
    prismaService = module.get(PrismaService);

    // Resetear todos los mocks
    jest.clearAllMocks();
    
    // Configurar mocks por defecto
    mockJoin.mockImplementation((...args) => args.join('/'));
    mockExistsSync.mockReturnValue(true);
    process.env.URL_BACKEND = 'http://localhost:10000';
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const mockCreateEventoDto: CreateEventoDto = {
      titulo: 'Evento Test',
      descripcion: 'Descripción del evento',
      fechaInicio: new Date('2024-12-31'),
      fechaFin: new Date('2025-01-01'),
      imagen: '/img/eventos/test.jpg',
      codigo: 'TEST123',
      multiplicador: 1.5,
      puntosVerdesPermitidos: ['punto1', 'punto2'],
    };

    it('debería crear un evento exitosamente', async () => {
      const mockEvento = { id: '1', ...mockCreateEventoDto };
      (prismaService.puntoVerde.findMany as jest.Mock).mockResolvedValue([
        { id: 'punto1' },
        { id: 'punto2' },
      ]);
      (prismaService.evento.create as jest.Mock).mockResolvedValue(mockEvento);

      const result = await service.create(mockCreateEventoDto);

      expect(prismaService.puntoVerde.findMany).toHaveBeenCalledWith({
        where: { id: { in: ['punto1', 'punto2'] } },
        select: { id: true },
      });
      expect(prismaService.evento.create).toHaveBeenCalledWith({
        data: {
          ...mockCreateEventoDto,
          puntosVerdesPermitidos: ['punto1', 'punto2'],
        },
      });
      expect(result).toEqual(mockEvento);
    });

    it('debería crear un evento sin puntos verdes permitidos', async () => {
      const dtoSinPuntos = { ...mockCreateEventoDto, puntosVerdesPermitidos: [] };
      const mockEvento = { id: '1', ...dtoSinPuntos };
      (prismaService.evento.create as jest.Mock).mockResolvedValue(mockEvento);

      const result = await service.create(dtoSinPuntos);

      expect(prismaService.puntoVerde.findMany).not.toHaveBeenCalled();
      expect(prismaService.evento.create).toHaveBeenCalledWith({
        data: {
          ...dtoSinPuntos,
          codigo: '',
          multiplicador: 1.0,
        },
      });
      expect(result).toEqual(mockEvento);
    });

    it('debería lanzar error si la fecha de fin es menor a la fecha de inicio', async () => {
      const dtoConFechasInvalidas = {
        ...mockCreateEventoDto,
        fechaInicio: new Date('2025-01-01'),
        fechaFin: new Date('2024-12-31'),
      };

      await expect(service.create(dtoConFechasInvalidas)).rejects.toThrow(
        CustomError
      );
    });

    it('debería lanzar error si las fechas son menores a la fecha actual', async () => {
      const dtoConFechasPasadas = {
        ...mockCreateEventoDto,
        fechaInicio: new Date('2020-01-01'),
        fechaFin: new Date('2020-01-02'),
      };

      await expect(service.create(dtoConFechasPasadas)).rejects.toThrow(
        CustomError
      );
    });

    it('debería lanzar error si algún punto verde no existe', async () => {
      (prismaService.puntoVerde.findMany as jest.Mock).mockResolvedValue([{ id: 'punto1' }]);

      await expect(service.create(mockCreateEventoDto)).rejects.toThrow(
        CustomError
      );
    });

    it('debería eliminar la imagen si hay error en la creación', async () => {
      const mockPath = '/img/eventos/test.jpg';
      mockJoin.mockReturnValue(mockPath);
      mockExistsSync.mockReturnValue(true);
      
      (prismaService.puntoVerde.findMany as jest.Mock).mockRejectedValue(new Error('DB Error'));

      await expect(service.create(mockCreateEventoDto)).rejects.toThrow(
        CustomError
      );

      expect(mockUnlinkSync).toHaveBeenCalledWith(mockPath);
    });

    it('debería manejar errores de base de datos correctamente', async () => {
      (prismaService.puntoVerde.findMany as jest.Mock).mockResolvedValue([
        { id: 'punto1' },
        { id: 'punto2' },
      ]);
      (prismaService.evento.create as jest.Mock).mockRejectedValue(new Error('DB Error'));

      await expect(service.create(mockCreateEventoDto)).rejects.toThrow(
        CustomError
      );
    });
  });

  describe('validarCodigo', () => {
    const mockEvento = {
      id: '1',
      codigo: 'TEST123',
      fechaInicio: new Date('2024-01-01'),
      fechaFin: new Date('2025-12-31'),
    };

    it('debería validar un código correctamente', async () => {
      (prismaService.evento.findFirst as jest.Mock).mockResolvedValue(mockEvento);

      const result = await service.validarCodigo('TEST123');

      expect(prismaService.evento.findFirst).toHaveBeenCalledWith({
        where: { codigo: 'TEST123' },
      });
      expect(result).toEqual(mockEvento);
    });

    it('debería lanzar error si el código no existe', async () => {
      (prismaService.evento.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(service.validarCodigo('INVALID')).rejects.toThrow(
        'Código de evento no encontrado'
      );
    });

    it('debería lanzar error si el evento ha finalizado', async () => {
      const eventoFinalizado = {
        ...mockEvento,
        fechaFin: new Date('2020-01-01'),
      };
      (prismaService.evento.findFirst as jest.Mock).mockResolvedValue(eventoFinalizado);

      await expect(service.validarCodigo('TEST123')).rejects.toThrow(
        'El evento ha finalizado'
      );
    });

    it('debería lanzar error si el evento no ha comenzado', async () => {
      const eventoNoIniciado = {
        ...mockEvento,
        fechaInicio: new Date('2030-01-01'),
      };
      (prismaService.evento.findFirst as jest.Mock).mockResolvedValue(eventoNoIniciado);

      await expect(service.validarCodigo('TEST123')).rejects.toThrow(
        'El evento no ha comenzado'
      );
    });
  });

  describe('findAll', () => {
    const mockEventos = [
      {
        id: '1',
        titulo: 'Evento 1',
        descripcion: 'Descripción 1',
        imagen: '/img/eventos/evento1.jpg',
        fechaInicio: new Date('2024-01-01'),
        fechaFin: new Date('2025-01-01'),
        codigo: 'EVENTO1',
        puntosVerdesPermitidos: ['punto1'],
      },
      {
        id: '2',
        titulo: 'Evento 2',
        descripcion: 'Descripción 2',
        imagen: '/img/eventos/evento2.jpg',
        fechaInicio: new Date('2024-02-01'),
        fechaFin: new Date('2025-02-01'),
        codigo: 'EVENTO2',
        puntosVerdesPermitidos: ['punto2'],
      },
    ];

    it('debería obtener todos los eventos activos', async () => {
      (prismaService.evento.findMany as jest.Mock).mockResolvedValue(mockEventos);

      const result = await service.findAll();

      expect(prismaService.evento.findMany).toHaveBeenCalledWith({
        where: {
          fechaFin: { gte: expect.any(Date) },
          isDeleted: false,
        },
        select: {
          id: true,
          titulo: true,
          descripcion: true,
          imagen: true,
          fechaInicio: true,
          fechaFin: true,
          codigo: true,
          puntosVerdesPermitidos: true,
        },
      });
      expect(result).toEqual(mockEventos);
    });

    it('debería actualizar las URLs de las imágenes existentes', async () => {
      (prismaService.evento.findMany as jest.Mock).mockResolvedValue(mockEventos);

      const result = await service.findAll();

      expect(result[0].imagen).toBe('http://localhost:3000/img/eventos/evento1.jpg');
      expect(result[1].imagen).toBe('http://localhost:3000/img/eventos/evento2.jpg');
    });

    it('debería manejar errores correctamente', async () => {
      (prismaService.evento.findMany as jest.Mock).mockRejectedValue(new Error('DB Error'));

      await expect(service.findAll()).rejects.toThrow(CustomError);
    });
  });

  describe('findOne', () => {
    const mockEvento = {
      id: '1',
      titulo: 'Evento Test',
      descripcion: 'Descripción del evento',
    };

    it('debería encontrar un evento por ID', async () => {
      (prismaService.evento.findUnique as jest.Mock).mockResolvedValue(mockEvento);

      const result = await service.findOne('1');

      expect(prismaService.evento.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockEvento);
    });

    it('debería retornar null si el evento no existe', async () => {
      (prismaService.evento.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.findOne('999');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    const mockUpdateDto = {
      titulo: 'Evento Actualizado',
      descripcion: 'Nueva descripción',
    };

    it('debería actualizar un evento', async () => {
      const mockEventoActualizado = { id: '1', ...mockUpdateDto };
      (prismaService.evento.update as jest.Mock).mockResolvedValue(mockEventoActualizado);

      const result = await service.update('1', mockUpdateDto);

      expect(prismaService.evento.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: mockUpdateDto,
      });
      expect(result).toEqual(mockEventoActualizado);
    });
  });

  describe('remove', () => {
    it('debería marcar un evento como eliminado (soft delete)', async () => {
      const mockEventoEliminado = { id: '1', isDeleted: true };
      (prismaService.evento.update as jest.Mock).mockResolvedValue(mockEventoEliminado);

      const result = await service.remove('1');

      expect(prismaService.evento.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { isDeleted: true },
      });
      expect(result).toEqual(mockEventoEliminado);
    });
  });
});
