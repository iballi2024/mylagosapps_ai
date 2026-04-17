export const IS_PRODUCTION = process.env.NEXT_PUBLIC_APP_ENV === 'production'
export const IS_DEVELOPMENT = !IS_PRODUCTION

export const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV ?? 'development'
