import { IsString, MinLength, IsInt, IsPositive, Min } from "class-validator";

export class CreatePokemonDto {

  @IsString()
  @MinLength(1, {message: 'Se requiere minimo 1 caracteres para el nombre'})
  name: string;

  @IsInt()
  @IsPositive()
  @Min(1, {message: 'Se requiere minimo un valor de 1'})
  no: number;
}
