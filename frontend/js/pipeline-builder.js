export const pipelineBuilder = {
    pipeline: [],
    
    addAlgorithm(algo) {
        this.pipeline.push({ name: algo, key: '' });
        this.render();
    },
    
    removeAlgorithm(index) {
        this.pipeline.splice(index, 1);
        this.render();
    },
    
    moveUp(index) {
        if (index > 0) {
            [this.pipeline[index - 1], this.pipeline[index]] = [this.pipeline[index], this.pipeline[index - 1]];
            this.render();
        }
    },
    
    moveDown(index) {
        if (index < this.pipeline.length - 1) {
            [this.pipeline[index + 1], this.pipeline[index]] = [this.pipeline[index], this.pipeline[index + 1]];
            this.render();
        }
    },
    
    getPipeline() {
        return this.pipeline.map(item => item.name);
    },
    
    getPipelineKeys() {
        return this.pipeline.map(item => item.key || '');
    },
    
    render() {
        const container = document.getElementById('pipeline-list');
        if (!container) return;
        container.innerHTML = '';
        
        if (this.pipeline.length === 0) {
            container.innerHTML = '<div style="color: var(--text-muted); font-size: 0.875rem; text-align: center; padding: 20px 0;">No algorithms added.<br>Select from the available algorithms above.</div>';
            return;
        }

        this.pipeline.forEach((item, index) => {
            const algo = item.name;
            const keyVal = item.key || '';
            const algoUpper = algo.toUpperCase();
            const needsKey = ['AES', 'CHACHA20', 'RSA'].includes(algoUpper);
            
            const div = document.createElement('div');
            div.className = 'pipeline-item fade-in';
            div.style.flexDirection = 'column';
            div.style.alignItems = 'stretch';
            div.style.gap = '8px';

            let keyInputHtml = '';
            if (needsKey) {
                let placeholder = `Enter key for ${algo}...`;
                if (algoUpper === 'RSA') {
                    placeholder = 'Paste RSA public key (PEM)...';
                }
                
                if (algoUpper === 'RSA') {
                    keyInputHtml = `
                        <div class="pipeline-key-group" style="margin-top: 4px;">
                            <textarea class="form-control pipeline-key-field" 
                                      placeholder="${placeholder}" 
                                      style="min-height: 60px; font-size: 0.75rem; font-family: var(--font-mono); padding: 6px;" 
                                      data-index="${index}">${keyVal}</textarea>
                        </div>
                    `;
                } else {
                    keyInputHtml = `
                        <div class="pipeline-key-group" style="margin-top: 4px; display: flex; gap: 4px;">
                            <input type="password" class="form-control pipeline-key-field" 
                                   value="${keyVal.replace(/"/g, '&quot;')}"
                                   placeholder="${placeholder}" 
                                   style="font-size: 0.75rem; font-family: var(--font-mono); padding: 6px; flex: 1;" 
                                   data-index="${index}">
                            <button class="btn btn-outline btn-sm" 
                                    onclick="const inp = this.previousElementSibling; inp.type = inp.type === 'password' ? 'text' : 'password'; event.preventDefault();"
                                    style="padding: 0 6px; font-size: 0.75rem;">👁</button>
                        </div>
                    `;
                }
            }

            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div class="pipeline-item-title">${index + 1}. ${algo}</div>
                    <div class="pipeline-controls">
                        <button class="btn-icon" onclick="window.app.moveAlgoUp(${index})" title="Move Up">↑</button>
                        <button class="btn-icon" onclick="window.app.moveAlgoDown(${index})" title="Move Down">↓</button>
                        <button class="btn-icon" onclick="window.app.removeAlgo(${index})" title="Remove">✕</button>
                    </div>
                </div>
                ${keyInputHtml}
            `;
            
            if (needsKey) {
                const inputElement = div.querySelector('.pipeline-key-field');
                if (inputElement) {
                    inputElement.addEventListener('input', (e) => {
                        this.pipeline[index].key = e.target.value;
                    });
                }
            }
            
            container.appendChild(div);
        });
    }
};
