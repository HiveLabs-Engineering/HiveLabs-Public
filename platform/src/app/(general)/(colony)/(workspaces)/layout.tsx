"use client";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";
import Intercom from '@intercom/messenger-js-sdk';
import { Sidebar } from "~/app/components/Sidebar";
import { LayoutContext } from "../../../(root)/props/UserContext";
import { GroupContext } from "../../../(root)/props/GroupContext";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator } from "~/app/components/ui/breadcrumb";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/app/_components/ui/dropdown-menu";
import { Cog6ToothIcon, ArrowLeftEndOnRectangleIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

import { api } from "~/trpc/react";

import * as Castle from "@castleio/castle-js"


import { InvalidPermissions } from "~/app/components/(general)/SecurityGuards/security.unauth";
import { PaymentRequired } from "~/app/components/(general)/SecurityGuards/security.inactive";
import { WorkspaceDisabled } from "~/app/components/(general)/SecurityGuards/security.disabled";

interface ClientLayoutProps {
    children: React.ReactNode;
}

interface User {
    userId: string;
    email: string;
    username: string;
}

interface GroupData {
    id: string;
    name: string;
    disabled: boolean;
    payment_required: boolean;
    customisation: { color: string, wallpaper: string };
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    const user = useContext(LayoutContext) as User | null;
    const data = useContext(GroupContext) as GroupData | null;

    const [castletoken, setCastleToken] = useState("");

 


    if (!data) {
        return (
            <LoadingScreen user={user} />
        );
    }

    if (data.disabled) {
        Intercom({
            app_id: 'na5gvzp0',
            email: user?.email,
            name: user?.username,
            user_id: user?.userId,
            avatar: {
                type: "avatar",
                image_url: `https://platform.hivelabs.app/api/avatar?userIds=${user?.userId}&size=180x180&format=png`
            }
        })
        return (
            <MainLayout data={data} user={user}>
                <WorkspaceDisabled />
            </MainLayout>
        );
    }

    Intercom({
        app_id: 'na5gvzp0',
        email: user?.email,
        name: user?.username,
        user_id: user?.userId,
        horizontal_padding: 50,
        vertical_padding: 50,
        avatar: {
            type: "avatar",
            image_url: `https://platform.hivelabs.app/api/avatar?userIds=${user?.userId}&size=180x180&format=png`
        }
    })

    return (
        <MainLayout data={data} user={user}>
            {data.payment_required ? <PaymentRequired /> : children}
        </MainLayout>
    );
}

interface LoadingScreenProps {
    user: User | null;
}

function LoadingScreen({ user }: LoadingScreenProps) {
    return (
        <div className="flex h-screen items-center justify-center lg:p-10 xl:p-10 bg-black">
            <div className="flex w-full max-h-full overflow-hidden lg:rounded-lg xl:rounded-xl bg-zinc-50 dark:bg-[#141414] shadow-lg">
                <Sidebar />
                <div className="flex flex-col w-full">
                    <div className="flex items-center justify-between p-3">
                        <div>
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className="text-zinc-500 dark:text-white">...</BreadcrumbPage>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className="text-zinc-600 dark:text-white">Welcome</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <div className="flex items-center">
                            <img className="object-cover w-8 h-8 rounded-full mr-3 bg-zinc-200 dark:bg-[#2e2e2e]" src={`/api/avatar?userIds=${!user?.userId ? "1" : user?.userId}&size=180x180&format=png`} alt="" />
                        </div>
                    </div>
                    <div className="flex-grow overflow-y-auto p-3">
                        <div className="flex items-center justify-center center">
                            <div role='status' aria-label='loading'>
                                <LoadingSpinner />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LoadingSpinner() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 2400" width="20" height="20"><g stroke-width="200" stroke-linecap="round" stroke="#b1b1b1" fill="none"><path d="M1200 600V100" /><path opacity=".5" d="M1200 2300v-500" /><path opacity=".917" d="M900 680.4l-250-433" /><path opacity=".417" d="M1750 2152.6l-250-433" /><path opacity=".833" d="M680.4 900l-433-250" /><path opacity=".333" d="M2152.6 1750l-433-250" /><path opacity=".75" d="M600 1200H100" /><path opacity=".25" d="M2300 1200h-500" /><path opacity=".667" d="M680.4 1500l-433 250" /><path opacity=".167" d="M2152.6 650l-433 250" /><path opacity=".583" d="M900 1719.6l-250 433" /><path opacity=".083" d="M1750 247.4l-250 433" /><animateTransform attributeName="transform" attributeType="XML" type="rotate" keyTimes="0;0.08333;0.16667;0.25;0.33333;0.41667;0.5;0.58333;0.66667;0.75;0.83333;0.91667" values="0 1199 1199;30 1199 1199;60 1199 1199;90 1199 1199;120 1199 1199;150 1199 1199;180 1199 1199;210 1199 1199;240 1199 1199;270 1199 1199;300 1199 1199;330 1199 1199" dur="0.83333s" begin="0s" repeatCount="indefinite" calcMode="discrete" /></g></svg>
    );
}

interface MainLayoutProps {
    data: GroupData;
    user: User | null;
    children: React.ReactNode;
}

function MainLayout({ data, user, children }: MainLayoutProps) {
    return (
        <div
            className={`flex h-screen items-center justify-center xl:p-10 bg-zinc-950 bg-cover bg-center bg-no-repeat`}
            style={{ backgroundImage: `url(${data.customisation.wallpaper})` }}
        >
            <div className="flex w-full max-h-full overflow-hidden lg:rounded-lg xl:rounded-xl bg-zinc-50 dark:bg-[#141414] shadow-lg">
                <Sidebar />
                <div className="flex flex-col w-full">
                    <div className="flex items-center justify-between p-3">
                        <div>
                            <Breadcrumb className="ml-2">
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className="text-zinc-500 dark:text-white">{!data ? "..." : data.name}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className="text-zinc-600 dark:text-white">Onboarding</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <div className="flex items-center">
                            <UserMenu user={user} data={data} />
                        </div>
                    </div>
                    <div className="flex-grow overflow-y-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );

}

interface UserMenuProps {
    user: User | null;
    data: GroupData;
}

function UserMenu({ user, data }: UserMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-hidden ring-0">
                <img className="outline-hidden ring-0 w-8 h-8 rounded-full bg-zinc-200 dark:bg-[#2e2e2e]" src={`/api/avatar?userIds=${!user?.userId ? "1" : user?.userId}&size=180x180&format=png`} alt="" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="left" className="mt-11 dark:bg-zinc-900 dark:border-zinc-800">
                <DropdownMenuItem className="flex items-center font-medium text-zinc-700 dark:text-white">
                    <button className="flex items-center font-medium text-zinc-700 dark:text-white">
                        <Cog6ToothIcon className="h-4 w-4 mr-1" /> Account Settings
                    </button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link className="flex items-center font-medium text-rose-700 dark:text-rose-500" href={`/${data?.id}/settings`}>
                        <ArrowLeftEndOnRectangleIcon className="h-4 w-4 mr-1 text-rose-700 dark:text-rose-500" /> Leave HiveLabs
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
