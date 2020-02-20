import { Controller, Post, Body, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { JwtSignInInterface } from './interface/jwt.interface';
import { GetUser } from './decorator/get-user.decorator';
import { UserEntity } from './entity/user.entity';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @Post('/signup')
    signUp(
        @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto
    ): Promise<void> {
        return this.authService.singnUp(authCredentialsDto);
    }

    @Post('/signin')
    signIn(
        @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto
    ): Promise<JwtSignInInterface> {
        return this.authService.singnIn(authCredentialsDto);
    }

    @Post('/test')
    @UseGuards(AuthGuard())
    // test(@Req() req) {
    test(@GetUser() user: UserEntity) {
        return user;
    }
}
