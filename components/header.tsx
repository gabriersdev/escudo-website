import Link from 'next/link';
import {getPosts} from '@/libs/mdx';
import {SearchModal} from './search-modal';
import {appConfigs} from "@/resources/resources";
import {dictionary} from "@/resources/dictionary";
import Image from "next/image";

export function Header() {
  const posts = getPosts();
  
  return (
    <header className="border-b border-gray-100">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-20">
          {/* Left spacer for centering logo */}
          <div className="w-1/3  flex items-center">
            <SearchModal posts={posts}/>
          </div>
          
          {/* Logo */}
          <div className="w-1/3 text-center">
            <Link href="/" className="text-2xl font-bold tracking-tight text-black">
              <Image src={"/logo-horizontal.png"} alt={"Logo do Escudo"} width={500} height={500} className={"w-40 h-10 object-contain mx-auto"}/>
            </Link>
          </div>
          
          {/* Right actions */}
          <div className="w-1/3 invisible md:visible md:flex justify-end items-center space-x-4">
            <Link
              href="/subscribe"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase px-5 py-2.5 rounded-full transition-colors"
            >
              {dictionary.header.subscribe}
            </Link>
          </div>
        </div>
        
        {/* Bottom Navigation */}
        <nav className="flex justify-center space-x-8 py-4 border-t border-gray-50 line-clamp-1">
          {[
            [dictionary.header.home, '/'],
            [dictionary.header.about, '/about'],
            [dictionary.header.authors, '/authors'],
            [dictionary.header.collection, '/collection'],
          ].map(([label, href], i, self) => (
            <Link
              key={i}
              href={href}
              className={"text-xs font-semibold text-gray-900 uppercase tracking-wide hover:text-blue-600 transition-colors " + ((i === self.length - 1) ? " hidden md:inline-block" : "")}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
