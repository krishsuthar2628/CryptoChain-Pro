export const ui = {
    setLoading(btnId, isLoading) {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        if (isLoading) {
            btn.dataset.originalText = btn.innerHTML;
            btn.innerHTML = '<span class="spinner"></span> Processing...';
            btn.disabled = true;
        } else {
            btn.innerHTML = btn.dataset.originalText || btn.innerHTML;
            btn.disabled = false;
        }
    },
    
    getInputValue(id) {
        const el = document.getElementById(id);
        return el ? el.value : '';
    },
    
    setInputValue(id, value) {
        const el = document.getElementById(id);
        if (el) el.value = value;
    }
};
