import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next'
import { User, getServerSession } from 'next-auth'
import { authOption } from './auth'

export const session = async ({ session, token }: any) => {
  session.user.id = token.id
  session.user.role = token.role
  return session
}

export const getUserSession = async (): Promise<User> => {
  const authUserSession = await getServerSession({
    callbacks: {
      session,
    },
  })
  // if (!authUserSession) throw new Error('unauthorized')
  return authUserSession?.user
}

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOption)
}


