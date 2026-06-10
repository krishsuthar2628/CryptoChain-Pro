const API_BASE = 'http://localhost:8000';

/**
 * Convert a FastAPI `detail` value to a readable string.
 * FastAPI can return detail as:
 *   - a plain string  → use as-is
 *   - an array of validation error objects → join their `msg` fields
 *   - anything else   → JSON.stringify as fallback
 */
function parseDetail(detail) {
    if (!detail) return null;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
        return detail.map(d => {
            const loc = d.loc ? d.loc.join(' → ') : '';
            return loc ? `${loc}: ${d.msg}` : d.msg;
        }).join('\n');
    }
    return JSON.stringify(detail);
}

async function safeFetch(url, options) {
    let response;
    try {
        response = await fetch(url, options);
    } catch (networkErr) {
        throw new Error(`Cannot reach server at ${API_BASE}. Is the backend running?`);
    }
    let data;
    try {
        data = await response.json();
    } catch {
        throw new Error(`Server returned a non-JSON response (status ${response.status})`);
    }
    if (!response.ok) {
        throw new Error(parseDetail(data.detail) || `Request failed (${response.status})`);
    }
    return data;
}

async function encryptData(text, key, pipeline, keys = null) {
    return safeFetch(`${API_BASE}/encrypt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, key, pipeline, keys })
    });
}

async function decryptData(encrypted_payload, key, keys = null) {
    return safeFetch(`${API_BASE}/decrypt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encrypted_payload, key, keys })
    });
}

async function generateRSAKeys() {
    return safeFetch(`${API_BASE}/generate-rsa`, { method: 'POST' });
}

export const api = { encryptData, decryptData, generateRSAKeys };
