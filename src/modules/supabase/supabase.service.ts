import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL y KEY son requeridos en las variables de entorno');
    }

    // Configurar cliente para backend: usar service role key y deshabilitar persistencia de sesión
    // IMPORTANTE: SUPABASE_KEY debe ser la SERVICE ROLE KEY, no la anon key
    // La service role key bypassa RLS (Row Level Security)
    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false, // No necesitamos persistir sesión en el backend
        autoRefreshToken: false,
      },
    });
  }

  /**
   * Sube un archivo a un bucket de Supabase
   * @param bucketName Nombre del bucket
   * @param filePath Ruta donde se guardará el archivo (ej: 'usuarios/foto123.jpg')
   * @param file Buffer o File del archivo a subir
   * @param contentType Tipo MIME del archivo (ej: 'image/jpeg')
   * @returns URL pública del archivo subido
   */
  async uploadFile(
    bucketName: string,
    filePath: string,
    file: Buffer | Express.Multer.File,
    contentType: string,
  ): Promise<string> {
    try {
      // Convertir a Buffer de Node.js explícitamente
      let fileBuffer: Buffer;
      if (file instanceof Buffer) {
        fileBuffer = file;
      } else {
        // file.buffer puede ser Buffer o ArrayBuffer, asegurarse de convertirlo correctamente
        const buffer = file.buffer;
        fileBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
      }
      
      const { data, error } = await this.supabase.storage
        .from(bucketName)
        .upload(filePath, fileBuffer, {
          contentType,
          upsert: true, // Si el archivo existe, lo reemplaza
        });

      if (error) {
        throw new Error(`Error al subir archivo: ${error.message}`);
      }

      // Obtener la URL pública del archivo
      const { data: urlData } = this.supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      throw new Error(`Error al subir archivo a Supabase: ${error.message}`);
    }
  }

  /**
   * Elimina un archivo de un bucket de Supabase
   * @param bucketName Nombre del bucket
   * @param filePath Ruta del archivo a eliminar
   */
  async deleteFile(bucketName: string, filePath: string): Promise<void> {
    try {
      const { error } = await this.supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (error) {
        throw new Error(`Error al eliminar archivo: ${error.message}`);
      }
    } catch (error) {
      throw new Error(`Error al eliminar archivo de Supabase: ${error.message}`);
    }
  }

  /**
   * Obtiene la URL pública de un archivo
   * @param bucketName Nombre del bucket
   * @param filePath Ruta del archivo
   * @returns URL pública del archivo
   */
  getPublicUrl(bucketName: string, filePath: string): string {
    const { data } = this.supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  /**
   * Verifica si un archivo existe en el bucket
   * @param bucketName Nombre del bucket
   * @param filePath Ruta del archivo
   * @returns true si el archivo existe, false en caso contrario
   */
  async fileExists(bucketName: string, filePath: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.storage
        .from(bucketName)
        .list(filePath.split('/').slice(0, -1).join('/'));

      if (error) {
        return false;
      }

      const fileName = filePath.split('/').pop();
      return data?.some((file) => file.name === fileName) || false;
    } catch {
      return false;
    }
  }

  /**
   * Extrae la ruta del archivo desde una URL de Supabase
   * @param url URL completa del archivo en Supabase
   * @param bucketName Nombre del bucket
   * @returns Ruta del archivo (ej: 'usuarios/foto123.jpg') o null si no es una URL de Supabase
   */
  extractFilePathFromUrl(url: string, bucketName: string): string | null {
    try {
      if (!url || !url.includes('supabase.co/storage')) {
        return null;
      }

      // Formato: https://[project].supabase.co/storage/v1/object/public/[bucket]/[filePath]
      const urlParts = url.split('/');
      const bucketIndex = urlParts.findIndex((part) => part === bucketName);
      
      if (bucketIndex === -1 || bucketIndex === urlParts.length - 1) {
        return null;
      }

      // Obtener todo después del nombre del bucket
      const filePath = urlParts.slice(bucketIndex + 1).join('/');
      return filePath;
    } catch {
      return null;
    }
  }
}

