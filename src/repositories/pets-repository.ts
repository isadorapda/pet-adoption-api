import { Pet, Prisma } from '@prisma/client'

export interface PetsRepository{
    create(data:Prisma.PetUncheckedCreateInput):Promise<Pet>
    findAllByLocation(location:string): Promise<Pet[]>
    findById(petId:string):Promise<Pet | null>
}