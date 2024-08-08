from flask_restful import Resource, Api, reqparse, marshal_with, fields
from flask_security import auth_required, roles_required, current_user
from application.models import Books,Issues, db
from sqlalchemy import func
from flask import jsonify
from .instance import cache
api = Api(prefix='/api')
parser = reqparse.RequestParser()
parser.add_argument('title',type=str,help='A string is required', required=True)
parser.add_argument('author',type=str,help='Author is a string')
parser.add_argument('section',type=str,help='Section is a string')

iparser = reqparse.RequestParser()
iparser.add_argument('user_id',type=str,help='A string is required', required=True)
iparser.add_argument('book_id',type=int,help='integer', required=True)
iparser.add_argument('action',type=str,help=' a string', required=True)




book_fields = {
    'id':fields.Integer,
    'title':fields.String,
    'author':fields.String,
    'section':fields.String,
}

class book(Resource):
    @marshal_with(book_fields)
    @auth_required("token")
    # @cache.cached(timeout=50)
    def get(self):
        all_books = Books.query.all()
        all_sections = db.session.query(Books.section).distinct().all()
        all_authors = db.session.query(Books.author).distinct().all()
        return [all_books,all_sections,all_authors]
    
    @auth_required("token")
    @roles_required("admin")
    def post(self):
        try:
            args = parser.parse_args()
            book =  Books(title=args.get("title"),author=args.get
            ("author"),section=args.get("section"))
            db.session.add(book)
            db.session.commit()
            return {"message": 'book created'}

        except Exception as e:
            return {"message":'Title is empty'}
        
api.add_resource(book, '/book')

issue_fields = {
    'id':fields.Integer,
    'user_id':fields.String,
    'book_id':fields.Integer,
    'datetime':fields.DateTime,
    'action':fields.String,
}

class issue(Resource):
    @marshal_with(issue_fields)
    @auth_required("token")
    def get(self):
        all_issues = Issues.query.all()
        return all_issues
    
    @auth_required("token")
    @roles_required("user")
    def post(self):        
        try:
            args = iparser.parse_args()
            issue =  Issues(user_id=args.get("user_id"),book_id=args.get
            ("book_id"),action=args.get("action"))
            db.session.add(issue)
            db.session.commit()
            return {"message": 'book requested'}

        except Exception as e:
            return {"message":f"An error occurred: {e}"}
        
api.add_resource(issue, '/issue')

allowed_issues = {
    "id": fields.Integer,
    "action": fields.String,
    "a_datetime":fields.DateTime,
    "book_title": fields.String(attribute=lambda x: x.book.title),
    "book_author": fields.String(attribute=lambda x: x.book.author),
    "book_section": fields.String(attribute=lambda x: x.book.section),
}

class allowedIssue(Resource):
    @marshal_with(allowed_issues)
    @auth_required("token")
    def get(self):
        try:
            all_issues = Issues.query\
            .join(Books, Issues.book_id == Books.id)\
            .filter(Issues.action == 'Allowed').all()
            return all_issues
        except Exception as e:
            return e
    
api.add_resource(allowedIssue, '/allowedIssue')


class bookCounts(Resource):
    @auth_required("token")
    @roles_required("admin")
    def get(self):
        try:
            counts = Issues.query\
                .join(Books, Issues.book_id == Books.id)\
                .with_entities(Issues.book_id,Books.title, func.count(Issues.book_id).label('book_counts')) \
                                  .group_by(Issues.book_id) \
                                  .all()
            
            counts_data = [{'book_id': book_id, 'book_title': title, 'book_counts': count} for book_id, title, count in counts]
            return counts_data
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
api.add_resource(bookCounts, '/bookCounts')

class adminActivity(Resource):
    @auth_required("token")
    @roles_required("admin")
    def get(self):
        try:
            activity = Issues.query\
                .with_entities(Issues.id,Issues.a_datetime, Issues.action) \
                .filter(Issues.a_datetime != None).all()
            
            activity_data = [{'id': id, 'a_datetime': str(a_datetime), 'action': action} for id, a_datetime, action in activity]
            return activity_data
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
api.add_resource(adminActivity, '/adminActivity')

edit_book_fields = {
    'id':fields.Integer,
    'title':fields.String,
    'author':fields.String,
    'section':fields.String,
}

class editBook(Resource):
    @marshal_with(edit_book_fields)
    @auth_required("token")
    @roles_required("admin")
    def get(self, id):
        print("id - ", id)
        book = Books.query.filter_by(id=id).first()
        if book:
            return book
        return {'message': 'Book not found'}, 404
    
    @marshal_with(edit_book_fields)
    @auth_required("token")
    @roles_required("admin")
    def post(self, id):        
        try:
            args = parser.parse_args()
            book_data = Books.query.filter_by(id=id).first()
            if not book_data:
                return {"message": "Book not found"}, 404
            book_data.title =  args['title'] if args['title'] else book.title
            book_data.author =  args['author'] if args['author'] else book.author
            book_data.section =  args['section'] if args['section'] else book.section
            db.session.commit()
            return {"message": f"Book id: {id} Title: {args['title']} Author: {args['author']} Section: {args['section']} updated successfully"}, 200

        except Exception as e:
            return {"message":f"An error occurred: {e}"}
        
api.add_resource(editBook, '/editBook/<int:id>')

class delBook(Resource):
    def post(self, id):
        book_to_del = Books.query.get(id)
        if book_to_del:
            db.session.delete(book_to_del)
            db.session.commit()
            return {"message": f'{book_to_del.title} deleted successfully.'}
        return {"error": "Book not found"},404
api.add_resource(delBook, '/delBook/<int:id>')