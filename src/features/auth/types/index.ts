export type Credentials = {
  username: string
  password: string
}

export type AuthUser = {
  id: string
  name: string
  email: string
  avatar?: string
}

export type SignInResponse = {
  token: string
  user: AuthUser
}
