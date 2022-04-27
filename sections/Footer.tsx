import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import Button from "../components/base/Buttons/Button";

const LinkItem = ({
  href,
  children,
}: {
  href: string;
  children?: ReactNode;
}) => (
  <Link href={href}>
    <a className="inline-block py-3 text-gray-400 hover:text-emerald-300">
      {children}
    </a>
  </Link>
);

const Footer = () => {
  return (
    <div className="bg-black">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-6 gap-4 text-white py-8">
          <div className="col-span-6 sm:col-span-1">
            <Link href="/">
              <a className="flex items-center">
                <Image
                  src="/logo.png"
                  width="40px"
                  height="40px"
                  alt="Kashi Market"
                />
                <span className="ml-2 sm:hidden">Kashi Market</span>
              </a>
            </Link>
          </div>
          <div className="col-span-6 sm:col-span-4">
            <div className="grid grid-cols-2 sm:grid-cols-3">
              <div className="col-span-1 mt-4 sm:mt-0">
                <h4 className="font-medium text-lg">Protocal</h4>
                <ul className="text-xs mt-3">
                  <li>
                    <LinkItem href="/market">Market</LinkItem>
                  </li>
                  <li>
                    <LinkItem href="/prices">Prices</LinkItem>
                  </li>
                  <li>
                    <LinkItem href="/developers">Developers</LinkItem>
                  </li>
                  <li>
                    <LinkItem href="/docs">Docs</LinkItem>
                  </li>
                </ul>
              </div>
              <div className="col-span-1 mt-4 sm:mt-0">
                <h4 className="font-medium text-lg">Governance</h4>
                <ul className="text-xs mt-3">
                  <li>
                    <LinkItem href="/overview">Overview</LinkItem>
                  </li>
                  <li>
                    <LinkItem href="/comp">COMP</LinkItem>
                  </li>
                  <li>
                    <LinkItem href="/leaderboard">Leaderboard</LinkItem>
                  </li>
                </ul>
              </div>
              <div className="col-span-1 mt-4 sm:mt-0">
                <h4 className="font-medium text-lg">Community</h4>
                <ul className="text-xs mt-3">
                  <li>
                    <LinkItem href="/discord">Discord</LinkItem>
                  </li>
                  <li>
                    <LinkItem href="/forum">Forum</LinkItem>
                  </li>
                  <li>
                    <LinkItem href="/grants">Grants</LinkItem>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-span-6 hidden sm:block sm:col-span-1 text-right">
            <Button rounded="sm">App</Button>
          </div>
        </div>
        <div className="border-t border-slate-800 text-slate-400 text-xs pt-6">
          © 2022 Kashi Market
        </div>
      </div>
    </div>
  );
};

export default Footer;
