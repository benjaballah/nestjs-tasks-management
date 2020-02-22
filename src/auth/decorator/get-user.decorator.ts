import { createParamDecorator } from "@nestjs/common";
import { UserEntity } from "../entity/user.entity";

export const GetUserDecorator = createParamDecorator((data, req): UserEntity => {
    return req.user;
});