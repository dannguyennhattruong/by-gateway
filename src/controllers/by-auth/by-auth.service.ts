import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ByAuthService {
    constructor(
        private readonly jwtService: JwtService
    ) {
    }

    async validateAccount(payload): Promise<any> {
        // TODO will improve to check with redis + db later
        return {
            address: payload.address,
            nonce: payload.nonce
        }
    }

    async issueToken(account: any, expireTime?: number | string) {
        const payload = { address: account.address, nonce: account.nonce, status: account.status, chain: account?.chain, refreshToken : account?.refreshToken };
        const options = {};
        if (expireTime) {
            options[`expiresIn`] = expireTime;
        }
        return this.jwtService.sign(payload, { ...options });
    }

    decodeToken(_accessToken: string) {
        return this.jwtService.decode(_accessToken);
    }

    async signTokenAdmin(user: any) {
        return this.jwtService.sign(user);
    }
}
