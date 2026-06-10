import { api } from './api.js';
import { pipelineBuilder } from './pipeline-builder.js';
import { historyManager } from './history.js';
import { clipboardManager } from './clipboard.js';
import { downloadManager } from './download.js';
import { outputManager } from './output-manager.js';
import { ui } from './ui.js';

window.app = {
    init() {
        historyManager.render();
        pipelineBuilder.render();
        
        const inputTextEl = document.getElementById('input-text');
        if (inputTextEl) {
            inputTextEl.addEventListener('input', () => this.handlePayloadInput());
        }
    },

    // Pipeline bindings
    addAlgo(algoName) {
        pipelineBuilder.addAlgorithm(algoName);
    },
    removeAlgo(index) {
        pipelineBuilder.removeAlgorithm(index);
    },
    moveAlgoUp(index) {
        pipelineBuilder.moveUp(index);
    },
    moveAlgoDown(index) {
        pipelineBuilder.moveDown(index);
    },

    // Core functions
    async encrypt() {
        const text = ui.getInputValue('input-text');
        const pipeline = pipelineBuilder.getPipeline();
        const keys = pipelineBuilder.getPipelineKeys();
        const key = keys.find(k => k !== '') || '';
        
        if (!text) return outputManager.displayError("Input text is required");
        if (pipeline.length === 0) return outputManager.displayError("Pipeline is empty");

        ui.setLoading('btn-encrypt', true);
        try {
            const data = await api.encryptData(text, key, pipeline, keys);
            outputManager.displayResult(data.metadata);
            historyManager.addEntry(pipeline, data.metadata.timestamp);
        } catch (e) {
            outputManager.displayError(e.message);
        } finally {
            ui.setLoading('btn-encrypt', false);
        }
    },

    async decrypt() {
        const payload = ui.getInputValue('input-text'); 
        
        if (!payload) return outputManager.displayError("Encrypted payload is required");

        const dynamicContainer = document.getElementById('dynamic-keys-container');
        let keys = null;
        let key = '';
        
        if (dynamicContainer && dynamicContainer.style.display === 'block') {
            try {
                const parsed = JSON.parse(payload);
                keys = new Array(parsed.pipeline.length).fill('');
                const inputs = dynamicContainer.querySelectorAll('.decryption-key-input');
                inputs.forEach(input => {
                    const idx = parseInt(input.dataset.index);
                    keys[idx] = input.value;
                });
            } catch (e) {}
        } else {
            key = ui.getInputValue('input-key');
        }

        ui.setLoading('btn-decrypt', true);
        try {
            const data = await api.decryptData(payload, key, keys);
            outputManager.displayText(data.original_text);
        } catch (e) {
            outputManager.displayError(e.message);
        } finally {
            ui.setLoading('btn-decrypt', false);
        }
    },

    handlePayloadInput() {
        const val = ui.getInputValue('input-text');
        const dynamicKeysContainer = document.getElementById('dynamic-keys-container');
        const globalKeyContainer = document.getElementById('global-key-container');
        if (!dynamicKeysContainer || !globalKeyContainer) return;

        try {
            const parsed = JSON.parse(val);
            if (parsed && Array.isArray(parsed.pipeline) && parsed.ciphertext) {
                const needsKeys = parsed.pipeline.some(algo => ['AES', 'CHACHA20', 'RSA'].includes(algo.toUpperCase()));
                if (needsKeys) {
                    globalKeyContainer.style.display = 'none';
                    dynamicKeysContainer.style.display = 'block';
                    dynamicKeysContainer.innerHTML = '<h3 class="section-title" style="margin-top: 16px; margin-bottom: 12px; font-size: 0.9rem; color: var(--text-secondary);">Decryption Keys Needed</h3>';
                    
                    parsed.pipeline.forEach((algo, index) => {
                        const algoUpper = algo.toUpperCase();
                        if (['AES', 'CHACHA20', 'RSA'].includes(algoUpper)) {
                            const group = document.createElement('div');
                            group.className = 'form-group fade-in';
                            group.style.marginBottom = '12px';
                            
                            let labelText = `Step ${index + 1}: ${algo}`;
                            if (algoUpper === 'RSA') {
                                labelText += ' Private Key';
                            } else {
                                labelText += ' Password/Key';
                            }
                            
                            if (algoUpper === 'RSA') {
                                group.innerHTML = `
                                    <label class="form-label" style="font-size: 0.8rem; margin-bottom: 4px;">${labelText}</label>
                                    <textarea class="form-control decryption-key-input" data-index="${index}" placeholder="Paste RSA private key..." style="min-height: 80px; font-size: 0.8rem;"></textarea>
                                `;
                            } else {
                                group.innerHTML = `
                                    <label class="form-label" style="font-size: 0.8rem; margin-bottom: 4px;">${labelText}</label>
                                    <div style="display: flex; gap: 8px;">
                                        <input type="password" class="form-control decryption-key-input" data-index="${index}" placeholder="Enter key..." style="font-size: 0.8rem; flex: 1;">
                                        <button class="btn btn-outline btn-sm" onclick="this.previousElementSibling.type = this.previousElementSibling.type === 'password' ? 'text' : 'password'; event.preventDefault();" style="padding: 0 8px;">👁</button>
                                    </div>
                                `;
                            }
                            dynamicKeysContainer.appendChild(group);
                        }
                    });
                    return;
                }
            }
        } catch (e) {}
        
        globalKeyContainer.style.display = 'block';
        dynamicKeysContainer.style.display = 'none';
        dynamicKeysContainer.innerHTML = '';
    },

    // RSA functions
    async generateRSA() {
        ui.setLoading('btn-generate-rsa', true);
        try {
            const data = await api.generateRSAKeys();
            ui.setInputValue('rsa-public', data.public_key);
            ui.setInputValue('rsa-private', data.private_key);
        } catch (e) {
            outputManager.displayError(e.message);
        } finally {
            ui.setLoading('btn-generate-rsa', false);
        }
    },
    
    copyRSAPublic(btn) {
        clipboardManager.copyText(ui.getInputValue('rsa-public'), btn);
    },
    
    copyRSAPrivate(btn) {
        clipboardManager.copyText(ui.getInputValue('rsa-private'), btn);
    },
    
    useRSAPublic() {
        const pubKey = ui.getInputValue('rsa-public');
        ui.setInputValue('input-key', pubKey);
        
        let updated = false;
        pipelineBuilder.pipeline.forEach(item => {
            if (item.name.toUpperCase() === 'RSA') {
                item.key = pubKey;
                updated = true;
            }
        });
        if (updated) {
            pipelineBuilder.render();
        }
    },
    
    useRSAPrivate() {
        const privKey = ui.getInputValue('rsa-private');
        ui.setInputValue('input-key', privKey);
        
        const dynamicContainer = document.getElementById('dynamic-keys-container');
        if (dynamicContainer && dynamicContainer.style.display === 'block') {
            const inputs = dynamicContainer.querySelectorAll('.decryption-key-input');
            try {
                const payload = ui.getInputValue('input-text');
                const parsed = JSON.parse(payload);
                parsed.pipeline.forEach((algo, index) => {
                    if (algo.toUpperCase() === 'RSA') {
                        const rsaInput = Array.from(inputs).find(inp => parseInt(inp.dataset.index) === index);
                        if (rsaInput) {
                            rsaInput.value = privKey;
                        }
                    }
                });
            } catch (e) {}
        }
    },

    // Tools
    copyOutput(btn) {
        const text = document.getElementById('output-area').innerText;
        clipboardManager.copyText(text, btn);
    },
    
    clearInput() {
        ui.setInputValue('input-text', '');
        ui.setInputValue('input-key', '');
        this.handlePayloadInput();
    },
    
    clearOutput() {
        outputManager.clearOutput();
    },

    downloadTxt() {
        const text = document.getElementById('output-area').innerText;
        if (!text) return outputManager.displayError("No content to download.");
        downloadManager.downloadTxt('cryptochain_output.txt', text);
    },
    
    downloadJson() {
        if (outputManager.lastResult) {
            downloadManager.downloadJson('cryptochain_output.json', outputManager.lastResult);
        } else {
            outputManager.displayError("No valid JSON metadata to export. Encrypt first.");
        }
    },
    
    clearHistory() {
        historyManager.clearHistory();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.app.init();
});
