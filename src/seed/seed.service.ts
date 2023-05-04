import { Injectable } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { FetchAdapter } from 'src/common/adapters/fetch.adapter';

@Injectable()
export class SeedService {
  private readonly baseURL = 'https://pokeapi.co/api/v2/pokemon?limit=151';

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
    private readonly fetch: FetchAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({}); 

    const data = await this.http.get<PokeResponse>(this.baseURL);
    // const data = await this.fetch.get<PokeResponse>(this.baseURL);

    const newResults: CreatePokemonDto[] = data.results.map(({name, url}) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      return { name, no }
    })

    this.pokemonModel.insertMany(newResults);

    return "Seed ejecutado con exito"
  }
}
