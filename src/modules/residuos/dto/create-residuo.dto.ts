import { PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateResiduoDto {
  @IsNotEmpty()
  @IsString()
  material: string;

  @IsNotEmpty()
  @IsNumber()
  puntosKg: number;
}
export class UpdateResiduoDto extends PartialType(CreateResiduoDto) {}