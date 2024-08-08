from celery import shared_task
from .models import Issues,Books
import flask_excel as excel
import pytz
from datetime import datetime
from .mail_service import send_message
from .models import User
from .sec import datastore
import jinja2

@shared_task(ignore_result = False)
def create_issues_csv():
    issues = Issues.query\
        .join(Books, Issues.book_id==Books.id)\
        .with_entities(Issues.user_id,Issues.r_datetime,Books.title,Issues.action,
        Issues.a_datetime).all()
    csv_output = excel.make_response_from_query_sets(issues,["user_id","r_datetime","title","action","a_datetime"],"csv")
    filename = "Issues_Statement.csv"

    with open(filename, 'wb') as f:
        f.write(csv_output.data)

    return filename

@shared_task(ignore_result=True)
def daily_reminder():
    users  = User.query.all()
    for u in users:
        send_message(u.email,'Daily Reminder!','Every book is a journey, and every day offers a new adventure within its pages.\nRead a book today.')
    return "OK"