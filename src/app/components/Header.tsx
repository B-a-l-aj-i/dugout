'use client'

import { signIn, signOut } from "next-auth/react";

interface IUserProps {
  id: string;
  name: string;
  image: string;
}

function Header({ user } : { user: IUserProps}) {
    return (
      <header className="fixed top-0 bg-white mt-0 flex justify-around items-center w-[100vw]">
        {/* <div > */}
        <div>
          <h1 className="font-bold text-4xl mb-4">Dugout</h1>
        </div>
        <div>
          
          {user &&
            <div className="flex gap-2"> 
              <p>{user.name}</p>
              <button onClick={() => signOut()} className="p-1 bg-black text-white"> sign Out</button>
              </div>
            || <button onClick={() => signIn()} className="p-1 bg-black text-white">
          Sign In
        </button>}
        </div>
       {/* </div> */}
      </header>
    );
  }
  
  export default Header;
  