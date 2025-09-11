# Módulo Scheduler

Este módulo maneja las tareas programadas de la aplicación usando `@nestjs/schedule`.

## Funcionalidades

### Verificación de Eventos Vencidos
- **Función**: `handleEventosVencidos()`
- **Frecuencia**: Diariamente a medianoche (00:00)
- **Propósito**: Ejecuta automáticamente la función `comprobacionVencimientoEventos()` del `EventosService` para marcar como eliminados los eventos que han vencido.

## Configuración

El scheduler está configurado para ejecutarse automáticamente cuando la aplicación se inicia. No requiere configuración adicional.

## Logs

El servicio registra en los logs:
- Inicio de la verificación
- Resultado de la operación
- Errores si los hay

## Cron Expression

La tarea se ejecuta usando `CronExpression.EVERY_DAY_AT_MIDNIGHT`, que equivale a `0 0 * * *` en formato cron estándar.
