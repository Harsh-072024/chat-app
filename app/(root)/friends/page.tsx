"use client"
 
import React from 'react'
import ItemList from '@/components/shared/item-list/ItemList' 
import ConversationFallback from '@/components/shared/conversation/ConversationFallback'
import AddFriendDialog from './_components/AddFriendDialog'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Loader2 } from 'lucide-react'
import Request from './_components/Request'
type Props = {}

const FriendsPage = (props: Props) => {
  const requests = useQuery(api.requests.get)
  return (
    <div className='flex gap-4 w-full'>
      <ItemList title='Friends' action={<AddFriendDialog />}>{requests?requests.length === 0 ? (<p className='w-full h-full flex items-center'>No friend requests found</p>):(
        requests.map((request) => {
          return (
            <Request 
            key={request.request._id}
            id={request.request._id}
            imageUrl={request.sender.imageUrl}
            username={request.sender.username}
            email={request.sender.email}
            />
          )
        })
      ) :<Loader2  className='animate-spin'/>}</ItemList>
      <ConversationFallback />
    </div>
  )
}

export default FriendsPage
