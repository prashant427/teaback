import "next-auth"

declare module "next-auth" {
  interface User {
    _id?: string,
    isVerified?: boolean,
    isAcceptMsg?: boolean,
    username?: string,
  }
    interface Session {
        user: {
            _id?: string,
            isVerified?: boolean,
            isAcceptMsg?: boolean,
            username?: string,
        } & DefaultSession["user"]
    }
    interface JWT {
        id?: string,
        isVerified?: boolean,
        isAcceptMsg?: boolean,
        username?: string,
    }
} 
