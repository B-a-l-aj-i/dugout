"use client";
import React, { useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserContext, UsersContext } from "@/context/user";

function SidebarFilter({ members }) {
  // console.log(members);
  const filteredItemsArray = members?.filter(
    (user) =>
      user.real_name !== "Dugout" &&
      user.real_name !== "Slackbot" &&
      user.real_name,
  );

  const { users, setUsers } = UsersContext();

  useEffect(() => {
    setUsers(members);
  }, []);
  console.log(users);

  const { user, setUser } = UserContext();

  return (
    <div>
      <SidebarProvider defaultOpen={false}>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>
                <div>Users</div>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className="p-2 focus:bg-slate-300"
                      onClick={() => setUser("")}
                    >
                      All
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {filteredItemsArray?.map((userInfo, key) => (
                    <SidebarMenuItem key={key}>
                      <SidebarMenuButton
                        className="p-2 focus:bg-slate-200"
                        onClick={() => setUser(userInfo.id)}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            className="h-6 w-6 rounded-2xl"
                            src={userInfo?.profile.image_24}
                            alt="User Avatar"
                          />
                          <p>{userInfo.real_name}</p>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main>
          {<SidebarTrigger className="fixed top-1 z-10 bg-slate-50" />}
        </main>
      </SidebarProvider>
    </div>

    // <div className="fixed z-10">
    //   <SidebarProvider>
    //     <Sidebar>
    //       <SidebarContent>
    //         <SidebarGroup>
    //           <SidebarGroupLabel className="flex justify-between">
    //             <div>Users</div>
    //             <main>{<SidebarTrigger className="text-black" />}</main>
    //           </SidebarGroupLabel>
    //           <SidebarGroupContent>
    //             <SidebarMenu>
    //               <SidebarMenuItem>
    //                 <SidebarMenuButton
    //                   className="focus:bg-slate-300"
    //                   onClick={() => setUser("")}
    //                 >
    //                   All
    //                 </SidebarMenuButton>
    //               </SidebarMenuItem>

    //               {filteredItemsArray?.map((userInfo, key) => {
    //                 // console.log(userInfo);
    //                 return (
    //                   <SidebarMenuItem key={key}>
    //                     <SidebarMenuButton
    //                       className="focus:bg-slate-200"
    //                       onClick={() => setUser(userInfo.id)}
    //                     >
    //                       <div className="flex gap-2">
    //                         <img
    //                           className="rounded-2xl"
    //                           src={userInfo?.profile.image_24}
    //                         />
    //                         <p>{userInfo.real_name}</p>
    //                       </div>
    //                     </SidebarMenuButton>
    //                   </SidebarMenuItem>
    //                 );
    //               })}
    //             </SidebarMenu>
    //           </SidebarGroupContent>
    //         </SidebarGroup>
    //       </SidebarContent>
    //     </Sidebar>
    //     <main>{<SidebarTrigger className="absolute left-0 py-6" />}</main>
    //   </SidebarProvider>
    // </div>
  );
}

export default SidebarFilter;
