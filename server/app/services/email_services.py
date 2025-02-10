from flask import current_app
from flask_mail import Message
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
from app.mail_config import mail  # Import mail from the new module

scheduler = BackgroundScheduler()
scheduler.start()

def send_email(recipient, subject, body):
    print(f"Preparing to send email to {recipient}")  # Debugging
    try:
        msg = Message(subject=subject, recipients=[recipient], body=body)
        with current_app.app_context():
            mail.send(msg)
        print(f"Email sent successfully to {recipient}")  # Debugging
    except Exception as e:
        print(f"Error sending email to {recipient}: {e}")  # Debugging
        raise

def schedule_email(appointment_date_str, recipient, subject, body):
    print(f"Scheduling email to {recipient} for {appointment_date_str}")  # Debugging
    appointment_date = datetime.strptime(appointment_date_str, "%Y-%m-%d")
    reminder_date = appointment_date - timedelta(days=1)
    print(f"Reminder date calculated as: {reminder_date}")  # Debugging

    try:
        scheduler.add_job(func=send_email, trigger='date', run_date=reminder_date,
                          args=[recipient, subject, body])
        print(f"Email scheduled successfully for {recipient}")  # Debugging
    except Exception as e:
        print(f"Error scheduling email for {recipient}: {e}")  # Debugging
        raise
