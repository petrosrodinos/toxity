import { randomBytes, randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

const TOKEN_BYTES = 32;
const BCRYPT_ROUNDS = 10;

export function generate_plain_token(): string {
    return randomBytes(TOKEN_BYTES).toString('hex');
}

/** Returns `{lookup_id}.{secret}` for DB lookup + bcrypt verification */
export function generate_lookup_token(): { lookup_id: string; plain_token: string } {
    const lookup_id = randomUUID();
    const secret = randomBytes(TOKEN_BYTES).toString('hex');
    return { lookup_id, plain_token: `${lookup_id}.${secret}` };
}

export function parse_lookup_token(plain_token: string): { lookup_id: string; secret: string } | null {
    const dot_index = plain_token.indexOf('.');
    if (dot_index === -1) return null;
    return {
        lookup_id: plain_token.slice(0, dot_index),
        secret: plain_token.slice(dot_index + 1),
    };
}

export async function hash_token(plain_token: string): Promise<string> {
    return bcrypt.hash(plain_token, BCRYPT_ROUNDS);
}

export async function verify_token(plain_token: string, token_hash: string): Promise<boolean> {
    return bcrypt.compare(plain_token, token_hash);
}

export function token_expires_at(hours: number): Date {
    return new Date(Date.now() + hours * 60 * 60 * 1000);
}
