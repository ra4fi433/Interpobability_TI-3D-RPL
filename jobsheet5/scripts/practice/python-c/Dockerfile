FROM python:3.11

WORKDIR /app

COPY . .

RUN pip install requests

# COPY docker-entrypoint.sh /app/docker-entrypoint.sh
# RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 50000

CMD ["python", "-u","client.py"]
