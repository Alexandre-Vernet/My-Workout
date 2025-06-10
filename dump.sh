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
FILEPATH_HOST="/tmp/$FILENAME"
FILEPATH_CONTAINER="/tmp/$FILENAME"

# Google OAuth & Drive
CLIENT_ID=
CLIENT_SECRET=
REFRESH_TOKEN=
FOLDER_ID=

# Email
EMAIL=
EMAIL_SUCCESS="La base $DATABASE a été sauvegardée sur Google Drive
https://drive.google.com/drive/folders/$FOLDER_ID"

EMAIL_FAIL="Une erreur s'est produite lors du backup de la base $DATABASE"


# === STEP 1: Dump database inside the container ===
echo "🔄 Dump database ..."
docker exec -e PGPASSWORD="$PASSWORD" "$CONTAINER_NAME" pg_dump \
  -U "$USERNAME" -F c -f "$FILEPATH_CONTAINER" -n public "$DATABASE"

if [ $? -ne 0 ]; then
  echo "❌ Dump failed"
  echo "$EMAIL_FAIL" | mailx -s "Erreur lors du dump de la base de données"
  exit 1
fi

# === STEP 2: Copy file to host ===
echo "📁 Copy dump on host"
docker cp "$CONTAINER_NAME:$FILEPATH_CONTAINER" "$FILEPATH_HOST"

if [ $? -ne 0 ]; then
  echo "❌ Copy failed"
  echo "$EMAIL_FAIL" | mailx -s "Erreur copie du dump vers l'hote"
  exit 1
fi

docker exec "$CONTAINER_NAME" rm "$FILEPATH_CONTAINER"


# === STEP 3: Get Google access token ===
echo "🔑 Retrieving OAuth token ..."
TOKEN_RESPONSE=$(curl -s --request POST \
  --url https://oauth2.googleapis.com/token \
  --header "Content-Type: application/x-www-form-urlencoded" \
  --data "client_id=$CLIENT_ID" \
  --data "client_secret=$CLIENT_SECRET" \
  --data "refresh_token=$REFRESH_TOKEN" \
  --data "grant_type=refresh_token")

ACCESS_TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.access_token')
if [ "$ACCESS_TOKEN" == "null" ] || [ -z "$ACCESS_TOKEN" ]; then
  echo "❌ Fail get token"
  echo "$EMAIL_FAIL" | mailx -s "Erreur récupération google access token"
  exit 1
fi

# === STEP 4: Upload to Google Drive ===
echo "📤 Uploading dump to Google Drive..."

UPLOAD_RESPONSE=$(curl -s -X POST \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -F "metadata={\"name\": \"$FILENAME\", \"parents\": [\"$FOLDER_ID\"]};type=application/json;charset=UTF-8" \
  -F "file=@$FILEPATH_HOST;type=application/octet-stream" \
  "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart")


FILE_ID=$(echo "$UPLOAD_RESPONSE" | jq -r '.id')
if [ "$FILE_ID" == "null" ] || [ -z "$FILE_ID" ]; then
  echo "❌ Fail upload"
  echo "$EMAIL_FAIL" | mailx -s "Erreur upload Google Drive"
  exit 1
fi
echo "✅ Upload success, ID : $FILE_ID"


# === STEP 5: Send confirmation email ===
echo "📧 Sending email confirmation..."


echo "$EMAIL_SUCCESS" | mailx -s "Sauvegarde effectuée" "$EMAIL"
