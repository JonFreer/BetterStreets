# FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9 as prod
FROM python:3.9 as prod

ENV FORWARDED_ALLOW_IPS="*"
RUN pip install poetry
RUN pip install -U pip

COPY ./ /app/
WORKDIR "/app"
# RUN pip install pyproject.toml
# RUN pip install uvicorn
RUN poetry config virtualenvs.create false
RUN poetry install
#--use-feature=in-tree-build .

# ENV MODULE_NAME=badlyparked.main
FROM prod as dev
ENV PYTHONPATH=$PWD

# CMD /start-reload.sh
# CMD tail -f /dev/null
CMD PORT=80 uvicorn badlyparked.main:app --host 0.0.0.0 --port 80
#, "--host", "0.0.0.0", "--port", "80"]