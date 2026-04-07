export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-bg-primary px-6 py-8">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <p className="font-body text-sm text-text-tertiary">
          &copy; {new Date().getFullYear()} Stephen Frederick
        </p>
        <p className="font-body text-sm text-text-tertiary">
          Tampa, FL
        </p>
      </div>
    </footer>
  );
}
