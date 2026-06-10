export const clipboardManager = {
    async copyText(text, buttonElement) {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            const originalText = buttonElement.innerText;
            buttonElement.innerText = "Copied!";
            setTimeout(() => {
                buttonElement.innerText = originalText;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy to clipboard.');
        }
    }
};
