"""
AXE Packages - Flask Web Server
Serves all HTML pages and handles contact form email submission.
"""

from flask import Flask, request, jsonify, send_from_directory
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging

# Setup logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)

# ─────────────────────────────────────────────
# EMAIL CONFIGURATION - UPDATE THESE VALUES
# ─────────────────────────────────────────────
# IMPORTANT: To make email work, you need to:
# 1. Go to your Gmail account settings
# 2. Enable 2-Factor Authentication
# 3. Generate an App Password: https://myaccount.google.com/apppasswords
# 4. Copy the 16-character password and paste it below

SMTP_SERVER   = "smtp.gmail.com"
SMTP_PORT     = 587
SENDER_EMAIL  = "sheikh.maaz1308@gmail.com"
SENDER_PASS   = "hmhishvekvsucjxl"  # Your app password
RECEIVER_EMAIL= "sheikh.maaz1308@gmail.com"

# Alternative: Use environment variables (more secure)
# SENDER_PASS = os.environ.get('GMAIL_APP_PASSWORD', '')

# ─────────────────────────────────────────────
# STATIC FILE ROUTES
# ─────────────────────────────────────────────

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/products')
@app.route('/products.html')
def serve_products():
    return send_from_directory('.', 'products.html')

@app.route('/about')
@app.route('/about.html')
def serve_about():
    return send_from_directory('.', 'about.html')

@app.route('/clients')
@app.route('/clients.html')
def serve_clients():
    return send_from_directory('.', 'clients.html')

