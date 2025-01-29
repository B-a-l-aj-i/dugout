import React from 'react'
import UserDetails from './UserDetails'

function ThreadMesssage({userInfo}) {
  return (
     <div className={`p-4 border-2 rounded-md mb-4`}>
      <UserDetails userId={userInfo.user} timestamp={userInfo.ts}/>
        <p>{userInfo.text}</p>
    </div>                   
  )
}

export default ThreadMesssage;