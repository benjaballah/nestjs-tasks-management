import { Controller, Post, Body, ValidationPipe, UseGuards, Req, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { JwtSignInInterface } from './interface/jwt.interface';
import { GetUserDecorator } from './decorator/get-user.decorator';
import { UserEntity } from './entity/user.entity';

@Controller('auth')
export class AuthController {
    private logger = new Logger('AuthController');

    constructor(
        private authService: AuthService
    ) {}

    @Post('/signup')
    signUp(
        @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto
    ): Promise<void> {
        this.logger.verbose(`[signUp] authCredentialsDto: ${JSON.stringify(authCredentialsDto)}`);
        return this.authService.singnUp(authCredentialsDto);
    }

    @Post('/signin')
    signIn(
        @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto
    ): Promise<JwtSignInInterface> {
        this.logger.verbose(`[signIn] authCredentialsDto: ${authCredentialsDto}`);
        return this.authService.singnIn(authCredentialsDto);
    }

    @Post('/test')
    @UseGuards(AuthGuard())
    // test(@Req() req) {
    test(@GetUserDecorator() user: UserEntity) {
        this.logger.verbose(`[test] user: ${user}`);
        return user;
    }
}
