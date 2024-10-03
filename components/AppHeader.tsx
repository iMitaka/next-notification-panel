'use client'

import { useCallback, useState } from "react";
import { BellIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export interface AppHeaderProps {
  onCreateNotification?: () => void;
  unreadCount?: number;
  title: string;
  hasBackButton?: boolean;
}

export const AppHeader = ({
  onCreateNotification,
  unreadCount,
  title,
  hasBackButton = false,
}: AppHeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(!isDropdownOpen);
  }, [isDropdownOpen]);

  const handleCreateNotification = useCallback(() => {
    setIsDropdownOpen(false);
    onCreateNotification?.();
  }, [onCreateNotification]);

  const handleBackButtonClick = () => {
    router.back();
  };

  return (
    <header className="bg-[#353535] text-white p-4 flex justify-between items-center relative z-50">
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="relative">
        {hasBackButton ? (
          <button
            className="text-white text-lg"
            onClick={handleBackButtonClick}
          >
            &larr; Back
          </button>
        ) : (
          <div className="relative">
            <BellIcon
              className="w-6 h-6 cursor-pointer"
              onClick={toggleDropdown}
            />
            {Number(unreadCount) > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                {unreadCount}
              </span>
            )}
          </div>
        )}
        {isDropdownOpen && !hasBackButton && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50 hover:bg-slate-300">
            <button
              className="block w-full text-left px-4 py-2 text-black"
              onClick={handleCreateNotification}
            >
              <span>Create Notification</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
