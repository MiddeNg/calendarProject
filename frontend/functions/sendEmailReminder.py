from firebase_admin import credentials, firestore, initialize_app, auth
from firebase_admin._auth_utils import UserNotFoundError
from firebase_functions import scheduler_fn
import datetime
import smtplib
from email.message import EmailMessage
import google.auth
from googleapiclient.discovery import build
from email.mime.text import MIMEText
import base64

initialize_app()
creds, _ = google.auth.default()
service = build('gmail', 'v1', credentials=creds)

def send_email(sender_email, receiver_email, subject, content):
    message = EmailMessage()

    message.set_content(content)

    message["To"] = receiver_email
    message["From"] = sender_email
    message["Subject"] = subject

    # encoded message
    a = message.as_bytes()
    encoded_message = base64.urlsafe_b64encode(a)
    encoded_message = encoded_message.decode()
    create_message = {"message": {"raw": encoded_message}}
    # pylint: disable=E1101
    draft = (
        service.users()
        .drafts()
        .create(userId="me", body=create_message)
        .execute()
    )
    return draft

def send_reminder_email():
    
    db = firestore.client()

    start = datetime.datetime.now() +datetime.timedelta(hours=1)
    end = start + datetime.timedelta(hours=1)

    events_ref = db.collection('events')
    query = events_ref.where('startDateTime', '<', end).stream()
    count = 0
    for event in query:
        count += 1
        event_data = event.to_dict()
        event_name = event_data.get('name')
        user_id = event_data.get('uid')

        try:
            user = auth.get_user(user_id)
            user_email = user.email
        except Exception as e:
            if isinstance(e, UserNotFoundError):
                continue
            else:
                print(e)
                continue
        print(user_email)
        sender_email = 'williamcalendarproject@gmail.com'  
        subject = 'Event Reminder'
        message = f'Don\'t forget about the event: {event_name}!'
        try:
            send_email(sender_email, user_email, subject, message)
        except Exception as e:
            print(e)

    print(f"{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')} - {count} Reminder email sent")

if __name__ == '__main__':
    send_reminder_email()