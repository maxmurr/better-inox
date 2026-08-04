export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="flex min-h-dvh w-full flex-col px-4 pt-10 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
      <main className="flex flex-1 items-center justify-center">
        {children}
      </main>
      <footer className="pt-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} better inox
      </footer>
    </div>
  );
}
