FROM python:3.11

WORKDIR /app

COPY . .

# # Upgrade pip first
# RUN pip install --upgrade pip

# # It is better to use a requirements.txt, but for a single package:
# RUN pip install --no-cache-dir requests

RUN pip install requests

# COPY docker-entrypoint.sh /app/docker-entrypoint.sh
# RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 50000

CMD ["python", "-u","client.py"]
