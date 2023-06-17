import { Pet, Prisma } from '@prisma/client'
import { Filters } from '@/http/controllers/pets/search-pet.controller'
import { EditPetInput } from '@/types/organisation'

export interface PetsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
  searchPets(filters: Filters): Promise<{ pets: Pet[], count: number }>
  findById(petId: string): Promise<Pet | null>
  delete(pet: Pet): Promise<void>
  save(data: EditPetInput): Promise<Pet>
}