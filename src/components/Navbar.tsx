"use client"
import { useSession,signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import {User}   from 'next-auth'
import { Button } from '@/components/ui/button'

const page = () => {
    const {data:session} = useSession();
    const user:User = session?.user as User;
    

  return (
    <nav>
        <div className='container mx-auto flex justify-between items-center py-4'>
            <a className='text-2xl font-bold capitalize' href="#">teaback</a>
            {
                session ? (
                    <>
                    <span>Welcome,{user.username || 'Guest'} </span>
                    <Button onClick={() => signOut()}>log Out</Button>
                    </>
                ) : (
                    <Link href="/login">
                        <Button>Sign In</Button>
                    </Link>
                )
            }
        </div>
    </nav>
  )
}

export default page
