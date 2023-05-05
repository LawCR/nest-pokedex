import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  private readonly defaultLimit: number;
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = configService.get<number>('defaultLimit')
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon
    } catch (error) {
      this.handleExceptions(error);
    }

  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    
    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v')
  }

  async findOne(term: string) {

    let pokemon: Pokemon;

    //* Busqueda por no (numero)
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({no: +term});
    }

    //* Busqueda por mongoId
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    //* Busqueda por nombre
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({name: term.toLocaleLowerCase().trim()});
    }

    if (!pokemon) {
      throw new NotFoundException(`El pokemon ${term} no fue encontrado`);
    }

    return pokemon
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name) 
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
    try { 
      const updatedPokemon = await this.pokemonModel.findOneAndUpdate({ no: pokemon.no }, { $set: updatePokemonDto }, { new: true });
      
      return updatedPokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {

    // const pokemon = await this.findOne(id);
    // await this.pokemonModel.deleteOne({ no: pokemon.no })

    const deletedPokemon = await this.pokemonModel.findByIdAndDelete(id);

    if (!deletedPokemon) {
      throw new NotFoundException(`El pokemon con id ${id} no fue encontrado`);
    }
    
    return deletedPokemon;
    // return `Pokemon ${deletedPokemon.} eliminado`;
  }


  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`El pokemon ${JSON.stringify(error.keyValue)} ya existe`);
    }
    throw new InternalServerErrorException('No se puedo crear el Pokemon - Revisar los logs')
  }
}
