import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayloadInterface } from '../interface/jwt.interface';
import { UserRepository } from '../repository/user.repository';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromHeader('token'),
            secretOrKey: 'topSecretJwt'
        });
    }

    async validate(payload: JwtPayloadInterface): Promise<UserEntity> {
        const user = await this.userRepository.findOne({username: payload.username});

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
