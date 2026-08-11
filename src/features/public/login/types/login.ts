export type Credentials = {
  username: string
  password: string
}

export type Company = {
  id: string
  name: string
  industryKey: string
}

export type Plan = {
  id: string
  nameKey: string
  expiresAt: string
}

export type AuthUser = {
  id: string
  name: string
  email: string
  avatar?: string
  company: Company
  plan: Plan
}

export type SignInResponse = {
  token: string
  user: AuthUser
}
