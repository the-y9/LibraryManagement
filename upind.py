from main import app
from application.sec import datastore 
from application.models import db, Role, Books
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()
    datastore.find_or_create_role(name="admin", description="librarian")
    datastore.find_or_create_role(name="user", description="user")
    db.session.commit()

    if not datastore.find_user(email="admin@g.com"):
        datastore.create_user(email="admin@g.com",password=generate_password_hash("ad"), roles=["admin"], active=True)
    if not datastore.find_user(email="u1@g.com"):
        datastore.create_user(email="u1@g.com",password=generate_password_hash("u1"), roles=["user"],active=True)
    if not datastore.find_user(email="u2@g.com"):
        datastore.create_user(email="u2@g.com",password=generate_password_hash("u2"), roles=["user"], active=False)
    db.session.commit()

    books_data = [
        {"title": "Book 1", "author": "Author 1", "section": "Section A"},
        {"title": "Book 2", "author": "Author 2", "section": "Section B"},
        {"title": "Book 3", "author": "Author 3", "section": "Section C"},
    ]
    for book_info in books_data:
        book = Books(**book_info)
        db.session.add(book)
    db.session.commit()
    


   

