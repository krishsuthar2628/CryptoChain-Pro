export const outputManager = {
    lastResult: null,
    
    displayResult(jsonObj) {
        this.lastResult = jsonObj;
        const outputArea = document.getElementById('output-area');
        outputArea.innerText = JSON.stringify(jsonObj, null, 2);
    },
    
    displayText(text) {
        this.lastResult = null;
        const outputArea = document.getElementById('output-area');
        outputArea.innerText = text;
    },
    
    displayError(errorMsg) {
        this.lastResult = null;
        const outputArea = document.getElementById('output-area');
        outputArea.innerText = "ERROR: " + errorMsg;
        outputArea.classList.add('shake');
        setTimeout(() => outputArea.classList.remove('shake'), 500);
    },

    clearOutput() {
        this.lastResult = null;
        document.getElementById('output-area').innerText = '';
    }
};
