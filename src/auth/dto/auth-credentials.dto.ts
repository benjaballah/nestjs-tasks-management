import { IsNotEmpty, IsString, MinLength, MaxLength, Matches } from "class-validator";

export class AuthCredentialsDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    /**
     * Passwords will contain at least 1 upper case letter
     * Passwords will contain at least 1 lower case letter
     * Passwords will contain at least 1 number or special character
     * There is no length validation (min, max) in this regex!
     */
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        {
            message: `Passwords will contain at least 1: upper case letter, lower case letter, number or special character`
        }
    )
    password: string;
}
