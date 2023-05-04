import { IsBoolean, IsNumber, IsOptional, IsPositive, Min } from "class-validator";
import { Type } from "class-transformer";
import { TransformToBoolean } from "../decorators/transform-to-boolean.decorator";

export class PaginationDto {

  @IsOptional() // No es obligatorio
  @IsPositive() // Valida que sea un numero positivo
  @IsNumber() // Valida que sea un numero
  @Min(1) // Valor minimo
  @Type(() => Number) // Transforma el valor a number
  limit?: number; // el ? = Opcional en typescript y lo de arriba para el dto al validar

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  // @IsPositive()
  offset?: number;

  @IsOptional()
  @TransformToBoolean()
  @IsBoolean() // Valida que sea un booleano
  active?: boolean;
}
