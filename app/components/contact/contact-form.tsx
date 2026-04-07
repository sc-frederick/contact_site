import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { submitContactForm } from "~/lib/server/contact";
import { contactData } from "~/lib/contact-data";
import { cn } from "~/lib/utils";

interface ContactFormProps {
  className?: string;
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
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block font-body text-sm text-text-secondary"
      >
        {label}
        {required && <span className="text-accent ml-1">*</span>}
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
          "w-full px-4 py-3 bg-bg-surface/50 border rounded-lg font-body text-text-primary",
          "placeholder:text-text-tertiary/50",
          "focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent",
          "transition-all duration-300",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error
            ? "border-red-500/50 focus:ring-red-500/30 focus:border-red-500"
            : "border-border hover:border-border/80"
        )}
      />
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-400 font-body">
          <AlertCircle className="w-3 h-3" />
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
    <div className={cn("space-y-6", className)}>
      <div>
        <h3 className="font-display text-xl text-text-primary mb-2">
          Get in Touch
        </h3>
        <p className="font-body text-text-secondary leading-relaxed">
          Have a project in mind or want to collaborate? Send me a message and I'll get back to you as soon as possible.
        </p>
      </div>

      {/* Contact Info Cards */}
      <div className="space-y-4">
        {/* Email */}
        <div className="flex items-start gap-4 p-4 bg-bg-surface/50 rounded-lg border border-border hover:border-accent/30 transition-all duration-300">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Mail className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1">
            <p className="font-body text-xs text-text-tertiary uppercase tracking-wider mb-1">
              Email
            </p>
            <div className="space-y-1">
              {contactData.emails.map((email) => (
                <a
                  key={email.address}
                  href={`mailto:${email.address}`}
                  className="block font-body text-sm text-text-primary hover:text-accent transition-colors duration-300"
                >
                  {email.address}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-4 p-4 bg-bg-surface/50 rounded-lg border border-border hover:border-accent/30 transition-all duration-300">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Phone className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1">
            <p className="font-body text-xs text-text-tertiary uppercase tracking-wider mb-1">
              Phone
            </p>
            <a
              href={`tel:${contactData.phone.number.replace(/\s/g, "")}`}
              className="font-body text-sm text-text-primary hover:text-accent transition-colors duration-300"
            >
              {contactData.phone.number}
            </a>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-4 p-4 bg-bg-surface/50 rounded-lg border border-border hover:border-accent/30 transition-all duration-300">
          <div className="p-2 bg-accent/10 rounded-lg">
            <MapPin className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1">
            <p className="font-body text-xs text-text-tertiary uppercase tracking-wider mb-1">
              Location
            </p>
            <p className="font-body text-sm text-text-primary">
              {contactData.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SuccessStateProps {
  onReset: () => void;
}

function SuccessState({ onReset }: SuccessStateProps) {
  return (
    <div className="text-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 bg-accent/10 rounded-full animate-pulse" />
        </div>
        <div className="relative p-4 bg-accent/20 rounded-full inline-block">
          <CheckCircle className="w-12 h-12 text-accent" />
        </div>
      </div>
      
      <h3 className="font-display text-2xl text-text-primary mb-3">
        Message Sent!
      </h3>
      <p className="font-body text-text-secondary mb-8 max-w-sm mx-auto">
        Thank you for reaching out. I'll review your message and get back to you as soon as possible.
      </p>
      
      <button
        onClick={onReset}
        className="font-body text-accent hover:text-accent-muted transition-colors duration-300 underline underline-offset-4"
      >
        Send another message
      </button>
    </div>
  );
}

export function ContactForm({ className }: ContactFormProps) {
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
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const result = await submitForm({ data: formData });
      
      if (result.success) {
        setIsSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setSubmitError(result.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      setSubmitError("An unexpected error occurred. Please try again later.");
      console.error("Contact form submission error:", error);
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
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12", className)}>
      {/* Direct Contact Info - Left Side */}
      <DirectContactInfo />

      {/* Contact Form - Right Side */}
      <div className="bg-bg-surface/50 rounded-xl border border-border p-6 md:p-8">
        {isSuccess ? (
          <SuccessState onReset={handleReset} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="font-display text-xl text-text-primary mb-2">
                Send a Message
              </h3>
              <p className="font-body text-text-secondary text-sm">
                Fill out the form below and I'll respond within 24 hours.
              </p>
            </div>

            <div className="space-y-5">
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
              
              <p className="text-xs text-text-tertiary font-body text-right">
                {formData.message.length}/5000 characters
              </p>
            </div>

            {submitError && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400 font-body">{submitError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-body font-medium",
                "bg-accent text-bg-primary",
                "hover:bg-accent-muted transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-bg-primary",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "shadow-lg shadow-accent/20 hover:shadow-accent/30"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
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
