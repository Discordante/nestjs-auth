import {
  ConflictException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthenticationService } from '../authentication.service';
import { SignInResponseDto } from '../dto/sign-in-response.dto';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthenticationService,
    private readonly prisma: PrismaService,
  ) {}

  onModuleInit() {
    const clientId = this.configService.get('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  async authenticate(token: string): Promise<SignInResponseDto> {
    try {
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: token,
      });
      const { email, sub: googleId } = loginTicket.getPayload();

      const user = await this.prisma.user.findUnique({
        where: { googleId },
      });

      if (user) {
        return {
          userId: user.id,
          ...(await this.authService.generateTokens(user)),
        };
      } else {
        const newUser = await this.prisma.user.create({
          data: {
            email,
            googleId,
          },
        });

        return {
          userId: user.id,
          ...(await this.authService.generateTokens(newUser)),
        };
      }
    } catch (e) {
      {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === '23505'
        ) {
          throw new ConflictException();
        }
        throw new UnauthorizedException();
      }
    }
  }
}
