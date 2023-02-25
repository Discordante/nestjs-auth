import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Auth } from '../decorators/auth.decorator';
import { GoogleTokenDto } from '../dto/google-token.dto';
import { SignInResponseDto } from '../dto/sign-in-response.dto';
import { AuthType } from '../enums/auth-type.enum';
import { GoogleAuthenticationService } from './google-authentication.service';

@Auth(AuthType.None)
@ApiTags('Authentication')
@Controller('authentication')
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthService: GoogleAuthenticationService,
  ) {}

  @ApiOkResponse({
    description: 'Google JWT token has been accepted',
    type: SignInResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Gets access and refresh tokens via google Oauth',
    description:
      'Google transfers the data of the registered person and generates a token which, after validation, gives access to the tokens of the application.',
  })
  @Post('google')
  authenticate(@Body() tokenDto: GoogleTokenDto): Promise<SignInResponseDto> {
    return this.googleAuthService.authenticate(tokenDto.token);
  }
}
