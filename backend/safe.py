from __future__ import print_function
import os.path
import traceback
import json
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload
import datetime
import json
import os
from collections import Counter
import time
import schedule

# going inside the data

original_directory = os.getcwd()
print(os.getcwd())


def sorter():
    with open('data.json') as f:
        hist = json.load(f)

    # Putting favorites in priority queue
    favorites = []

    for i in range(len(hist['file']) - 1):
        if hist['file'][i]['favorite'] == 1:
            favorites.append(hist['file'][i])
            hist['file'].pop(i)

    ###########################################################
    # Counting the amount of times a file was accessed
    name_counter = Counter()
    click = {}

    for i in range(0, len(hist['file'])):
        # counts the times each file appear
        name_counter.update(f"{hist['file'][i]['filename']}".split(';'))

    for a in name_counter:  # Creates a dictionary of the file corresponding with the amount of times it was accessed
        click[a] = name_counter[a]

    ###########################################################
    # Dates for each file
    dates = {}
    for i in range(len(hist['file'])):
        date = hist['file'][i]['created'].split("T")[0]
        date_formated = datetime.datetime.strptime(date, "%Y-%m-%d")
        date_today = datetime.date.today()
        delta_time = date_today - date_formated.date()
        dates[hist['file'][i]['filename']] = delta_time.days

    # removing duplicates
    dates_no_dups = {}
    for key, value in dates.items():
        if a not in dates_no_dups:
            dates_no_dups[key] = value

    ##############################################################
    # Creating weights

    def weights_calc(time, access_count):
        weight = access_count / (1 + time)

        return weight

    # getting the key values of the dictionary
    weights = {}
    fnames = []
    for key, value in dates_no_dups.items():
        fnames.append(key)

    for i in range(len(dates_no_dups)):
        # Defining time
        time_file = dates_no_dups[fnames[i]]
        access_counts = click[fnames[i]]
        weight_file = weights_calc(time_file, access_counts)
        weights[fnames[i]] = weight_file

    # Sorting the weights
    sorted_weights = dict(
        sorted(weights.items(), key=lambda x: x[1], reverse=True))

    # Creating a list with only the names, in order, of the weighted files
    filenames_weighted = []
    for key, value in sorted_weights.items():
        filenames_weighted.append(key)

    ##########################################################
    # Adding the prioritized files first
    storage = 15000
    files_to_upload = {'file': []}

    while storage >= 1000:
        for i in range(len(favorites)):
            try:
                storage -= hist['file'][i]['size']
                if storage < 1000:
                    print("Not enough storage")
                    break
                files_to_upload['file'].append(favorites[i])

            except Exception:
                print("Ran out of Storage")
        break

    # Adding the weighted files
    while storage > 1000:
        for i in range(len(filenames_weighted)):
            for j in range(len(hist['file'])):
                try:
                    if filenames_weighted[i] == hist['file'][j]['filename']:
                        storage -= hist['file'][j]['size']
                        if storage < 1000:
                            print("Not enough storage")
                            break
                        files_to_upload['file'].append(hist['file'][j])

                        break

                except Exception:
                    print("ran out of storage")
                    break

                else:
                    pass

        break

    # os.chdir("") OPTIONAL
    print(files_to_upload)
    os.chdir('data')
    with open('Files_Cloud.json', 'w') as f2:
        json.dump(files_to_upload, f2)

    print('JSON of files to upload is updated')
    print('')


#####################################################################

# Drive uploads


os.chdir('data')
with open("Files_Cloud.json") as f:
    files_json = json.load(f)

print(files_json)

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/drive']
os.chdir(original_directory)


def drive():
    os.chdir(original_directory)
    creds = None

    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('data/token.json'):
        creds = Credentials.from_authorized_user_file(
            'data/token.json', SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'data/credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('data/token.json', 'w') as token:
            token.write(creds.to_json())

    try:
        service = build('drive', 'v3', credentials=creds)

        # Call the Drive v3 API
        response = service.files().list(
            q="name='Backupfolder2023' and mimeType='application/vnd.google-apps.folder'",
            spaces='drive'
        ).execute()

        print(response)

        if not response['files']:
            file_metadata = {
                "name": "BackupFolder2023",
                "mimeType": "application/vnd.google-apps.folder"
            }

            file = service.files().create(
                body=file_metadata,
                fields="id"
            ).execute()
            print('hello')

            folder_id = file.get('id')

        else:
            folder_id = response['files'][0]["id"]
            print(response['files'][0])
            print(folder_id)

            for file in os.listdir("data"):
                file_metadata = {
                    "name": file,
                    "parents": [folder_id]
                }
                print(file_metadata['name'])

                for i in range(0, len((files_json)['file'])):
                    print()
                    if file_metadata['name'] == files_json['file'][i]['id']:

                        media = MediaFileUpload("data/{}".format(file))
                        upload_file = service.files().create(
                            body=file_metadata, media_body=media, fields="id").execute()
                        print(file + 'backuped')

    except Exception as e:
        print(e)
        print(traceback.format_exc())


# Initial calls of the functions
sorter()
print('hi')
time.sleep(5)

for i in range(0, 2):
    drive()


schedule.every(5).hours.do(sorter)
schedule.every(5).hours.do(drive)

# Running it on constant basis, automating it
while True:
    schedule.run_pending()
    time.sleep(1)
