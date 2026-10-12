FROM python:3.12-slim
WORKDIR /app
ENV CI_DATASET_DIR=/app/datasets
COPY local-labs/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY local-labs/quality ./quality
COPY local-labs/fastapi ./service
COPY datasets ./datasets
USER 10001
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=3s CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health', timeout=2)"
CMD ["uvicorn", "app:app", "--app-dir", "service", "--host", "0.0.0.0", "--port", "8000"]
