import { Disclosure } from "@headlessui/react";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import Button from "../components/base/Buttons/Button";

const navigation = [
  { name: "Explore", href: "/explore", current: true },
  { name: "Governance", href: "/governamce", current: false },
  { name: "Prices", href: "/prices", current: false },
  { name: "Docs", href: "/docs", current: false },
];

const Header = () => {
  return (
    <Disclosure as="nav" className="bg-black">
      {({ open }) => (
        <>
          <div className="container mx-auto px-4">
            <div className="relative flex items-center justify-between py-3">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-emerald-300 hover:text-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <HiX className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <HiOutlineMenu
                      className="block h-6 w-6"
                      aria-hidden="true"
                    />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/">
                    <a>
                      <Image
                        width="40px"
                        height="40px"
                        className="w-auto"
                        src="/logo.png"
                        alt="Kashi Market"
                      />
                    </a>
                  </Link>
                </div>
                {/* <div className="hidden sm:block mx-auto">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link href={item.href} key={item.name}>
                        <a
                          className={classNames(
                            "transition-colors text-white hover:text-emerald-300 px-2 py-2 rounded-md font-medium"
                          )}
                        >
                          {item.name}
                        </a>
                      </Link>
                    ))}
                  </div>
                </div> */}
              </div>
              {/* <div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:ml-6">
                <Button rounded="sm">App</Button>
              </div> */}
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            {/* <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    "text-gray-300 hover:bg-emerald-400 hover:text-white transition-colors",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div> */}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
