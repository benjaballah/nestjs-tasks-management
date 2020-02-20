import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { Repository, EntityRepository } from "typeorm";
import * as bcrypt from "bcrypt";
import { UserEntity } from "../entity/user.entity";
import { AuthCredentialsDto } from "../dto/auth-credentials.dto";

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
    async singnUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const userEntity = new UserEntity();
        userEntity.username = authCredentialsDto.username;
        userEntity.salt = await bcrypt.genSalt();
        userEntity.password = await this.hashPassword(authCredentialsDto.password, userEntity.salt);

        try {
            await userEntity.save();
        } catch (error) {
            if (error.code === '23505') { // duplicated username
                throw new ConflictException('USER_ALREADY_EXISTS')
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const userEntity = await this.findOne({username: authCredentialsDto.username});

        if (userEntity && await userEntity.validatePassword(authCredentialsDto.password)) {
            return userEntity.username
        } else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}
