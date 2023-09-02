import {Pet, Prisma} from '@prisma/client';
import {PetsRepository} from '../pets-repository';
import {prisma} from '@/lib/prisma';
import {Filters} from '@/http/controllers/pets/search-pet.controller';
import {SearchPetServiceResponse} from '@/services/search-pet.service';
import {EditPetInput} from '@/types/organisation';

export class PrismaPetsRepository implements PetsRepository {
  async getBreeds(): Promise<string[]> {
    const breeds = await prisma.pet.findMany({
      select: {
        breed: true,
      },
      where: {
        breed: {
          not: null,
        },
      },
      distinct: ['breed'],
    });

    return breeds.reduce<string[]>((result, {breed}) => {
      if (typeof breed === 'string') {
        result.push(breed);
      }
      return result;
    }, []);
  }

  async searchPets({
    location,
    page,
    limit,
    size,
    breed,
    may_live_with,
    age_min,
    age_max,
    field,
    order,
    ...petFilters
  }: Filters): Promise<SearchPetServiceResponse> {
    // https://github.com/prisma/prisma/issues/7550
    const petWhereClause = {
      organisation: {
        city: location,
      },
      size: {
        in: size,
      },
      breed: {
        in: breed,
      },
      may_live_with: {
        in: may_live_with,
      },
      age: {
        gte: age_min,
        lte: age_max,
      },
      ...petFilters,
    };

    const count = await prisma.pet.count({
      where: petWhereClause,
    });

    const pets = await prisma.pet.findMany({
      where: petWhereClause,
      include: {pet_photos: true},
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        [field]: order,
      },
    });

    return {pets, count};
  }
  async findById(petId: string) {
    const pet = await prisma.pet.findUnique({
      where: {
        id: petId,
      },
      include: {pet_photos: true},
    });
    return pet;
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    data.pet_photos;
    const pet = await prisma.pet.create({
      data,
    });
    return pet;
  }

  async save(data: EditPetInput): Promise<Pet> {
    const pet = await prisma.pet.update({
      where: {
        id: data.id,
      },
      data,
    });
    return pet;
  }

  async delete(pet: Pet): Promise<void> {
    await prisma.pet.delete({
      where: {
        id: pet.id,
      },
    });
  }
}
