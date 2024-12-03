import os
from firebase_admin import firestore, initialize_app, auth
from firebase_admin import datetime as firebase_datetime
from firebase_functions import scheduler_fn
import datetime
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

initialize_app()

def send_email(sender_email, sender_password, receiver_email, subject, message):
    # Set up the SMTP server
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(sender_email, sender_password)

    # Create message
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = subject
    msg.attach(MIMEText(message, 'plain'))

    # Send mail
    server.send_message(msg)
    del msg
    server.quit()

@scheduler_fn.on_schedule(schedule='every 1 hours', secrets=["EMAIL_PASSWORD"])
def send_reminder_email(event: scheduler_fn.ScheduledEvent):
    EMAIL_PASSWORD = os.environ.get('EMAIL_PASSWORD')
    if EMAIL_PASSWORD is None:
        raise Exception('EMAIL_PASSWORD environment variable is not set')

    db = firestore.client()

    start = datetime.datetime.now() +datetime.timedelta(hours=1)
    end = start + datetime.timedelta(hours=1)
    print("start", start)
    print("end", end)
    events_ref = db.collection('events')
    query = events_ref.where('startDateTime', '>=', start).where('startDateTime', '<', end).stream()
    count = 0
    for event in query:
        count += 1
        event_data = event.to_dict()
        event_name = event_data.get('name')
        user_id = event_data.get('uid')
        user = auth.get_user(user_id)
        user_email = user.email
        print("event", event)
        sender_email = 'williamcalendarproject@gmail.com'  # Update with your sender email
        sender_password = EMAIL_PASSWORD  # Update with your sender email password
        subject = 'Event Reminder'
        print(type(event_data.get("startDateTime")))
        print(event_data.get("startDateTime"))

        message = f"Don\'t forget about the event: {event_name} starting at {event_data.get('startDateTime').strftime('%Y-%m-%d %H:%M:%S %Z')}!"
        send_email(sender_email, sender_password, user_email, subject, message)

    print(f"{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')} - {count} Reminder email sent")
