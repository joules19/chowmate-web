"use client";
import Link from "next/link";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function KnowledgeBaseLink() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-20 right-4 z-50"
    >
      <Link href="/knowledge-base">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#FFC107] hover:bg-[#FFD54F] text-[#282828] rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 group"
        >
          <BookOpenIcon className="w-6 h-6" />
          <span className="hidden group-hover:block text-sm font-medium whitespace-nowrap">
            Knowledge Base
          </span>
        </motion.div>
      </Link>
    </motion.div>
  );
}