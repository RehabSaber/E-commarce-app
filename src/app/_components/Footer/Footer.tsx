import React from "react";
import Link from "next/link";
import {
  FiShoppingCart,
  FiPhone,
  FiMail,
  FiMapPin,
  FiCreditCard,
} from "react-icons/fi";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaTruck, FaShield, FaArrowRotateLeft, FaHeadset } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="w-full mt-auto">
      <div className="bg-[#f4fbf6] py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                <FaTruck size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Free Shipping</h4>
                <p className="text-sm text-gray-500">On orders over 500 EGP</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                <FaArrowRotateLeft size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Easy Returns</h4>
                <p className="text-sm text-gray-500">14-day return policy</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                <FaShield size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Secure Payment</h4>
                <p className="text-sm text-gray-500">100% secure checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                <FaHeadset size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">24/7 Support</h4>
                <p className="text-sm text-gray-500">Contact us anytime</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0f172a] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
            <div className="md:col-span-2 lg:col-span-2">
              <Link href="/" className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg mb-6">
                <FiShoppingCart className="text-green-600" size={28} />
                <span className="text-2xl font-bold text-gray-900">
                  FreshCart
                </span>
              </Link>
              <p className="text-gray-400 mb-6 leading-relaxed">
                FreshCart is your one-stop destination for quality products.
                From fashion to electronics, we bring you the best brands at
                competitive prices with a seamless shopping experience.
              </p>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-center gap-3">
                  <FiPhone size={18} className="text-green-500" />
                  <span>+1 (800) 123-4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <FiMail size={18} className="text-green-500" />
                  <span>support@freshcart.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <FiMapPin size={18} className="text-green-500" />
                  <span>123 Commerce Street, New York, NY 10001</span>
                </li>
              </ul>

              <div className="flex gap-4 mt-8">
                <a
                  href="#"
                  className="bg-slate-800 p-2 rounded-full text-gray-400 hover:text-white hover:bg-green-600 transition-all duration-300"
                >
                  <FaFacebook size={20} />
                </a>
                <a
                  href="#"
                  className="bg-slate-800 p-2 rounded-full text-gray-400 hover:text-white hover:bg-green-600 transition-all duration-300"
                >
                  <FaTwitter size={20} />
                </a>
                <a
                  href="#"
                  className="bg-slate-800 p-2 rounded-full text-gray-400 hover:text-white hover:bg-green-600 transition-all duration-300"
                >
                  <FaInstagram size={20} />
                </a>
                <a
                  href="#"
                  className="bg-slate-800 p-2 rounded-full text-gray-400 hover:text-white hover:bg-green-600 transition-all duration-300"
                >
                  <FaYoutube size={20} />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white text-lg font-semibold mb-6">Shop</h3>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <Link href="/shop" className="hover:text-white transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="hover:text-white transition-colors">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/brands" className="hover:text-white transition-colors">
                    Brands
                  </Link>
                </li>
                <li>
                  <Link href="/categories/6439d2d167d9aa4ca970649f" className="hover:text-white transition-colors">
                    Electronics
                  </Link>
                </li>
                <li>
                  <Link href="/categories/6439d5b90049ad0b52b90048" className="hover:text-white transition-colors">
                    Men's Fashion
                  </Link>
                </li>
                <li>
                  <Link href="/categories/6439d58a0049ad0b52b9003f" className="hover:text-white transition-colors">
                    Women's Fashion
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white text-lg font-semibold mb-6">Account</h3>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <Link href="/profile" className="hover:text-white transition-colors">
                    My Account
                  </Link>
                </li>
                <li>
                  <Link href="/allorders" className="hover:text-white transition-colors">
                    Order History
                  </Link>
                </li>
                <li>
                  <Link href="/wishlist" className="hover:text-white transition-colors">
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="hover:text-white transition-colors">
                    Shopping Cart
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white transition-colors">
                    Create Account
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Returns & Refunds
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Track Order
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white text-lg font-semibold mb-6">Legal</h3>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 FreshCart. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <FiCreditCard size={18} />
                <span>Visa</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCreditCard size={18} />
                <span>Mastercard</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCreditCard size={18} />
                <span>PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}