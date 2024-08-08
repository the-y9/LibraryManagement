from flask import current_app as app, jsonify,request, render_template, send_file
from flask_security import auth_required, roles_required
from werkzeug.security import check_password_hash,generate_password_hash
from application.sec import datastore 
from flask_restful import marshal, fields
import flask_excel as excel
from celery.result import AsyncResult
from .tasks import create_issues_csv
from .models import User, Issues,db
from .sec import datastore
from sqlalchemy import or_ 
import smtplib

@app.get('/')
def home():
    return render_template("index.html")

@app.get('/admin')
@auth_required("token")
@roles_required("admin")
def admin():
    return "Welcome admin"

@app.get('/activate/user/<int:user_id>')
@auth_required("token")
@roles_required("admin")
def activate(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}),404
    
    user.active=True
    db.session.commit()
    return jsonify({"message":"User Activated"})

@app.post('/user-signup')
def signup():
    data = request.get_json()
    if datastore.find_user(email=data.get('email')):
        return jsonify({'message': 'Email already registered'}), 400 
    if not data.get("password"):
        return jsonify({"message":"Password not provided"}),400
       
    try:
        datastore.create_user(
            email=data['email'],
            password=generate_password_hash(data['password']),
            roles=['user'],  
            active=False
        )
        db.session.commit()
        return jsonify({'message': 'User successfully registered'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500
    


@app.post('/user-login')
def user_login():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message":"Email not provided"}),400
    if not data.get("password"):
        return jsonify({"message":"Password not provided"}),400
    
    user = datastore.find_user(email=email)
    
    if not user:
        return jsonify({"message":"Email not found."}),404
    
    if check_password_hash(user.password, data.get("password")):
        if user.active:
            return jsonify({"token":user.get_auth_token(),"email":user.email,"role":user.roles[0].name}),200
        else:
            return jsonify({"message":"User not activated"}),403
    
    else: 
        return jsonify({"message":"Wrong password"}),400
    
user_fields = {
    "id": fields.Integer,
    "email": fields.String,
    "active": fields.Boolean,
}

@app.get("/users")
@auth_required("token")
@roles_required("admin")
def all_users():
    users = User.query.all()
    # iusers = User.query.filter(User.active == False).all()
    # ausers = User.query.filter(User.active).all()
    if len(users) ==0:
        return jsonify({"message":"No Users"}), 404
    return marshal(users, user_fields)

issue_fields = {
    "id":fields.Integer,
    "user_id": fields.String,
    "action": fields.String,
    "book_id": fields.Integer,
    "r_datetime": fields.DateTime,
    "a_datetime": fields.DateTime,
}

@app.get("/issues")
@auth_required("token")
@roles_required("admin")
def all_issues():
    issues = Issues.query.all()
    if len(issues) ==0:
        return jsonify({"message":"No Issues"}), 404
    return marshal(issues, issue_fields)

@app.get('/action/<int:issue_id>/<string:a>')
@auth_required("token")
@roles_required("admin")
def action(issue_id,a):
    issue = Issues.query.get(issue_id)
    if not issue:
        return jsonify({"message": "Issue not found"}),404
    
    issue.action=a
    db.session.commit()
    return jsonify({"message":f"Book {a}"})

@app.get('/ret/<int:issue_id>/<string:a>')
@auth_required("token")
@roles_required("user")
def ret(issue_id,a):
    issue = Issues.query.get(issue_id)
    if not issue:
        return jsonify({"message": "Issue not found"}),404
    
    issue.action=a
    db.session.commit()
    return jsonify({"message":f"Book {a}"})



@app.get('/download-csv')
def download_csv():
    task = create_issues_csv.delay()
    return jsonify({"Task-id": task.id})

@app.get('/get-csv/<task_id>')
def get_csv(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename = res.result
        return send_file(filename, as_attachment=True)
    else:
        return jsonify({"message":"Task Pending"}), 404
    
