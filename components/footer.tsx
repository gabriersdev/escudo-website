import {appConfigs, contacts} from "@/resources/resources";
import {dictionary} from "@/resources/dictionary";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 py-12 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 font-medium">
          <Link href={"/"} className="mb-4 md:mb-0">
            {appConfigs["app-name"]} &copy; {new Date().getFullYear()}
          </Link>
          <div className="flex space-x-6 mb-4 md:mb-0 text-gray-500">
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">{dictionary.footer.dataAndPrivacy}</Link>
            <Link href="/about" className="hover:text-blue-600 transition-colors">{dictionary.footer.aboutUs}</Link>
            <Link href="/rss.xml" className="hover:text-blue-600 transition-colors">{dictionary.footer.rss}</Link>
          </div>
          <div>
            <Link
              href={contacts.repo}
              target={"_blank"}
              className="hover:text-blue-600 transition-colors"
              rel={"noopener noreferrer"}
            >
              {dictionary.footer.poweredBy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
