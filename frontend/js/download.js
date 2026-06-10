export const downloadManager = {
    downloadTxt(filename, text) {
        if (!text) return;
        const blob = new Blob([text], { type: 'text/plain' });
        this.triggerDownload(blob, filename);
    },
    
    downloadJson(filename, jsonObject) {
        if (!jsonObject) return;
        const blob = new Blob([JSON.stringify(jsonObject, null, 2)], { type: 'application/json' });
        this.triggerDownload(blob, filename);
    },
    
    triggerDownload(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};
