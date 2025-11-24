"use client";

import {
  Folder,
  Settings,
  HelpCircle,
  Menu,
  User,
  Package,
  BookOpen,
} from "lucide-react";

import { Home } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function handleNavigation() {
    setIsMobileMenuOpen(false);
  }

  function NavItem({
    href,
    icon: Icon,
    children,
  }: {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
  }) {
    return (
      <Link
        href={href}
        onClick={handleNavigation}
        className="flex items-center px-3 py-2 text-sm rounded-md transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1F1F23]"
      >
        <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
        {children}
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[40] p-2 rounded-lg bg-white dark:bg-[#0F0F12] shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>
      <nav
        className={`
                fixed inset-y-0 left-0 z-[40] w-64 bg-white dark:bg-[#0F0F12] transform transition-transform duration-200 ease-in-out
                lg:translate-x-0 lg:fixed lg:w-64 lg:h-screen border-r border-gray-200 dark:border-[#1F1F23]
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}
      >
        <div className="h-full flex flex-col">
          {/* Logo at the top */}
          <div className="px-4 py-4 border-b border-gray-200 dark:border-[#1F1F23] shrink-0">
            <Link href="/dashboard" className="block">
              <Image
                src="/brand/hero-logo.png"
                alt="Doit"
                width={100}
                height={38}
                className="h-auto w-auto"
              />
            </Link>
          </div>

          <div className="flex-1 py-4 px-4 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Overview
                </div>
                <div className="space-y-1">
                  <NavItem href="/dashboard" icon={Home}>
                    Dashboard
                  </NavItem>
                  <NavItem href="/dashboard/recipes" icon={BookOpen}>
                    Recipes
                  </NavItem>
                  <NavItem href="/dashboard/orders" icon={Package}>
                    Orders
                  </NavItem>
                  <NavItem
                    href="/dashboard/inventory/ingredients"
                    icon={Folder}
                  >
                    Inventory
                  </NavItem>
                  <NavItem href="/dashboard/profile" icon={User}>
                    Profile
                  </NavItem>
                </div>
              </div>

              {/* <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Finance
                </div>
                <div className="space-y-1">
                  <NavItem href="#" icon={Wallet}>
                    Transactions
                  </NavItem>
                  <NavItem href="#" icon={Receipt}>
                    Invoices
                  </NavItem>
                  <NavItem href="#" icon={CreditCard}>
                    Payments
                  </NavItem>
                </div>
              </div> */}

              {/* <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Team
                </div>
                <div className="space-y-1">
                  <NavItem href="#" icon={Users2}>
                    Members
                  </NavItem>
                  <NavItem href="#" icon={Shield}>
                    Permissions
                  </NavItem>
                  <NavItem href="#" icon={MessagesSquare}>
                    Chat
                  </NavItem>
                  <NavItem href="#" icon={Video}>
                    Meetings
                  </NavItem>
                </div>
              </div> */}
            </div>
          </div>

          <div className="px-4 py-4 border-t border-gray-200 dark:border-[#1F1F23] flex-shrink-0">
            <div className="space-y-1">
              <NavItem href="#" icon={Settings}>
                Settings
              </NavItem>
              <NavItem href="#" icon={HelpCircle}>
                Help
              </NavItem>
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[35] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
