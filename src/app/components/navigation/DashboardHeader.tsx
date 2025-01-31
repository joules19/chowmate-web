import React, { useContext } from "react";
import luxevilleLogo from "./../../assets/images/luxeville_gray_logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/20/solid";

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const navigation = [
  { name: "Overview", href: "/dashboard", current: true },
  { name: "Rooms", href: "/admin/room", current: false },
  { name: "Guestlist", href: "/admin/guestlist", current: false },
  { name: "History", href: "#", current: false },
  { name: "Feedback", href: "#", current: false },
];
const userNavigation = [
  { name: "Settings", href: "#" },
  { name: "Log out", href: "#" },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminHeader() {
  const navigate = useNavigate();
  return (
    <Disclosure as="nav" className="">
      {({ open }) => (
        <React.Fragment>
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[100px] shadow-sm">
            <div className="flex w-full h-[80px] justify-between ">
              <div className="flex  w-full justify-between">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div
                  onClick={() => navigate("/admin/dashboard")}
                  className=" flex flex-shrink-0 items-center cursor-pointer"
                >
                  <div className=" flex self-center justify-center items-center h-[80px] w-[80px] sm:h-[80px] sm:w-[80px]">
                    <img
                      className="w-[49px] h-[35px] sm:w-[70px] sm:h-[45px] bg-cover"
                      src={luxevilleLogo}
                      alt="Luxeville Logo"
                    />
                  </div>
                </div>
                <div className="hidden  md:flex md:items-center md:space-x-4">
                  {navigation.map((item) => (
                    <Link
                      onClick={() => {
                        navigation.forEach((x) => (x.current = false));
                        item.current = true;
                      }}
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        item.current
                          ? "bg-primary-1 text-white"
                          : "text-black hover:bg-[#9AAABE] hover:text-white",
                        "px-3 py-2 rounded-md text-sm font-normal"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                <div className=" flex items-center">
                  <div className="flex w-[100px] md:w-[125px] h-[42px]">
                    <button
                      type="button"
                      className="relative inline-flex items-center rounded-md border border-transparent bg-primary-1 px-2 py-2 text-sm font-regular text-white hover:bg-[#9AAABE] hover:text-white"
                    >
                      <PlusIcon
                        className="-ml-1 mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                      <span>Add a room</span>
                    </button>
                  </div>
                  <div className="hidden  md:flex md:flex-shrink-0 md:items-center">
                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="relative inline-flex justify-between gap-3 items-center rounded-md border bg-transparent px-2 py-2 text-sm font-medium text-gray-3 shadow-sm border-1 border-[#EOEOEO] focus:outline-none">
                          <span className="flex justify-center items-center w-[24px] h-[24px] bg-[#131364] text-white rounded-full">
                            A
                          </span>
                          <span className="sr-only">Open user menu</span>
                          <span>Admin</span>
                          <ChevronDownIcon
                            className="ml-2 h-5 w-5"
                            aria-hidden="true"
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <a
                                  href={item.href}
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  {item.name}
                                </a>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-gray-700 pt-4 pb-3">
              <div className="flex items-center px-5 sm:px-6">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user.imageUrl}
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">
                    {user.name}
                  </div>
                  <div className="text-sm font-medium text-gray-400">
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-2 sm:px-3">
                {userNavigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </div>
          </Disclosure.Panel>
        </React.Fragment>
      )}
    </Disclosure>
  );
}
