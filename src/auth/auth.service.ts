import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User, Bookmark } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  //a class  test(){ } o authservice e um objeto de funcoes que eu possoa cessar pelo controler

  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    //generate the password pass
    const hash = await argon.hash(dto.password);
    //save the user in the db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      delete user.hash;

      // return the saved user
      return user;
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Credentials taken',
          );
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // find the user by email
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
    // if user dos not existe throw expection
    if (!user)
      throw new ForbiddenException(
        'Crendentials incorrect',
      );
    //compare password

    const pwMatches = await argon.verify(
      user.hash,
      dto.password,
    );
    //if password incorrect throw  exception
    if (!pwMatches)
      throw new ForbiddenException(
        'Credentials incorrect',
      );
    //send back the user

    delete user.hash;
    return user;
  }
}
