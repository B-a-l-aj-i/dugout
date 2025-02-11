"use client";
import React from "react";
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
import { UserContext } from "@/context/user";

function SidebarFilter({ members }) {
  console.log(members);
  const filteredItemsArray = members?.filter(
    (user) =>
      user.real_name !== "Dugout" &&
      user.real_name !== "Slackbot" &&
      user.real_name,
  );

  const { user, setUser } = UserContext();
  // console.log(user);

  return (
    <div className="fixed">
      <SidebarProvider>
        <Sidebar>
          <SidebarContent className="pt-20">
            <SidebarGroup>
              <SidebarGroupLabel>Users</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className="focus:bg-slate-300"
                      onClick={() => setUser("")}
                    >
                      All
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {filteredItemsArray?.map((userInfo, key) => {
                    return (
                      <SidebarMenuItem key={key}>
                        <SidebarMenuButton
                          className="focus:bg-slate-200"
                          onClick={() => setUser(userInfo.id)}
                        >
                          <div className="flex gap-2">
                            <img
                              className="rounded-2xl"
                              src={userInfo?.profile.image_24}
                            />
                            <p>{userInfo.real_name}</p>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main>
          <SidebarTrigger />
        </main>
      </SidebarProvider>
    </div>
  );
}

export default SidebarFilter;
