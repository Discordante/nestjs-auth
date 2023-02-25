import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OtpAuthenticationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async generateSecret(email: string) {
    const secret = authenticator.generateSecret();
    const appName = this.configService.getOrThrow('TFA_APP_NAME');
    const uri = authenticator.keyuri(email, appName, secret);
    return {
      uri,
      secret,
    };
  }

  verifyCode(code: string, secret: string) {
    return authenticator.verify({
      token: code,
      secret,
    });
  }

  async enableTfaForUser(email: string, secret: string) {
    const { id } = await this.prisma.user.findUniqueOrThrow({
      where: { email },
      select: { id: true },
    });

    // TIP: Ideally, we would want to encrypt the "secret" instead of
    // storing it in a plaintext. Note - we couldn't use hashing here as
    // the original secret is required to verify the user's provided code.

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        tfaSecret: secret,
        isTfaEnabled: true,
      },
    });
  }
}
