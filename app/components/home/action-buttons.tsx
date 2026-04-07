import { Download, Share2 } from "lucide-react";
import { contactData } from "~/lib/contact-data";
import { downloadVCard } from "~/lib/vcard";
import { cn } from "~/lib/utils";

interface ActionButtonsProps {
  className?: string;
}

export function ActionButtons({ className }: ActionButtonsProps) {
  const handleShare = async () => {
    const shareData = {
      title: contactData.name,
      text: `${contactData.name} - ${contactData.title} at ${contactData.company}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share failed
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };

  const handleSaveContact = () => {
    downloadVCard(contactData);
  };

  return (
    <div className={cn("flex flex-col sm:flex-row gap-3", className)}>
      <button
        onClick={handleSaveContact}
        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent text-bg-primary font-body text-sm font-medium hover:bg-accent-muted transition-colors duration-300"
      >
        <Download className="w-4 h-4" />
        Save Contact
      </button>
      <button
        onClick={handleShare}
        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-bg-surface border border-border text-text-primary font-body text-sm font-medium hover:border-accent hover:text-accent transition-all duration-300"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>
    </div>
  );
}
