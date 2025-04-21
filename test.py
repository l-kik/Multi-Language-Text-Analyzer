from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import whisper
from nltk.translate.bleu_score import sentence_bleu

# Initialize models
MODEL_NAME = "facebook/nllb-200-distilled-600M"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
translation_model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)

# Initialize whisper
whisper_model = whisper.load_model("base")
# whisper_model.device = device

# Language code mapping
LANGUAGE_CODES = {
    "English": "eng_Latn",
    "Spanish": "spa_Latn",
    "French": "fra_Latn",
    "German": "deu_Latn",
    "Italian": "ita_Latn",
    "Portuguese": "por_Latn",
    "Russian": "rus_Cyrl",
    "Japanese": "jpn_Jpan",
    "Korean": "kor_Hang",
    "Chinese": "zho_Hans",
    "Arabic": "ara_Arab",
    "Hindi": "hin_Deva",
    "Dutch": "nld_Latn",
    "Greek": "ell_Grek",
    "Turkish": "tur_Latn"
}


def get_language_code(language_name):
    return LANGUAGE_CODES.get(language_name, "eng_Latn")


def process_text(text, targetLanguage):
    expected_translation = "Good a¡`fternoon"

    try:
        # Convert language names to codes
        target_code = get_language_code(targetLanguage)

        # Prepare input for translation
        inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)

        # inputs = tokenizer(text, return_tensors="pt").to(device)

        # Translate text
        translated_tokens = translation_model.generate(
            **inputs,
            forced_bos_token_id=tokenizer.convert_tokens_to_ids(target_code),
            max_length=int(1.5 * inputs["input_ids"].shape[1]),
            do_sample=False,
            num_beams=1,
            early_stopping=True
        )

        # Decode translation
        translation = tokenizer.batch_decode(translated_tokens, skip_special_tokens=True)[0]
        reference = [expected_translation.split()]
        candidate = translation.split()

        score = sentence_bleu(reference, candidate)
        print("Model Output:", translation)
        print("BLEU Score:", score)
    except Exception as e:
        raise Exception(f"Translation failed: {str(e)}")


process_text("Bon après-midi", "English")
# def speech_to_text(audio_path, targetLanguage):
#     try:
#         # Transcribe audio
#         transcription = whisper_model.transcribe(audio_path)
#         source_text = transcription["text"]

#         # Get target language code
#         target_code = get_language_code(targetLanguage)

#         # Prepare input for translation
#         inputs = tokenizer(source_text, return_tensors="pt")

#         # Translate text
#         translated_tokens = translation_model.generate(
#             **inputs,
#             forced_bos_token_id=tokenizer.lang_code_to_id[target_code],
#             max_length=100
#         )

#         # Decode translation
#         translation = tokenizer.batch_decode(translated_tokens, skip_special_tokens=True)[0]
#         return translation
#     except Exception as e:
#         raise Exception(f"Speech to text conversion failed: {str(e)}")