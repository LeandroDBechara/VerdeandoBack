import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginAuthDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/interfaces/index';
import { comparePassword, hashPassword, createTokens } from 'src/common/utils/encryption';
import { MessagingService } from '../messanging/messanging.service';
import { messagingConfig } from 'src/common/constants';
import { RecoverPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { RegisterUserDto } from './dto/register.dto';
import CustomError from 'src/common/utils/custom.error';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private messagingService: MessagingService,
  ) {}
  
  async register(user: RegisterUserDto) {
    try {
 
      if (!user.email || !user.password || !user.nombre || !user.apellido || !user.fechaDeNacimiento) {
        
      const message = 'Los campos son requeridos';
        throw new CustomError(message, HttpStatus.BAD_REQUEST); // 400
      }
  
      const userExists = await this.prisma.usuario.findFirst({
        where: {
          email: {
            equals: user.email,
            mode: 'insensitive',
          },
        },
      });
      
      
      if (userExists) {
        const message = 'El email ya existe';
        throw new CustomError(message, HttpStatus.CONFLICT); // 409
      }
      
      const hashedPassword = await hashPassword(user.password);
      const email = user.email.toLowerCase();
      
      
  
      const newUser = await this.prisma.usuario.create({
        data: {
          ...user,
          email,
          password: hashedPassword,
          
        },
      });
  
      try {
        await this.messagingService.sendRegisterUserEmail({
          from: messagingConfig.emailSender!,
          to: email,
          name: user.nombre
        });
      } catch (emailError) {
        const message = 'Error al enviar el email';
        throw new CustomError(
          message,
          HttpStatus.CREATED, // 201
        );
      }
      const message = 'Registro exitoso';
      return {
        message,
        userId: newUser.id,
      };
      
    } catch (error) {
    
      if (error instanceof CustomError) {
        throw error;
      }
      const messageActionRegister = 'Registro exitoso';
      const message = 'Error al registrar el usuario';
   
      throw new CustomError(
        error?.message || message,
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
  }

  async login(credentials: LoginAuthDto) {
    try {
      const { password } = credentials;

      const findUser = await this.prisma.usuario.findFirst({
        where: {
          email: {
            equals: credentials.email,
            mode: 'insensitive',
          },
          isDeleted:false,
        },
        select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            fechaDeNacimiento: true,
            rol: true,
            password: true,
            fotoPerfil: true,
            direccion: true,
            puntos: true,
            colaborador: {
              select: {
                id: true,
                cvu: true,
                domicilioFiscal: true,
                cuitCuil: true,
                usuarioId: true,
              },
            },
            comunidad: {
              select: {
                id: true,
                nombre: true,
                descripcion: true,
                puntos: true,
                historial: true,
                isDeleted: true,
              },
            },
          },
        },
      );
      
      if (!findUser) {
        const message = 'Usuario o contraseña incorrecta';
        throw new CustomError(message,HttpStatus.UNAUTHORIZED);
      }
   
      const isCorrectPassword = await comparePassword(
        password,
        findUser.password,
      );

      if (!isCorrectPassword) {
        const message = 'Usuario  o contraseña incorrecta';
        throw new CustomError(message,HttpStatus.UNAUTHORIZED);
      }

      const payload: JwtPayload = {
        id: findUser.id,
        email: findUser.email,
        role: findUser.rol,
      };

      const token = await createTokens(payload, this.jwtService);

      return {
        user: findUser,
        token,
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
  
      const messageActionLogin = 'Login exitoso';
      const message = 'Error al iniciar sesión';
     
   
      throw new CustomError(
        error?.message || message,
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
  }

  async recoveryPassword(recoverDto: RecoverPasswordDto) {
    try {

      const findUser = await this.prisma.usuario.findFirst({
        where: {
          email: {
            equals: recoverDto.email,
            mode: 'insensitive',
          },
        },
      });
      

      if(!findUser){
        const message = 'Usuario no encontrado';
        throw new CustomError(
         message,
          HttpStatus.NOT_FOUND, // 404
        );
      }

      const payload: JwtPayload = {
        id: findUser.id,
        email: findUser.email,
        role: findUser.rol,
      };
  
      const { accessToken } = await createTokens(payload, this.jwtService);

      if(!accessToken){
        const messageActionRecoveryPassword = 'Recuperación de contraseña exitosa';
        const message = 'Error al enviar el email';
       
        throw new CustomError(
          message,
          HttpStatus.INTERNAL_SERVER_ERROR, // 500
        );
      }
  
      await this.messagingService.sendRecoveryPassword({
        from: messagingConfig.emailSender!,
        to: findUser.email,
        url: `${messagingConfig.resetPasswordUrls.backoffice}/${accessToken}`,
      });

      const message = 'Email enviado';
      return {
        message,
        accessToken,
      };

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
  
      const messageActionRecoveryPassword = 'Recuperación de contraseña exitosa';
      const message = 'Error al enviar el email';
     
   
      throw new CustomError(
        error?.message || message,
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }

  }

  async resetPassword(resetDto: ResetPasswordDto, id: string) {
    try {
      const { password, confirmPassword } = resetDto;

      if (password !== confirmPassword) {
        const message = 'Error al actualizar la contraseña';
        throw new CustomError(
          message,
          HttpStatus.BAD_REQUEST // 400
        );
      }      

      const findUser = await this.prisma.usuario.findUnique({ where: { id } });
  
      if(!findUser){
        const message = 'Usuario no encontrado';
        throw new CustomError(
         message,
          HttpStatus.NOT_FOUND, // 404
        );
      }
  
      await this.prisma.usuario.update({
        where: { id },
        data: {
          password: await hashPassword(password),
        },
      });

      const message = 'Contraseña actualizada';
      return { message};

    } catch (error) {
        if (error instanceof CustomError) {
        throw error;
      }
  
      const messageActionResetPassword = 'Reset de contraseña exitoso';
      const message = 'Error al actualizar la contraseña';
     
   
      throw new CustomError(
        error?.message || message,
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
   
  }

}