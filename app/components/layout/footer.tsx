export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-bg-primary px-6 py-8">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <p className="font-body text-sm text-text-tertiary">
          &copy; {new Date().getFullYear()} Stephen Frederick
        </p>
        <a
          href="https://maps.app.goo.gl/8BNGpYQypndip3L39"
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-sm text-text-tertiary hover:text-accent transition-colors duration-300"
        >
          Tampa, FL
        </a>
      </div>
    </footer>
  );
}
