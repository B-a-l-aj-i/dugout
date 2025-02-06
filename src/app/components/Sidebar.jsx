"use client";
import React, { useState, useEffect } from "react";
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

function SidebarFilter() {
  const [loading, setLoading] = useState(true);
  const [filteredItemsArray, setFilteredItemsArray] = useState([]);

  useEffect(() => {
    // Simulate a fetch operation with a delay
    setTimeout(() => {
      const itemsArray = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        const real_name = JSON.parse(value)?.data?.user?.real_name;
        const id = JSON.parse(value)?.data?.user?.id;
        itemsArray.push({
          real_name,
          id,
        });
      }

      const filteredItemsArray = itemsArray.filter(
        (user) =>
          user.real_name !== "Dugout" &&
          user.real_name !== "Slackbot" &&
          user.real_name,
      );

      setFilteredItemsArray(filteredItemsArray);
      setLoading(false);
    }, 2000);
  }, []);

  const { user, setUser } = UserContext();

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
                    <SidebarMenuButton onClick={() => setUser("")}>
                      All
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {filteredItemsArray.map((userInfo, key) => {
                    if (loading) {
                      return <div>Loading...</div>;
                    }
                    return (
                      <SidebarMenuItem key={key}>
                        <SidebarMenuButton onClick={() => setUser(userInfo.id)}>
                          <span>{userInfo.real_name}</span>
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
