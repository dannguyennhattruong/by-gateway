import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ByAccountDto } from './by-auth-dto/by-account-dto';

const fakeUsers = [
  { id: 1, username: 'kan', password: 'kan' },
  { id: 2, username: 'vi', password: 'vi' },
];

@Injectable()
export class ByAuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateAccount({ username, password }: ByAccountDto): Promise<any> {
    // TODO will improve to check with redis + db later
    const foundUser = fakeUsers.find((user) => user.username === username);
    if (!foundUser) return null;

    if (password === foundUser.password) {
      const { password, ...user } = foundUser;
      console.debug('password: ', password);
      return this.jwtService.sign(user);
    }
    // return {
    //   username: username,
    //   password: password,
    // };
  }

  // async issueToken(account: any, expireTime?: number | string) {
  //   const payload = {
  //     address: account.address,
  //     nonce: account.nonce,
  //     status: account.status,
  //     chain: account?.chain,
  //     refreshToken: account?.refreshToken,
  //   };
  //   const options = {};
  //   if (expireTime) {
  //     options[`expiresIn`] = expireTime;
  //   }
  //   return this.jwtService.sign(payload, { ...options });
  // }

  // decodeToken(_accessToken: string) {
  //   return this.jwtService.decode(_accessToken);
  // }

  // async signTokenAdmin(user: any) {
  //   return this.jwtService.sign(user);
  // }
}
