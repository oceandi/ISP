from flask import Flask, render_template, request, jsonify, redirect, url_for, session, make_response
import requests
import os
import openai
from dotenv import load_dotenv
import json
from urllib.parse import quote_plus, urlencode
from authlib.integrations.flask_client import OAuth
from datetime import timedelta
from flask_session import Session

client = openai.OpenAI()

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__, static_folder='static', template_folder='templates')
app.secret_key = os.getenv("APP_SECRET_KEY")

app.config['SESSION_COOKIE_SECURE'] = True
app.permanent_session_lifetime = timedelta(days=365)
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

@app.before_request
def before_request():
    server_name = 'www.univacai.com'
    if request.host != server_name and 'univacai.com' in request.host:
        url = request.url.replace(request.host, server_name, 1)
        code = 301  # Kalıcı yönlendirme için HTTP durum kodu
        return redirect(url, code=code)

# OpenAI API'yi kullanarak sohbet tamamlama işlevi
def get_chat_response(message):
    api_key = os.getenv("OPENAI_API_KEY")

    client = openai.OpenAI(api_key=api_key)

    chat_history = session.get('chat_history', [])
    chat_history.append({"role": "user", "content": message})

    response = client.chat.completions.create(
        model="gpt-4",
        messages=chat_history,
    )
    answer = response.choices[0].message.content
    chat_history.append({"role": "assistant", "content": answer})
    session['chat_history'] = chat_history
    return answer

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/api", methods=["POST"])
def api():
    data = request.json
    message = data.get("message")
    response = get_chat_response(message)
    return jsonify({'answer': response})

@app.route('/auth-response')
def auth_response():
    # OAuth sağlayıcısından gelen kodu burada alabilirsiniz
    code = request.args.get('code')

    # Bu kod ile bir token almak için OAuth sağlayıcısına bir istek gönderin
    # Token alma işlemi burada gerçekleştirilir

    # Token başarılı bir şekilde alındıysa, kullanıcıyı başka bir sayfaya yönlendirebilirsiniz
    # Örneğin kullanıcının profil sayfasına veya ana sayfaya
    return redirect(url_for('index'))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=os.getenv("PORT", 3000))
