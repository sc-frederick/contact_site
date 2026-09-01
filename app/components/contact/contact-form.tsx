import { useState, useEffect, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { submitContactForm } from "~/lib/server/contact";
import { contactData } from "~/lib/contact-data";
import { cn } from "~/lib/utils";

// Minimal typing for the Turnstile script's global API.
interface TurnstileRenderOptions {
  sitekey: string;
  action?: string;
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
  "timeout-callback"?: () => void;
  theme?: "auto" | "light" | "dark";
}
declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: TurnstileRenderOptions) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

// Load the Turnstile script once, lazily, and share the promise across renders.
const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let turnstileScriptPromise: Promise<void> | null = null;
function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (turnstileScriptPromise) return turnstileScriptPromise;
  turnstileScriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Turnstile"));
    document.head.appendChild(script);
  });
  return turnstileScriptPromise;
}

interface ContactFormProps {
  className?: string;
  /** Public Cloudflare Turnstile sitekey, supplied by the route loader. */
  siteKey: string;
}

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  isTextarea?: boolean;
  maxLength?: number;
}

function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required,
  isTextarea,
  maxLength,
}: FormFieldProps) {
  const InputComponent = isTextarea ? "textarea" : "input";

  return (
    <div className={cn("mp-field", error && "mp-field--error")}>
      <label htmlFor={id} className="mp-field__label">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <InputComponent
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        rows={isTextarea ? 5 : undefined}
        className={cn(
          isTextarea ? "mp-textarea" : "mp-input"
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="mp-field__error">
          <AlertCircle className="mp-icon mp-icon--sm" />
          {error}
        </p>
      )}
    </div>
  );
}

interface DirectContactInfoProps {
  className?: string;
}

