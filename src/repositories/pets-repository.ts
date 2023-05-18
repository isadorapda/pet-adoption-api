import { Pet, Prisma } from '@prisma/client'
import { Filters } from '@/http/controllers/pets/search-pet.controller'

export interface PetsRepository{
    create(data:Prisma.PetUncheckedCreateInput):Promise<Pet>
    searchPets(filters: Filters): Promise<Pet[]>
    findById(petId:string):Promise<Pet | null>
}