"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.header
        key={pathname} // triggers animation on route change
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={headerVariants}
        className={`fixed top-0 left-0 w-full z-50 text-white backdrop-blur-sm ${
          scrolled || !isHomePage ? "bg-neutral-900" : ""
        }`}
      >
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between py-4">
            <Link href="/" className="text-2xl font-bold text-white">
              BarberShop
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="hover:text-amber-400 transition-colors">
                Home
              </Link>
              <Link
                href="/about"
                className="hover:text-amber-400 transition-colors"
              >
                About
              </Link>
              <Link
                href="/services"
                className="hover:text-amber-400 transition-colors"
              >
                Services
              </Link>
              <Link
                href="/login"
                className="hover:text-amber-400 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-neutral-700 hover:bg-neutral-800 px-4 py-2 rounded-lg transition-colors"
              >
                Register Account
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </nav>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-700">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className="hover:text-amber-400 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="hover:text-amber-400 transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/services"
                  className="hover:text-amber-400 transition-colors"
                >
                  Services
                </Link>
                <Link
                  href="/login"
                  className="hover:text-amber-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg transition-colors inline-block"
                >
                  Register Account
                </Link>
              </div>
            </div>
          )}
        </div>
      </motion.header>
    </AnimatePresence>
  );
}
