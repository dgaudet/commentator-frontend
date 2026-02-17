/**
 * Type declaration for auth0-lock v14.2.4
 * Provides types for the Auth0 Lock widget
 */

declare module 'auth0-lock' {
  interface Auth0LockOptions {
    auth?: {
      redirectUrl?: string
      responseType?: 'code' | 'token' | 'id_token' | 'id_token token'
      scope?: string
      audience?: string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any
    }
    theme?: {
      primaryColor?: string
      logo?: string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any
    }
    container?: string
    allowedConnections?: string[]
    allowSignUp?: boolean
    allowForgotPassword?: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }

  interface Auth0LockCallbacks {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error: any, profile: any, id_token: any): void
  }

  interface Auth0LockSessionOptions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }

  interface Auth0LockSessionCallback {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error: any, result: any): void
  }

  interface Auth0LockInstance {
    show(): void
    hide(): void
    destroy(): void
    on(event: string, callback: Auth0LockCallbacks): void
    checkSession(options: Auth0LockSessionOptions, callback: Auth0LockSessionCallback): void
  }

  class Auth0Lock implements Auth0LockInstance {
    constructor(clientId: string, domain: string, options?: Auth0LockOptions)
    show(): void
    hide(): void
    destroy(): void
    on(event: string, callback: Auth0LockCallbacks): void
    checkSession(options: Auth0LockSessionOptions, callback: Auth0LockSessionCallback): void
  }

  export default Auth0Lock
}
