from flask import Blueprint, render_template, request, redirect, url_for, session, jsonify
import sqlite3, time

views = Blueprint('views', __name__)

# Lista svih stranica za zadatke
TASK_PAGES = [
    "track1.html",
    "track2.html",
    "track3.html"
]

@views.route('/track')
def track():
    if 'username' not in session or 'selected_device' not in session:
        return redirect(url_for('views.home'))  # Preusmjeri na home ako uređaj nije odabran
    
    # Početak zadataka
    session['current_task_index'] = 0
    username = session['username']
    device = session['selected_device']
    return render_template('track1.html', username=username, device=device)


@views.route('/', methods=['GET', 'POST'])
def login():
    if 'username' in session:
        return redirect(url_for('views.home'))
    
    if request.method == 'POST':
        username = request.form['username']
        session['username'] = username
        session['selected_device'] = None  # Resetiraj odabir uređaja pri loginu
        return redirect(url_for('views.home'))
    
    return render_template('login.html')

@views.route('/home', methods=['GET', 'POST'])
def home():
    if 'username' not in session:
        return redirect(url_for('views.login')) 
    
    username = session['username']

    if request.method == 'POST':
        selected_device = request.form.get('device')
        if selected_device:
            session['selected_device'] = selected_device
            return redirect(url_for('views.track'))
    
    return render_template('home.html', username=username)

@views.route('/logout')
def logout():
    session.pop('username', None)
    session.pop('selected_device', None)
    session.pop('current_task_index', None)
    return redirect(url_for('views.login'))

@views.route('/task-completed', methods=['POST'])
def task_completed():
    data = request.get_json()

    elapsed_time = data.get('elapsedTime')
    error_count = data.get('errorCount')
    username = session.get('username')
    trackId = data.get('trackId')
    device = session.get('selected_device')
    
    conn = sqlite3.connect('database.db')
    c = conn.cursor()

    c.execute('''INSERT INTO task_results (time, errors, username, trackid, device)
                 VALUES (?, ?, ?, ?, ?)''', (elapsed_time, error_count, username, trackId, device))
    
    conn.commit()
    conn.close()

    time.sleep(3)

    # Postavi indeks za sljedeću stranicu
    current_index = session.get('current_task_index', 0)
    if current_index < len(TASK_PAGES) - 1:
        session['current_task_index'] = current_index + 1
        next_page = TASK_PAGES[current_index + 1]
    else:
        return jsonify({"message": "Sve stranice su završene.", "finished": True}), 200

    return jsonify({"message": "Podaci su uspješno pohranjeni.", "next_page": next_page}), 200

@views.route('/next-task')
def next_task():
    current_index = session.get('current_task_index', 0)
    if current_index >= len(TASK_PAGES):
        return redirect(url_for('views.home'))  # Vraćamo se na početak nakon svih zadataka

    username = session['username']
    device = session['selected_device']
    return render_template(TASK_PAGES[current_index], username=username, device=device)
