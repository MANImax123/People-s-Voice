"use client";

import Link from "next/link";
import { Lightbulb, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-lg shadow-lg">
                <Lightbulb className="w-6 h-6 text-blue-900" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  People's Voice
                </span>
                <span className="text-sm text-blue-200">
                  Civic Engagement Platform
                </span>
              </div>
            </div>
            <p className="text-blue-100 mb-6 max-w-md">
              Empowering citizens to report issues, engage with their community, and make their voices heard in local governance. Together, we build better communities.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-300 hover:text-white transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-blue-300 hover:text-white transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-blue-300 hover:text-white transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-blue-300 hover:text-white transition-colors duration-200">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-blue-200 hover:text-white transition-colors duration-200">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/report" className="text-blue-200 hover:text-white transition-colors duration-200">
                  Report Issue
                </Link>
              </li>
              <li>
                <Link href="/directory" className="text-blue-200 hover:text-white transition-colors duration-200">
                  Directory
                </Link>
              </li>
              <li>
                <Link href="/voting" className="text-blue-200 hover:text-white transition-colors duration-200">
                  Voting
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-blue-200">
                <Mail className="w-4 h-4" />
                <span className="text-sm">support@peoplesvoice.gov</span>
              </li>
              <li className="flex items-center gap-2 text-blue-200">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-blue-200">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">City Hall, Main Street</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-blue-200 text-sm mb-4 md:mb-0">
            © 2025 People's Voice. All rights reserved. Built with ❤️ for the community.
          </div>
          <div className="flex space-x-6 text-sm">
            <Link href="/privacy" className="text-blue-200 hover:text-white transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-blue-200 hover:text-white transition-colors duration-200">
              Terms of Service
            </Link>
            <Link href="/accessibility" className="text-blue-200 hover:text-white transition-colors duration-200">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
