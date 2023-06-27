export interface EnvConfig {
    NAVER_CLIENT_ID?: string;
    NAVER_CLIENT_SECRET?: string;
    NAVER_CALLBACK_URL?: string;

    JWT_ACCESS_TOKEN_SECRET?: string;
    JWT_ACCESS_TOKEN_EXPIRRED_TIME?: string;

    JWT_REFRESH_TOKEN_SECRET?: string;
    JWT_REFRESH_TOKEN_EXPIRRED_TIME?: string;
}
