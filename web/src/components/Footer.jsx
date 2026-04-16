import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50 text-muted-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl text-foreground">Idea Pulse</span>
            </div>
            <p className="text-sm leading-relaxed max-w-md">
              Discover the perfect development tools for your projects. Get AI-powered recommendations tailored to your needs.
            </p>
          </div>

          <div>
            <span className="font-semibold text-foreground text-sm tracking-wide uppercase mb-4 block">Product</span>
            <ul className="space-y-2">
              <li>
                <Link to="/tools" className="text-sm hover:text-foreground transition-colors">
                  Browse Tools
                </Link>
              </li>
              <li>
                <Link to="/brief-builder" className="text-sm hover:text-foreground transition-colors">
                  Brief Builder
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <span className="font-semibold text-foreground text-sm tracking-wide uppercase mb-4 block">Legal</span>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © 2026 Idea Pulse. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}