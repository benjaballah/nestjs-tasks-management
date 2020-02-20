import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './repository/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayloadInterface, JwtSignInInterface } from './interface/jwt.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    async singnUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.singnUp(authCredentialsDto);
    }

    async singnIn(authCredentialsDto: AuthCredentialsDto): Promise<JwtSignInInterface> {
        const username = await this.userRepository.validateUserPassword(authCredentialsDto);

        if (!username) {
            throw new UnauthorizedException('Invalid credentials !');
        }

        const payload: JwtPayloadInterface = { username };
        const accessToken = this.jwtService.sign(payload);

        return {username, accessToken};
    }
}
