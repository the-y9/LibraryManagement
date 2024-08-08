from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


SMTP_HOST = "localhost"
SMTP_PORT = 1025
SENDER_EMAIL = 'project.for.iitm@gmail.com'
SENDER_PASSWORD = '1@Yashmishra'

def send_message(to,subject, body):
    msg = MIMEMultipart()
    msg["To"] = to
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg.attach(MIMEText(body, 'text'))
    client = SMTP(host=SMTP_HOST, port=SMTP_PORT)
    client.send_message(msg=msg)
    client.quit()