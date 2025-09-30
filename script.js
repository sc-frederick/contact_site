function saveContact() {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:Stephen Frederick
ORG:Advanced Engineering Consultants
TITLE:Staff Engineer
TEL:+19043334308
EMAIL:sfrederick@advanced-engineers.com
URL:https://www.advanced-engineers.com
ADR:;;Tampa, FL;;;
NOTE:Passionate about building elegant solutions to complex problems. Specializing in full-stack development and cloud architecture.
END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stephen_frederick_contact.vcf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showNotification('Contact saved successfully!');
}

function shareProfile() {
    const shareData = {
        title: 'Stephen Frederick - Digital Business Card',
        text: 'Check out my digital business card',
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData)
            .then(() => showNotification('Profile shared successfully!'))
            .catch((error) => {
                console.log('Error sharing:', error);
                copyToClipboard();
            });
    } else {
        copyToClipboard();
    }
}

function copyToClipboard() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        showNotification('Profile link copied to clipboard!');
    }).catch(() => {
        showNotification('Failed to copy link');
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #415A77 0%, #1B263B 100%);
        color: #E0E1DD;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        font-size: 14px;
        font-weight: 500;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.href.includes('mailto:') || this.href.includes('tel:')) {
                return;
            }
            e.preventDefault();
            window.open(this.href, '_blank');
        });
    });

    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.open(this.href, '_blank');
        });
    });
});