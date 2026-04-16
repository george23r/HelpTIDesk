import { User as PrismaUser } from '@prisma/client';

export interface CurrentUser extends Omit<PrismaUser, 'password'> {}
