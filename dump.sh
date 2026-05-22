#!/bin/bash

# === Installation ===
# 1. Set-up database config
#    a. `docker ps`
#    b. Find the container name and copy it to variable CONTAINER_NAME
#    c. Set database configuration in variable DATABASE, USERNAME, PASSWORD
#
# 2. Configure Google Drive API
#    a. Complete variable CLIENT_ID, CLIENT_SECRET by downloading secrets code on this link : https://console.cloud.google.com/
#    b. To get the refresh token : Make a POST request on https://oauth2.googleapis.com/token
#    b.1 body -> raw-request : client_id, client_secret, grant_type = refresh_token
#    b.2 Authorization : Auth Request, add in key / value :
#    access_type / offline
#    prompt / consent
#    b.3 Once you get the refresh token, add in the variable REFRESH_TOKEN
#    c. Use variable FOLDER_ID to chose the destination of the file on Google Drive (FOLDER_ID can be found via the URL on Google Drive)
#
# 3. Install and config msmtp
#    a. Add application password via the link https://myaccount.google.com/apppasswords
#    b. Save this password and add it in the .msmtprc (next step)
#    c. Install the mailer `sudo apt install msmtp msmtp-mta -y`
#    d. Add config for msmtp `nano ~/.msmtprc`
#    """
# defaults
# auth           on
# tls            on
# tls_trust_file /etc/ssl/certs/ca-certificates.crt
# logfile        ~/.msmtp.log
#
# account        gmail
# host           smtp.gmail.com
# port           587
# from           my.email@gmail.com
# user           my.email@gmail.com
# password       my_mot_de_passe_app_specific  # Copy here the application password
#
# account default : gmail
# EOF
# """
#    e. Securise the file `chmod 600 ~/.msmtprc`


# === Database config ===
CONTAINER_NAME=
DATABASE=
USERNAME=
PASSWORD=

# File config
DUMP_TIMESTAMP=$(date +"%Y%m%d%H%M")
FILENAME="dump-$DATABASE-$DUMP_TIMESTAMP.sql"
FILEPATH="/tmp/$FILENAME"

# RClone
RCLONE_REMOTE=

# Email
EMAIL=
EMAIL_SUCCESS="La base $DATABASE a été sauvegardée sur Google Drive"
EMAIL_DUMP_FAIL_SUBJECT="Erreur sauvegarde base de données $DATABASE"


echo "🔄 Dump database..."

docker exec -e PGPASSWORD="$PASSWORD" "$CONTAINER_NAME" \
  pg_dump -U "$USERNAME" -n public "$DATABASE" > "$FILEPATH"

if [ ! -s "$FILEPATH" ]; then
  echo "❌ Dump failed (file missing or empty)"
  echo "Impossible de dump la base de données" | mailx -s "$EMAIL_DUMP_FAIL_SUBJECT" "$EMAIL"
  exit 1
fi


echo "📤 Upload to Google Drive..."

if ! rclone copy "$FILEPATH" "$RCLONE_REMOTE"; then
  echo "❌ Upload failed"
  echo "Erreur lors de l'upload sur Google Drive" | mailx -s "$EMAIL_DUMP_FAIL_SUBJECT" "$EMAIL"
  exit 1
fi


echo "🧹 Cleaning local file..."
rm -f "$FILEPATH"


echo "🧹 Cleaning old backups..."
rclone delete "$RCLONE_REMOTE" --min-age 7d


echo "📧 Sending email confirmation..."
echo "$EMAIL_SUCCESS" | mailx -s "Sauvegarde effectuée" "$EMAIL"