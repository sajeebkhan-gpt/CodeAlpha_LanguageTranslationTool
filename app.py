# app.py - Main Flask application for CodeAlpha Language Translation Tool
# Beginner-friendly comments included for internship learning

from flask import Flask, render_template, request, jsonify
from deep_translator import GoogleTranslator
import traceback

app = Flask(__name__)
app.config['SECRET_KEY'] = 'codealpha_internship_secret_key'  # For potential future enhancements

# Common languages supported by Google Translator (name: code)
LANGUAGES = {
    "Auto Detect": "auto",
    "Afrikaans": "af",
    "Albanian": "sq",
    "Arabic": "ar",
    "Armenian": "hy",
    "Azerbaijani": "az",
    "Bengali": "bn",
    "Bosnian": "bs",
    "Bulgarian": "bg",
    "Catalan": "ca",
    "Chinese (Simplified)": "zh-CN",
    "Chinese (Traditional)": "zh-TW",
    "Croatian": "hr",
    "Czech": "cs",
    "Danish": "da",
    "Dutch": "nl",
    "English": "en",
    "Esperanto": "eo",
    "Estonian": "et",
    "Filipino": "tl",
    "Finnish": "fi",
    "French": "fr",
    "German": "de",
    "Greek": "el",
    "Gujarati": "gu",
    "Haitian Creole": "ht",
    "Hebrew": "iw",
    "Hindi": "hi",
    "Hungarian": "hu",
    "Icelandic": "is",
    "Indonesian": "id",
    "Irish": "ga",
    "Italian": "it",
    "Japanese": "ja",
    "Javanese": "jw",
    "Kannada": "kn",
    "Kazakh": "kk",
    "Korean": "ko",
    "Latin": "la",
    "Latvian": "lv",
    "Lithuanian": "lt",
    "Macedonian": "mk",
    "Malay": "ms",
    "Malayalam": "ml",
    "Maltese": "mt",
    "Marathi": "mr",
    "Mongolian": "mn",
    "Nepali": "ne",
    "Norwegian": "no",
    "Persian": "fa",
    "Polish": "pl",
    "Portuguese": "pt",
    "Punjabi": "pa",
    "Romanian": "ro",
    "Russian": "ru",
    "Serbian": "sr",
    "Sinhala": "si",
    "Slovak": "sk",
    "Slovenian": "sl",
    "Spanish": "es",
    "Swahili": "sw",
    "Swedish": "sv",
    "Tamil": "ta",
    "Telugu": "te",
    "Thai": "th",
    "Turkish": "tr",
    "Ukrainian": "uk",
    "Urdu": "ur",
    "Uzbek": "uz",
    "Vietnamese": "vi",
    "Welsh": "cy",
    "Xhosa": "xh",
    "Zulu": "zu"
}

@app.route('/')
def index():
    """Render the main translation page"""
    return render_template('index.html')

@app.route('/translate', methods=['POST'])
def translate():
    """API endpoint to handle translation requests"""
    try:
        data = request.get_json()
        text = data.get('text', '').strip()
        source = data.get('source', 'auto')
        target = data.get('target', 'en')

        if not text:
            return jsonify({'error': 'Please enter text to translate'}), 400

        if len(text) > 5000:
            return jsonify({'error': 'Text is too long. Maximum 5000 characters allowed.'}), 400

        # Perform translation
        translator = GoogleTranslator(source=source, target=target)
        translated = translator.translate(text)

        return jsonify({
            'translated_text': translated,
            'source': source,
            'target': target
        })

    except Exception as e:
        error_msg = str(e)
        # Common error handling for deep-translator
        if "Connection" in error_msg or "Timeout" in error_msg:
            error_msg = "Connection error. Please check your internet connection."
        elif "language" in error_msg.lower():
            error_msg = "Invalid language selection. Please try different languages."
        else:
            error_msg = "Translation failed. Please try again."
        
        return jsonify({'error': error_msg}), 500

if __name__ == '__main__':
    # Run in debug mode for development (set to False in production)
    app.run(debug=True, host='0.0.0.0', port=5000)