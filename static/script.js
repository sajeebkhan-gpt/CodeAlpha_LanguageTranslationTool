// static/script.js - Client-side logic for Language Translator

document.addEventListener('DOMContentLoaded', () => {
    const languages = {
        "Auto Detect": "auto",
        "English": "en",
        "Spanish": "es",
        "French": "fr",
        "German": "de",
        "Italian": "it",
        "Portuguese": "pt",
        "Russian": "ru",
        "Chinese (Simplified)": "zh-CN",
        "Japanese": "ja",
        "Korean": "ko",
        "Arabic": "ar",
        "Hindi": "hi",
        "Bengali": "bn",
        // Add more as needed from backend
    };

    // Full list passed from Flask (you can expand)
    const fullLanguages = {
        "Auto Detect": "auto", "Afrikaans": "af", "Albanian": "sq", "Arabic": "ar",
        "Armenian": "hy", "Azerbaijani": "az", "Bengali": "bn", "Bulgarian": "bg",
        "Catalan": "ca", "Chinese (Simplified)": "zh-CN", "Chinese (Traditional)": "zh-TW",
        "Croatian": "hr", "Czech": "cs", "Danish": "da", "Dutch": "nl", "English": "en",
        "Finnish": "fi", "French": "fr", "German": "de", "Greek": "el", "Hebrew": "iw",
        "Hindi": "hi", "Hungarian": "hu", "Indonesian": "id", "Italian": "it",
        "Japanese": "ja", "Korean": "ko", "Malay": "ms", "Norwegian": "no",
        "Persian": "fa", "Polish": "pl", "Portuguese": "pt", "Romanian": "ro",
        "Russian": "ru", "Spanish": "es", "Swedish": "sv", "Thai": "th",
        "Turkish": "tr", "Ukrainian": "uk", "Vietnamese": "vi"
    };

    // Populate dropdowns
    function populateDropdowns() {
        const sourceSelect = document.getElementById('source-lang');
        const targetSelect = document.getElementById('target-lang');

        sourceSelect.innerHTML = '';
        targetSelect.innerHTML = '';

        Object.keys(fullLanguages).forEach(lang => {
            const option1 = document.createElement('option');
            option1.value = fullLanguages[lang];
            option1.textContent = lang;
            sourceSelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = fullLanguages[lang];
            option2.textContent = lang;
            if (lang !== "Auto Detect") targetSelect.appendChild(option2);
        });

        // Default selections
        sourceSelect.value = 'auto';
        targetSelect.value = 'es'; // Default to Spanish
    }

    populateDropdowns();

    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const translateBtn = document.getElementById('translate-btn');
    const swapBtn = document.getElementById('swap-btn');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');
    const autoDetectBtn = document.getElementById('auto-detect');
    const errorDiv = document.getElementById('error-message');
    const inputCount = document.getElementById('input-count');

    // Character counter
    inputText.addEventListener('input', () => {
        const count = inputText.value.length;
        inputCount.textContent = count;
        if (count > 5000) {
            inputCount.style.color = 'red';
        } else {
            inputCount.style.color = '#888';
        }
    });

    // Translate function
    async function translateText() {
        const text = inputText.value.trim();
        if (!text) {
            showError("Please enter some text to translate.");
            return;
        }

        const source = document.getElementById('source-lang').value;
        const target = document.getElementById('target-lang').value;

        if (source === target && source !== 'auto') {
            showError("Source and target languages cannot be the same.");
            return;
        }

        translateBtn.disabled = true;
        translateBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Translating...`;

        try {
            const response = await fetch('/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, source, target })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Translation failed');
            }

            outputText.textContent = data.translated_text;
            errorDiv.style.display = 'none';
        } catch (error) {
            showError(error.message);
        } finally {
            translateBtn.disabled = false;
            translateBtn.innerHTML = `<i class="fas fa-arrow-right"></i> Translate`;
        }
    }

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }

    // Event Listeners
    translateBtn.addEventListener('click', translateText);

    swapBtn.addEventListener('click', () => {
        const sourceSelect = document.getElementById('source-lang');
        const targetSelect = document.getElementById('target-lang');
        
        const temp = sourceSelect.value;
        sourceSelect.value = targetSelect.value;
        targetSelect.value = temp;

        // Swap text if output has content
        if (outputText.textContent && outputText.textContent !== 'Translation will appear here...') {
            const tempText = inputText.value;
            inputText.value = outputText.textContent;
            outputText.textContent = tempText;
        }
    });

    copyBtn.addEventListener('click', () => {
        const text = outputText.textContent;
        if (text && text !== 'Translation will appear here...') {
            navigator.clipboard.writeText(text).then(() => {
                const original = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyBtn.innerHTML = original;
                }, 2000);
            });
        }
    });

    clearBtn.addEventListener('click', () => {
        inputText.value = '';
        outputText.textContent = 'Translation will appear here...';
        inputCount.textContent = '0';
    });

    autoDetectBtn.addEventListener('click', () => {
        document.getElementById('source-lang').value = 'auto';
        showError("Auto detection enabled. Language will be detected automatically.");
    });

    // Allow pressing Enter in textarea (Ctrl+Enter to translate)
    inputText.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            translateText();
        }
    });

    // Keyboard shortcut hint in console
    console.log('%cCodeAlpha Translator ready! Press Ctrl+Enter to translate.', 'color: #4a6cf7; font-weight: bold');
});