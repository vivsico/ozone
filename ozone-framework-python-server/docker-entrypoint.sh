#!/bin/bash

echo "Running PEP8 checks"
echo "See pep8-results.txt for list of errors."
pycodestyle --max-line-length=120 --show-source --show-pep8 --count --exclude="*/migrations" owf_framework/ > pep8-results.txt
# autopep8 --max-line-length=120 --in-place --recursive --aggressive owf_framework


# Collect static files
# echo "Collect static files"
# python manage.py collectstatic --noinput

# Apply database migrations
echo "Apply database migrations"
until python manage.py migrate --no-input; do
  >&2 echo "db is unvailable - retrying"
  sleep 5
done

# Load fixture data
echo "Load fixture data"
python manage.py loaddata resources/fixtures/all_data.json

# Start server
echo "Starting server"
python manage.py runserver 0.0.0.0:8000