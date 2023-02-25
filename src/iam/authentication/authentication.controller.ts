import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators/auth.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthType } from './enums/auth-type.enum';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { SignUpResponseDto } from './dto/sign-up-response.dto';
import { ActiveUser } from '../decorators/active-user.decorator';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { OtpAuthenticationService } from './otp-authentication.service';
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import { SignInTokensDto } from './dto/tokens.dto';

@Auth(AuthType.None)
@ApiTags('Authentication')
@ApiBadRequestResponse({ description: 'Data submitted is not correct' })
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly otpAuthService: OtpAuthenticationService,
  ) {}

  @ApiCreatedResponse({
    description: 'User has registered successfully',
    type: SignUpResponseDto,
  })
  @ApiConflictResponse({ description: 'Email already used' })
  @ApiOperation({
    summary: 'Register new user',
    description:
      'Register a new user in the application so that he/she has access to the protected resources',
  })
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    return this.authService.signUp(signUpDto);
  }

  @ApiOkResponse({
    description: 'The user has been successfully signed in',
    type: SignInResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Email not found' })
  @ApiUnauthorizedResponse({ description: 'Incorrect password' })
  @ApiOperation({
    summary: 'Authenticates a user',
    description:
      'Checks the credentials of an existing user to ensure that the user is who he/she claims to be. If the credentials are correct, the access and refresh tokens are returned. The access token needs to be renewed from time to time due to its expiry date.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto): Promise<SignInResponseDto> {
    return this.authService.signIn(signInDto);
  }

  @ApiOkResponse({
    description: 'Refresh token has been accepted',
    type: SignInResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtain a new access and refresh token',
    description:
      'Since the access token expires from time to time, it is necessary to obtain a new token in order to access the protected resources. This endpoint grants a new refresh and access token once it has validated that the refresh token sent is correct.',
  })
  @Post('refresh-tokens')
  refreshTokens(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<SignInTokensDto> {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  @ApiBearerAuth()
  @Auth(AuthType.Bearer)
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiResponse({
    schema: {
      type: 'string',
      format: 'binary',
    },
    status: HttpStatus.OK,
  })
  @ApiOperation({
    summary: 'Generate a QR code for OTP',
    description:
      'Generates a qr code to activate two-step authentication with an app (Authy, Microsoft Authenticator, etc).',
  })
  @ApiProduces('image/png')
  @Post('2fa/generate')
  async generateQrCode(
    @ActiveUser() activeUser: ActiveUserData,
    @Res() response: Response,
  ) {
    const { secret, uri } = await this.otpAuthService.generateSecret(
      activeUser.email,
    );
    await this.otpAuthService.enableTfaForUser(activeUser.email, secret);
    response.type('png');
    return toFileStream(response, uri);
  }
}
