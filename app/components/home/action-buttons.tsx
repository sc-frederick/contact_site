import { Download, Share2 } from "lucide-react";
import { contactData } from "~/lib/contact-data";
import { downloadVCard } from "~/lib/vcard";
import { cn } from "~/lib/utils";
import { useToast } from "~/components/ui/toast";

interface ActionButtonsProps {
  className?: string;
}

export function ActionButtons({ className }: ActionButtonsProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    const shareData = {
      title: `${contactData.name} | ${contactData.company}`,
      text: `Connect with ${contactData.name} - ${contactData.title} at ${contactData.company}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      toast("Link copied to clipboard!", "success");
    } catch (err) {
      console.log("Share cancelled", err);
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
