import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';

const CustomNavbar: React.FC = () => {
  const router = useRouter();

  return (
      <div className="w-full px-6 py-4 flex items-center justify-between rounded-xl border-2 border-black bg-white/70 border-b-4 backdrop-blur-sm max-w-3xl">
        
        {/* Left: Logo */}
        <div className="flex items-center min-w-[100px]">
          <Image
            src="/icon-black.svg"
            alt="Logo"
            width={32}
            height={32}
            className="mr-2"
          />
        </div>

        {/* Center: Title */}
        <div className="flex-1 text-center">
          <h1 className="text-4xl font-kallisto font-bold text-black tracking-wide">
            Professor Match
          </h1>
        </div>

        {/* Right: Button */}
        <div className="min-w-[160px] flex justify-end">
          <Link
            href="/planner"
            onClick={() => {
              if (typeof window !== 'undefined') {
                sessionStorage.setItem(
                  'dashboardSearchTerms',
                  Object.entries(router.query)
                    .map(([key, value]) => {
                      if (typeof value === 'string') {
                        return key + '=' + encodeURIComponent(value);
                      }
                      return '';
                    })
                    .join('&') ?? ''
                );
              }
            }}
          >
            <Button className="bg-cornflower-500 text-white dark:bg-cornflower-400 rounded-xl px-4 py-2 normal-case text-sm md:text-base">
              <BookIcon className="mr-2" />
              My Planner
            </Button>
          </Link>
        </div>
      </div>
  );
};

export default CustomNavbar;
