'use client'

import {useState} from 'react'
import {Dialog, DialogPanel,} from '@headlessui/react'
import {Bars3Icon, XMarkIcon,} from '@heroicons/react/24/outline'
import MarkLogo from '@/assets/mark.svg'
import {signOut, useSession} from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import UserIcon from "@/assets/user-icon.svg";

export default function Header() {
    const session = useSession();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    if (session.status === 'loading' || session.status === 'unauthenticated') return null;

    const user = session?.data?.user;

    const handleLogout = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        await signOut();
    }

    return (
        <header className="bg-white">
            <nav
                aria-label="Global"
                className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
            >
                <div className="flex lg:flex-1">
                    <Link
                        href="/"
                        className="-m-1.5 p-1.5"
                    >
                        <span className="sr-only">Company Name</span>
                        <MarkLogo
                            className="h-8 w-auto"
                            width={32}
                            height={32}
                        />
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon
                            aria-hidden="true"
                            className="size-6"
                        />
                    </button>
                </div>

                <div className="hidden lg:flex lg:gap-x-12">
                    <Link
                        href="/"
                        className="text-sm/6 font-semibold text-gray-900"
                    >
                        Home
                    </Link>
                </div>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <div className="flex items-center gap-x-2">
                        <div className="w-10 h-10 rounded-full bg-Gray-200 flex items-center justify-center">
                            {user?.image ? <Image
                                src={user?.image}
                                width={40}
                                height={40}
                                alt="avatar"
                                className="rounded-full"
                            /> : <UserIcon />}
                        </div>
                        <span className="text-black font-semibold">
                            {user?.name}
                        </span>
                    </div>

                    <div className="flex items-center gap-x-2 ml-6">
                        <a
                            href="#"
                            className="text-sm/6 font-semibold text-gray-900"
                            onClick={handleLogout}
                        >
                            Logout <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                </div>
            </nav>
            <Dialog
                open={mobileMenuOpen}
                onClose={setMobileMenuOpen}
                className="lg:hidden"
            >
                <div className="fixed inset-0 z-50" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/"
                            className="-m-1.5 p-1.5"
                        >
                            <span className="sr-only">Company Name</span>
                            <MarkLogo
                                className="h-8 w-auto"
                                width={32}
                                height={32}
                            />
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon
                                aria-hidden="true"
                                className="size-6"
                            />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                <Link
                                    href="/"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    Home
                                </Link>
                            </div>
                            <div className="py-6">
                                <a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </a>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}
