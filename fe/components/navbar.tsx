"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCampaignsOpen, setIsMobileCampaignsOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
        setIsMobileCampaignsOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdowns when clicking outside - using refs for better performance
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Close desktop dropdown if clicked outside
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsDropdownOpen(false);
      }
      
      // Close mobile menu if clicked outside
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setIsMobileMenuOpen(false);
        setIsMobileCampaignsOpen(false);
      }
    };

    // Only add listener if any dropdown is open
    if (isDropdownOpen || isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen, isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navigationLinks = [
    { href: "/", label: "Explore" },
    { href: "/#roadmap", label: "Roadmap" },
    { href: "/whitelist", label: "Whitelist" },
    { href: "/#how-to", label: "How to Earn" }
  ];

  const campaignLinks = [
    { href: "/#", label: "Active Campaigns" },
    { href: "/#", label: "Upcoming Campaigns" },
    { href: "/#", label: "Completed Campaigns" }
  ];

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close campaigns dropdown when toggling main menu
    if (isMobileCampaignsOpen) {
      setIsMobileCampaignsOpen(false);
    }
  };

  const handleDesktopDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMobileCampaignsToggle = () => {
    setIsMobileCampaignsOpen(!isMobileCampaignsOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileCampaignsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <Link href="/" className="flex-shrink-0" onClick={closeMobileMenu}>
              <Image
                src="/l_2.png"
                alt="Hyperkit Logo"
                width={150}
                height={100}
                className="w-[150px] h-[100px] object-contain"
              />
            </Link>
            <div className="bg-gradient-to-b from-teal-400 to-teal-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
              Qwei 1.96
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-2 bg-violet-600 px-6 py-2 rounded-xl">
            {navigationLinks.map((link) => (
              <Link 
                key={link.label}
                href={link.href} 
                className="text-white hover:text-violet-200 transition-colors px-3 py-1 rounded-md"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Campaigns Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleDesktopDropdownToggle}
                className="flex items-center space-x-1 text-gray-700 hover:text-violet-600 transition-colors px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <span>Campaigns</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    {campaignLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-violet-600 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              type="button"
              onClick={handleMobileMenuToggle}
              className="text-gray-700 hover:text-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 p-2 rounded-md transition-colors"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              <svg 
                className={`h-6 w-6 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        ref={mobileMenuRef}
        className={`md:hidden fixed inset-x-0 top-16 bg-white border-t border-gray-200 shadow-lg z-40 overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-screen opacity-100 visible' 
            : 'max-h-0 opacity-0 invisible'
        }`}
      >
        <div className="px-4 py-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {/* Navigation Links */}
          <div className="space-y-1">
            {navigationLinks.map((link, index) => (
              <Link
                key={link.label}
                href={link.href}
                className={`block px-3 py-3 text-base font-medium text-gray-700 hover:text-violet-600 hover:bg-gray-50 rounded-md transition-all duration-300 transform ${
                  isMobileMenuOpen 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-2 opacity-0'
                }`}
                style={{
                  transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms'
                }}
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Campaigns Section - Mobile */}
          <div className={`pt-4 border-t border-gray-200 mt-4 transition-all duration-300 transform ${
            isMobileMenuOpen 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-2 opacity-0'
          }`}
          style={{
            transitionDelay: isMobileMenuOpen ? `${navigationLinks.length * 50}ms` : '0ms'
          }}>
            <button
              onClick={handleMobileCampaignsToggle}
              className="flex items-center justify-between w-full px-3 py-3 text-base font-medium text-gray-700 hover:text-violet-600 hover:bg-gray-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
              aria-expanded={isMobileCampaignsOpen}
            >
              <span>Campaigns</span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                  isMobileCampaignsOpen ? 'rotate-180' : 'rotate-0'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Campaigns Dropdown */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isMobileCampaignsOpen 
                ? 'max-h-48 opacity-100' 
                : 'max-h-0 opacity-0'
            }`}>
              <div className="mt-1 space-y-1 pl-3">
                {campaignLinks.map((link, index) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`block px-6 py-2 text-sm text-gray-600 hover:text-violet-600 hover:bg-gray-50 rounded-md transition-all duration-300 transform ${
                      isMobileCampaignsOpen 
                        ? 'translate-x-0 opacity-100' 
                        : '-translate-x-2 opacity-0'
                    }`}
                    style={{
                      transitionDelay: isMobileCampaignsOpen ? `${index * 75}ms` : '0ms'
                    }}
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;