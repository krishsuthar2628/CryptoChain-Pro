export const historyManager = {
    key: 'crypto_chain_history',
    
    addEntry(pipeline, timestamp) {
        const history = this.getHistory();
        history.unshift({ pipeline: pipeline.join(' → '), timestamp });
        if (history.length > 20) history.pop();
        localStorage.setItem(this.key, JSON.stringify(history));
        this.render();
    },
    
    getHistory() {
        try {
            return JSON.parse(localStorage.getItem(this.key)) || [];
        } catch {
            return [];
        }
    },
    
    clearHistory() {
        localStorage.removeItem(this.key);
        this.render();
    },
    
    render() {
        const container = document.getElementById('history-list');
        if (!container) return;
        const history = this.getHistory();
        container.innerHTML = '';
        if (history.length === 0) {
            container.innerHTML = '<div style="color: var(--text-muted); font-size: 0.875rem;">No history yet.</div>';
            return;
        }
        history.forEach((entry) => {
            const item = document.createElement('div');
            item.className = 'history-item slide-in-right';
            const dateStr = new Date(entry.timestamp).toLocaleString();
            item.innerHTML = `
                <div class="history-time">${dateStr}</div>
                <div class="history-pipeline">${entry.pipeline}</div>
            `;
            container.appendChild(item);
        });
    }
};
