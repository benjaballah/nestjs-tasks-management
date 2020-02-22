import { ConflictException, InternalServerErrorException, Logger } from "@nestjs/common";
import { Repository, EntityRepository } from "typeorm";
import * as bcrypt from "bcrypt";
import { UserEntity } from "../entity/user.entity";
import { AuthCredentialsDto } from "../dto/auth-credentials.dto";

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
    private logger = new Logger('UserRepository');

    async singnUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const userEntity = new UserEntity();
        userEntity.username = authCredentialsDto.username;
        userEntity.salt = await bcrypt.genSalt();
        userEntity.password = await this.hashPassword(authCredentialsDto.password, userEntity.salt);

        try {
            await userEntity.save();
        } catch (error) {
            if (error.code === '23505') { // duplicated username
                throw new ConflictException('USERNAME_ALREADY_EXISTS')
            } else {
                this.logger.error(`[singnUp] data ${JSON.stringify(authCredentialsDto)}`, error.stack);
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        try {
            const userEntity = await this.findOne({username: authCredentialsDto.username});

            if (userEntity && await userEntity.validatePassword(authCredentialsDto.password)) {
                return userEntity.username
            } else {
                return null;
            }
        } catch (error) {
            this.logger.error(`[validateUserPassword] data ${JSON.stringify(authCredentialsDto)}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}
