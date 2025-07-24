"use client";
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion"; // PERBAIKAN: Mengganti import motion/react menjadi framer-motion
import { IconMenu2, IconX } from "@tabler/icons-react";
import Link from "next/link"; // PERBAIKAN: Mengganti <a> dengan Link

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
  className, // PERBAIKAN: Menambahkan className ke props
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
  className?: string; // PERBAIKAN: Menambahkan tipe untuk className
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
        {/* PERBAIKAN: Menggabungkan className dari props */}
        <div className={cn("h-full", className)}>
            {children}
        </div>
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          // PERUBAHAN WARNA
          "h-full px-4 py-4 hidden md:flex md:flex-col bg-purple-50 dark:bg-gray-800 w-[300px] shrink-0",
          className
        )}
        animate={{
          width: animate ? (open ? "300px" : "100px") : "300px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          // PERUBAHAN WARNA
          "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-purple-50 dark:bg-gray-800 w-full"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <IconMenu2
            // PERUBAHAN WARNA
            className="text-purple-800 dark:text-purple-200"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                // PERUBAHAN WARNA
                "fixed h-full w-full inset-0 bg-white dark:bg-gray-900 p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                // PERUBAHAN WARNA
                className="absolute right-10 top-10 z-50 text-purple-800 dark:text-purple-200"
                onClick={() => setOpen(!open)}
              >
                <IconX />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  [key: string]: any; // PERBAIKAN: Menambahkan index signature
}) => {
  const { open, animate } = useSidebar();
  return (
    <Link // PERBAIKAN: Menggunakan komponen Link
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2",
        className
      )}
      {...props}
    >
      {link.icon}

      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        // PERUBAHAN WARNA
        className="text-gray-700 dark:text-gray-200 text-sm group-hover/sidebar:text-purple-600 dark:group-hover/sidebar:text-purple-400 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};
