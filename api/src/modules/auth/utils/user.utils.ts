import { User } from '@/generated/prisma';

export type PublicUser = Omit<User, 'password'>;

export function to_public_user(user: User): PublicUser {
    const { password: _password, ...public_user } = user;
    return public_user;
}
