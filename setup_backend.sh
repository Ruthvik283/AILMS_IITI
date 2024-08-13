#!/bin/bash

#!/bin/bash

# Navigate to the backend directory
cd backend || exit

# Check if db.sqlite3 exists
if [ -f "db.sqlite3" ]; then
    # Prompt the user for action
    echo "db.sqlite3 already exists. Do you want to delete it? ALL THE EXISTING DATA WILL BE CLEARED (yes_delete/no)"
    read -r response
    if [ "$response" == "yes_delete" ]; then
        rm db.sqlite3
        echo "db.sqlite3 has been deleted."
    else
        echo "Terminating the script."
        exit 1
    fi
fi

# Run Django management commands
py manage.py makemigrations
py manage.py migrate
py manage.py custom_createsuperuser admin@iiti.ac.in 1234
py manage.py setup_initial_data