function DirectContactInfo({ className }: DirectContactInfoProps) {
  return (
    <aside className={cn("mp-card mp-card--ink mp-on-ink", className)}>
      <div>
        <p className="mp-eyebrow">Direct details</p>
        <h2 className="mp-headline mp-on-ink mb-3">
          Get in Touch
        </h2>
        <p className="mp-body">
          Have a project in mind or want to collaborate? Send me a message and I'll get back to you as soon as possible.
        </p>
      </div>

      {/* Contact Info Cards */}
      <div>
        {/* Email */}
        <div className="contact-row">
          <div className="contact-row__icon">
            <Mail className="mp-icon" />
          </div>
          <div className="flex-1">
            <p className="mp-eyebrow mb-1">
              Email
            </p>
            <div className="mp-stack gap-1">
              {contactData.emails.map((email) => (
                <a
                  key={email.address}
                  href={`mailto:${email.address}`}
                  className="mp-body mp-on-ink hover:underline"
                >
                  {email.address}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="contact-row">
          <div className="contact-row__icon">
            <Phone className="mp-icon" />
          </div>
          <div className="flex-1">
            <p className="mp-eyebrow mb-1">
              Phone
            </p>
            <a
              href={`tel:${contactData.phone.number.replace(/\s/g, "")}`}
              className="mp-body mp-on-ink hover:underline"
            >
              {contactData.phone.number}
            </a>
          </div>
        </div>

        {/* Location */}
        <div className="contact-row">
          <div className="contact-row__icon">
            <MapPin className="mp-icon" />
          </div>
          <div className="flex-1">
            <p className="mp-eyebrow mb-1">
              Location
            </p>
            <p className="mp-body mp-on-ink">
              {contactData.location}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

interface SuccessStateProps {
  onReset: () => void;
}

function SuccessState({ onReset }: SuccessStateProps) {
  return (
    <div className="py-12 text-center">
      <CheckCircle className="mx-auto mb-6 h-12 w-12 text-[var(--color-success)]" />
      
      <h3 className="mp-headline mb-3">
        Message Sent!
      </h3>
      <p className="mp-body mx-auto mb-8 max-w-sm">
        Thank you for reaching out. I'll review your message and get back to you as soon as possible.
      </p>
      
      <button
        onClick={onReset}
        className="mp-btn mp-btn--secondary"
      >
        Send another message
      </button>
    </div>
  );
}

export function ContactForm({ className, siteKey }: ContactFormProps) {
  const submitForm = useServerFn(submitContactForm);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [challengeStatus, setChallengeStatus] = useState<"loading" | "ready" | "error">("loading");

  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Render the Turnstile widget whenever the form is visible. The widget lives only
  // while the form is mounted (it's replaced by the success state), so we render on
  // mount / return-to-form and tear down on hide.
  useEffect(() => {
    if (isSuccess) return;
    setChallengeStatus("loading");
    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || widgetIdRef.current || !turnstileRef.current || !window.turnstile) {
          return;
        }
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: siteKey,
          action: "contact",
          theme: "light",
          callback: (token) => setTurnstileToken(token),
          "expired-callback": () => setTurnstileToken(null),
          "error-callback": () => {
            setTurnstileToken(null);
            setChallengeStatus("error");
          },
          "timeout-callback": () => {
            setTurnstileToken(null);
            setChallengeStatus("error");
          },
        });
        setChallengeStatus("ready");
      })
      .catch(() => {
        setChallengeStatus("error");
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
      }
      widgetIdRef.current = null;
      setTurnstileToken(null);
    };
  }, [isSuccess, siteKey]);

  // Turnstile tokens are single-use; get a fresh one after a failed attempt.
  const resetTurnstile = () => {
    if (widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch {
        // ignore
      }
    }
    setTurnstileToken(null);
  };

  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        return null;
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address";
        return null;
      case "subject":
        if (value.length > 200) return "Subject must be less than 200 characters";
        return null;
      case "message":
        if (!value.trim()) return "Message is required";
        if (value.trim().length < 10) return "Message must be at least 10 characters";
        if (value.length > 5000) return "Message must be less than 5000 characters";
        return null;
      default:
        return null;
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Clear submit error when user makes any change
    if (submitError) {
      setSubmitError(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    const nameError = validateField("name", formData.name);
    if (nameError) newErrors.name = nameError;
    
    const emailError = validateField("email", formData.email);
    if (emailError) newErrors.email = emailError;
    
    const subjectError = validateField("subject", formData.subject);
    if (subjectError) newErrors.subject = subjectError;
    
    const messageError = validateField("message", formData.message);
    if (messageError) newErrors.message = messageError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!turnstileToken) {
      setSubmitError("Please complete the bot-check challenge before sending.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitForm({
        data: { ...formData, turnstileToken },
      });

      if (result.success) {
        setIsSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setSubmitError(result.error || "Failed to send message. Please try again.");
        resetTurnstile();
      }
    } catch (error) {
      setSubmitError("An unexpected error occurred. Please try again later.");
      console.error("Contact form submission error:", error);
      resetTurnstile();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setErrors({});
    setSubmitError(null);
  };

  return (
    <div className={cn("mp-grid", className)}>
      {/* Direct Contact Info - Left Side */}
      <DirectContactInfo className="mp-span-5" />

      {/* Contact Form - Right Side */}
      <div className="mp-card mp-span-7">
        {isSuccess ? (
          <SuccessState onReset={handleReset} />
        ) : (
          <form onSubmit={handleSubmit} className="mp-stack mp-stack--lg">
            <div>
              <p className="mp-eyebrow">Project inquiry</p>
              <h2 className="mp-headline mb-2">
                Send a Message
              </h2>
              <p className="mp-body">
                Fill out the form below and I'll respond within 24 hours.
              </p>
            </div>

            <div className="mp-stack">
              <FormField
                id="name"
                label="Name"
                value={formData.name}
                onChange={(value) => handleChange("name", value)}
                error={errors.name}
                placeholder="Your full name"
                required
              />

              <FormField
                id="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={(value) => handleChange("email", value)}
                error={errors.email}
                placeholder="your.email@example.com"
                required
              />

              <FormField
                id="subject"
                label="Subject"
                value={formData.subject}
                onChange={(value) => handleChange("subject", value)}
                error={errors.subject}
                placeholder="What's this about? (optional)"
                maxLength={200}
              />

              <FormField
                id="message"
                label="Message"
                value={formData.message}
                onChange={(value) => handleChange("message", value)}
                error={errors.message}
                placeholder="Tell me about your project, question, or just say hello..."
                required
                isTextarea
                maxLength={5000}
              />
              
              <p className="mp-meta text-right tabular-nums">
                {formData.message.length}/5000 characters
              </p>
            </div>

            {submitError && (
              <div className="mp-alert--error flex items-center gap-2" role="alert">
                <AlertCircle className="mp-icon flex-shrink-0" />
                <p className="mp-meta">{submitError}</p>
              </div>
            )}

            {/* Cloudflare Turnstile bot check */}
            <div ref={turnstileRef} className="min-h-[65px]" />
            <p
              className={cn("mp-status", challengeStatus === "error" && "mp-status--error")}
              role="status"
              aria-live="polite"
            >
              {challengeStatus === "loading" && "Loading the bot check..."}
              {challengeStatus === "ready" && !turnstileToken && "Complete the bot check to enable Send Message."}
              {challengeStatus === "error" && "The bot check could not load. Refresh the page to try again."}
            </p>

            <button
              type="submit"
              disabled={isSubmitting || !turnstileToken}
              className={cn(
                "mp-btn mp-btn--accent w-full"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mp-icon animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mp-icon" />
                  Send Message
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
