# FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9 as prod
FROM python:3.9 as prod

ENV FORWARDED_ALLOW_IPS="*"

RUN pip install -U pip

COPY ./ /app/
RUN pip install pyproject.toml
#--use-feature=in-tree-build .

ENV MODULE_NAME=badlyparked.main
FROM prod as dev

# CMD /start-reload.sh
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]