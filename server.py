from flask import Flask, request, jsonify
from flask_cors import CORS
from logic import process_text


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.route('/api/translate', methods=['POST', 'OPTIONS'])
def translate():
    if request.method == 'OPTIONS':
        return '', 204  # 💡 preflight response

    data = request.json
    print("Received data:", data)
    try:
        result = process_text(
            data['text'],
            data['tgt_Lang']
        )
        return jsonify({'result': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)


# @app.route('/api/speech-to-text', methods=['POST'])
# def speech_to_text():
#     try:
#         audio_data = request.files['audio']
#         target_language = request.form['targetLanguage']
#         # Call your existing speech-to-text function from main.py
#         text = logic.speech_to_text(audio_data, target_language)
#         return jsonify({'text': text})
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


# if __name__ == '__main__':
#     app.run(port=5000)