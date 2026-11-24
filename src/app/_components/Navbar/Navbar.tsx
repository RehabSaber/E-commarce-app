"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutAction } from "@/app/(auth)/auth.actions";
import { getCartAction } from "@/app/cart/cart.actions";
import { getWishlistAction } from "@/app/wishlist/wishlist.actions";
import {
  LuMenu,
  LuSearch,
  LuShoppingCart,
  LuUser,
  LuX,
  LuHeart,
  LuHeadphones,
  LuChevronDown,
  LuTruck,
  LuPackage,
  LuPhone,
  LuMail,
  LuUserPlus,
  LuLogOut,
  LuMapPin,
} from "react-icons/lu";

const links = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories", hasDropdown: true },
  { label: "Brands", href: "/brands" },
];

interface NavCategory {
  _id: string;
  name: string;
}

function decodeToken(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64));
  } catch {
    return null;
  }
}

export default function Navbar() {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");

  const [categoriesList, setCategoriesList] = useState<NavCategory[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  async function fetchCounts() {
    const token = localStorage.getItem("userToken");
    if (!token) {
      setCartCount(0);
      setWishlistCount(0);
      return;
    }

    const cartRes = await getCartAction();
    if (cartRes.success && cartRes.data) {
      setCartCount(cartRes.data.numOfCartItems || 0);
    } else {
      setCartCount(0);
    }

    const wishRes = await getWishlistAction();
    if (wishRes.success && wishRes.data) {
      setWishlistCount(wishRes.data.length || 0);
    } else {
      setWishlistCount(0);
    }
  }

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("userToken");
      setIsLoggedIn(!!token);
      if (token) {
        const decoded = decodeToken(token);
        const savedName = localStorage.getItem("userName");
        const savedEmail = localStorage.getItem("userEmail");
        setUserName(savedName || decoded?.name || "User");
        setUserEmail(savedEmail || "");
        fetchCounts();
      } else {
        setCartCount(0);
        setWishlistCount(0);
      }
    };

    checkAuth();
    window.addEventListener("auth-change", checkAuth);
    window.addEventListener("cart-change", fetchCounts);
    window.addEventListener("wishlist-change", fetchCounts);

    return () => {
      window.removeEventListener("auth-change", checkAuth);
      window.removeEventListener("cart-change", fetchCounts);
      window.removeEventListener("wishlist-change", fetchCounts);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(
          "https://ecommerce.routemisr.com/api/v1/categories"
        );
        const data = await res.json();
        if (data.data) {
          setCategoriesList(data.data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  async function handleLogout() {
    await logoutAction();
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
    setCartCount(0);
    setWishlistCount(0);
    setIsMobileMenuOpen(false);
    toast.success("Logged out successfully");
    router.push("/login");
    router.refresh();
  }

  const userInitials = userName.slice(0, 2).toUpperCase();

  return (
    <>
      <div className="hidden lg:block border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-10 items-center justify-between text-[13px] text-slate-500">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <LuTruck className="h-4 w-4 text-green-600" />
                <span>Free Shipping on Orders 500 EGP</span>
              </div>
              <div className="flex items-center gap-2">
                <LuPackage className="h-4 w-4 text-green-600" />
                <span>New Arrivals Daily</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="tel:+18001234567"
                className="flex items-center gap-2 hover:text-green-600 transition-colors cursor-pointer"
              >
                <LuPhone className="h-4 w-4" />
                <span>+1 (800) 123-4567</span>
              </a>
              <a
                href="mailto:support@freshcart.com"
                className="flex items-center gap-2 hover:text-green-600 transition-colors cursor-pointer"
              >
                <LuMail className="h-4 w-4" />
                <span>support@freshcart.com</span>
              </a>
              <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
                {isLoggedIn ? (
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 font-medium text-slate-700 hover:text-green-600 transition-colors"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#0aad0a] text-white text-[10px] font-bold flex items-center justify-center">
                      {userInitials}
                    </span>
                    <span>{userName}</span>
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center gap-1 hover:text-green-600 transition-colors"
                    >
                      <LuUser className="h-4 w-4" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center gap-1 hover:text-green-600 transition-colors"
                    >
                      <LuUserPlus className="h-4 w-4" />
                      <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white shadow-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-4">
            <Link href="/" className="flex shrink-0 items-center">
              <Image
                src="/freshcart-logo.49f1b44d.svg"
                alt="FreshCart Logo"
                width={160}
                height={40}
                priority
                className="h-7 lg:h-8 w-auto"
              />
            </Link>

            <div className="hidden xl:flex flex-1 max-w-xl mx-8">
              <div className="relative flex w-full items-center">
                <input
                  type="text"
                  placeholder="Search for products, brands and more..."
                  className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-5 pr-12 text-sm outline-none focus:border-green-500 transition-colors"
                />
                <button className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white transition-colors hover:bg-green-700">
                  <LuSearch className="h-4 w-4" />
                </button>
              </div>
            </div>

            <nav className="hidden xl:flex items-center gap-7 shrink-0">
              {links.map((link, index) =>
                link.hasDropdown ? (
                  <div key={index} className="group relative py-6">
                    <Link
                      href={link.href}
                      className="flex items-center gap-1 text-[16px] text-slate-700 hover:text-green-600 font-medium transition-colors group-hover:text-green-600"
                    >
                      {link.label}
                      <LuChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                    </Link>

                    <div className="absolute left-0 top-18 hidden w-56 pt-2 group-hover:block">
                      <div className="flex flex-col rounded-xl bg-white p-2 shadow-xl border border-gray-100 max-h-80 overflow-y-auto">
                        <Link
                          href="/categories"
                          className="rounded-lg px-4 py-2.5 text-[15px] font-medium text-green-600 hover:bg-slate-50 transition-colors"
                        >
                          All Categories
                        </Link>
                        {categoriesList.map((cat) => (
                          <Link
                            key={cat._id}
                            href={`/categories/${cat._id}`}
                            className="rounded-lg px-4 py-2.5 text-[15px] text-slate-700 hover:bg-slate-50 hover:text-green-600 transition-colors"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={index}
                    href={link.href}
                    className="flex items-center gap-1 text-[16px] text-slate-700 hover:text-green-600 font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            <div className="flex items-center gap-3 lg:gap-4 shrink-0">
              <div className="hidden xl:flex items-center gap-3 mr-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 shrink-0">
                  <LuHeadphones className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[12px] font-medium text-slate-500">
                    Support
                  </span>
                  <span className="text-[14px] font-bold text-slate-900 whitespace-nowrap">
                    24/7 Help
                  </span>
                </div>
              </div>

              <Link
                href="/wishlist"
                className="relative text-slate-600 hover:text-green-500 transition-colors"
              >
                <LuHeart className="h-6 w-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 min-w-5 h-5 px-1 rounded-full bg-green-500 text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="relative text-slate-600 hover:text-green-600 transition-colors"
              >
                <LuShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 min-w-5 h-5 px-1 rounded-full bg-[#0aad0a] text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>

      
              {isLoggedIn ? (
                <div ref={dropdownRef} className="relative hidden xl:block">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2.5 rounded-full border border-green-300 bg-green-50/80 hover:bg-green-100/80 pl-1.5 pr-3.5 py-1.5 text-sm font-semibold text-slate-800 transition-colors cursor-pointer"
                  >
                    <span className="w-7 h-7 rounded-full bg-[#0aad0a] text-white text-xs font-bold flex items-center justify-center">
                      {userInitials}
                    </span>
                    <span>{userName}</span>
                    <LuChevronDown
                      className={`h-4 w-4 text-green-700 transition-transform ${
                        isUserMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2.5 w-60 rounded-2xl bg-white p-2 shadow-xl border border-gray-100 z-50">
                      <div className="px-3.5 py-2.5 border-b border-gray-100">
                        <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          SIGNED IN AS
                        </span>
                        <span className="block text-sm font-bold text-slate-900 mt-0.5">
                          {userName}
                        </span>
                        {userEmail && (
                          <span className="block text-xs text-slate-400 truncate">
                            {userEmail}
                          </span>
                        )}
                      </div>

                      <div className="py-1.5 space-y-0.5">
                        <Link
                          href="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-gray-50 transition-colors"
                        >
                          <LuUser className="h-4 w-4 text-green-600" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          href="/addresses"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-gray-50 transition-colors"
                        >
                          <LuMapPin className="h-4 w-4 text-green-600" />
                          <span>My Addresses</span>
                        </Link>
                        <Link
                          href="/allorders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-gray-50 transition-colors"
                        >
                          <LuPackage className="h-4 w-4 text-green-600" />
                          <span>My Orders</span>
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-green-600 hover:bg-green-50 transition-colors cursor-pointer"
                        >
                          <LuLogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden xl:flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 whitespace-nowrap"
                >
                  <LuUser className="h-4 w-4" />
                  Sign In
                </Link>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex xl:hidden h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors ml-1"
              >
                <LuMenu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end xl:hidden">
          <div
            className="fixed inset-0 bg-black/60 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="relative flex w-[85%] max-w-sm flex-col overflow-y-auto bg-white shadow-2xl h-full animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <Link
                href="/"
                className="flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Image
                  src="/freshcart-logo.49f1b44d.svg"
                  alt="FreshCart Logo"
                  width={140}
                  height={36}
                  priority
                  className="h-7 w-auto"
                />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
              >
                <LuX className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-6">
              <nav className="flex flex-col gap-4">
                {links.map((link, index) =>
                  link.hasDropdown ? (
                    <div key={index} className="flex flex-col gap-3">
                      <button
                        onClick={() =>
                          setIsMobileCategoriesOpen(!isMobileCategoriesOpen)
                        }
                        className="flex w-full items-center justify-between text-[17px] font-medium text-slate-700 hover:text-green-600 transition-colors"
                      >
                        {link.label}
                        <LuChevronDown
                          className={`h-5 w-5 transition-transform duration-200 ${
                            isMobileCategoriesOpen
                              ? "rotate-180 text-green-600"
                              : ""
                          }`}
                        />
                      </button>

                      {isMobileCategoriesOpen && (
                        <div className="flex flex-col gap-3 pl-4 border-l-2 border-green-100 ml-1">
                          <Link
                            href="/categories"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-[15px] font-medium text-green-600 py-1"
                          >
                            All Categories
                          </Link>
                          {categoriesList.map((cat) => (
                            <Link
                              key={cat._id}
                              href={`/categories/${cat._id}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="text-[15px] text-slate-600 hover:text-green-600 transition-colors py-1"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={index}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-slate-700 text-[17px] font-medium hover:text-green-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </nav>

              <hr className="border-gray-100 my-1" />

              {isLoggedIn && (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-slate-700 font-medium"
                  >
                    <LuUser className="h-5 w-5 text-green-600" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    href="/addresses"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-slate-700 font-medium"
                  >
                    <LuMapPin className="h-5 w-5 text-green-600" />
                    <span>My Addresses</span>
                  </Link>
                  <Link
                    href="/allorders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-slate-700 font-medium"
                  >
                    <LuPackage className="h-5 w-5 text-green-600" />
                    <span>My Orders</span>
                  </Link>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 font-semibold text-white transition-colors hover:bg-green-700 cursor-pointer"
                  >
                    <LuLogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex-1 rounded-lg bg-green-600 py-2.5 text-center font-semibold text-white transition-colors hover:bg-green-700"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex-1 rounded-lg border border-green-600 bg-white py-2.5 text-center font-semibold text-green-600 transition-colors hover:bg-green-50"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}