@app.route('/contact')
@app.route('/contact.html')
def serve_contact_page():
    return send_from_directory('.', 'contact.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)


# ─────────────────────────────────────────────
# CONTACT FORM HANDLER
# ─────────────────────────────────────────────

@app.route('/contact', methods=['POST'])
def handle_contact():
    """
    Receives JSON from the contact form and sends an email.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data received."}), 400

        # Required fields validation
        required = ['name', 'email', 'phone', 'message']
        for field in required:
            if not data.get(field, '').strip():
                return jsonify({"success": False, "error": f"'{field}' is required."}), 400

        name    = data.get('name', '').strip()
        company = data.get('company', 'N/A').strip() or 'N/A'
        email   = data.get('email', '').strip()
        phone   = data.get('phone', '').strip()
        city    = data.get('city', 'N/A').strip() or 'N/A'
        product = data.get('product', 'N/A').strip() or 'N/A'
        message = data.get('message', '').strip()

        logging.info(f"Received enquiry from {name} ({email})")

        # Check if email password is configured
        if not SENDER_PASS or SENDER_PASS == "your-16-character-app-password-here":
            logging.error("Email password not configured properly")
            return jsonify({
                "success": False,
                "error": "Email service is not configured. Please contact us by phone at +92-324-5555-277"
            }), 500

        # ── Build HTML email ──────────────────────────
        html_body = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <style>
    body {{ font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }}
    .wrapper {{ max-width: 600px; margin: 0 auto; background: #fff; border-radius: 4px; overflow: hidden; }}
    .header {{ background: #0a0a0a; padding: 28px 36px; }}
    .header-logo {{ font-family: Georgia, serif; font-size: 26px; color: #cc0000; letter-spacing: 4px; }}
    .header-sub {{ font-size: 12px; color: #888; letter-spacing: 3px; text-transform: uppercase; margin-top: 4px; }}
    .body {{ padding: 36px; }}
    .tag {{ display: inline-block; background: #cc0000; color: #fff; font-size: 11px;
             letter-spacing: 3px; text-transform: uppercase; padding: 4px 12px; margin-bottom: 20px; }}
    h2 {{ font-size: 22px; color: #0a0a0a; margin-bottom: 24px; }}
    table {{ width: 100%; border-collapse: collapse; }}
    td {{ padding: 12px 16px; font-size: 14px; border-bottom: 1px solid #f0f0f0; vertical-align: top; }}
    td:first-child {{ font-weight: 700; color: #333; width: 140px; white-space: nowrap; }}
    td:last-child {{ color: #555; }}
    .message-box {{ background: #f9f9f9; border-left: 3px solid #cc0000;
                    padding: 16px 20px; margin-top: 24px; font-size: 14px; color: #333; line-height: 1.7; }}
    .footer {{ background: #0a0a0a; padding: 20px 36px; }}
    .footer p {{ font-size: 12px; color: #555; margin: 0; }}
    .footer a {{ color: #cc0000; text-decoration: none; }}
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="header-logo">AXE<span style="color:#fff;font-size:18px;letter-spacing:5px;"> PACKAGES</span></div>
      <div class="header-sub">New Website Enquiry</div>
    </div>
    <div class="body">
      <div class="tag">Contact Form Submission</div>
      <h2>New Enquiry Received</h2>
      <table>
        <tr><td style="font-weight:700;">Full Name</td><td>{name}</td></tr>
        <tr><td style="font-weight:700;">Company</td><td>{company}</td></tr>
        <tr><td style="font-weight:700;">Email</td><td><a href="mailto:{email}" style="color:#cc0000">{email}</a></td></tr>
        <tr><td style="font-weight:700;">Phone</td><td>{phone}</td></tr>
        <tr><td style="font-weight:700;">City</td><td>{city}</td></tr>
        <tr><td style="font-weight:700;">Product Interest</td><td>{product}</td></tr>
      </table>
      <div class="message-box">
        <strong>Message:</strong><br/><br/>
        {message.replace(chr(10), '<br/>')}
      </div>
    </div>
    <div class="footer">
      <p>This message was submitted via the AXE Packages website contact form.<br/>
         Reply directly to <a href="mailto:{email}">{email}</a></p>
    </div>
  </div>
</body>
</html>
        """

        # Plain text fallback
        plain_body = f"""
NEW ENQUIRY – AXE PACKAGES WEBSITE
====================================
Name:     {name}
Company:  {company}
Email:    {email}
Phone:    {phone}
City:     {city}
Product:  {product}

Message:
{message}
====================================
Submitted via axepackages.pk contact form.
        """

        # ── Compose email ────────────────────────────
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"New Enquiry from {name} – AXE Packages Website"
        msg['From']    = SENDER_EMAIL
        msg['To']      = RECEIVER_EMAIL
        msg['Reply-To']= email

        msg.attach(MIMEText(plain_body, 'plain'))
        msg.attach(MIMEText(html_body,  'html'))

        # ── Send via Gmail SMTP ──────────────────────
        logging.info(f"Attempting to send email from {SENDER_EMAIL} to {RECEIVER_EMAIL}")
        
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.ehlo()
        server.starttls()
        server.ehlo()  # Re-identify after TLS
        server.login(SENDER_EMAIL, SENDER_PASS)
        server.sendmail(SENDER_EMAIL, RECEIVER_EMAIL, msg.as_string())
        server.quit()
            
        logging.info("Email sent successfully")
        return jsonify({"success": True, "message": "Your message has been sent successfully! We'll be in touch within 24 hours."}), 200

    except smtplib.SMTPAuthenticationError as e:
        logging.error(f"SMTP Authentication Error: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Email service authentication failed. Please contact us directly by phone at +92-324-5555-277 or email info@axepackages.pk"
        }), 500

    except smtplib.SMTPException as e:
        logging.error(f"SMTP Exception: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Unable to send email at this time. Please call us at +92-324-5555-277 or email info@axepackages.pk"
        }), 500

    except Exception as e:
        logging.error(f"General Exception: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Server error. Please contact us by phone at +92-324-5555-277"
        }), 500


# ─────────────────────────────────────────────
# RUN
# ─────────────────────────────────────────────

if __name__ == '__main__':
    print("=" * 50)
    print("  AXE Packages Server Starting...")
    print("  Visit: http://localhost:5000")
    print("=" * 50)
    print("\n📧 Email Configuration:")
    print(f"   Sender: {SENDER_EMAIL}")
    print(f"   Receiver: {RECEIVER_EMAIL}")
    print(f"   SMTP Server: {SMTP_SERVER}:{SMTP_PORT}")
    print("=" * 50)
    app.run(debug=True, port=5000, host='0.0.0.0')