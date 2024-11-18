from flask import Blueprint, render_template, request, redirect, url_for, session

views = Blueprint('views', __name__)

@views.route('/home')
def home():
    if 'username' not in session:
        return redirect(url_for('views.login')) 
    username = session['username']
    return render_template('home.html', username=username)

@views.route('/', methods=['GET', 'POST'])
def login():
    if 'username' in session:
        return redirect(url_for('views.home'))
    
    if request.method == 'POST':
        username = request.form['username']
        session['username'] = username 
        return redirect(url_for('views.home'))
    
    return render_template('login.html')

@views.route('/logout')
def logout():
    session.pop('username', None) 
    return redirect(url_for('views.login'))
