FROM python:3.11

WORKDIR /app

COPY . .

RUN pip install flask requests jsonify

# COPY docker-entrypoint.sh /app/docker-entrypoint.sh
# RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 5000

CMD ["python", "server.py"]
# ENTRYPOINT ["/app/docker-entrypoint.sh"]

# FROM python:3.11

# WORKDIR /app

# COPY . .

# RUN pip install flask requests jsonify
# COPY start.sh .
# RUN chmod +x /app/start.sh

# EXPOSE 5000

# CMD ["./start.sh"]