FROM node:14.15.4-slim

RUN mkdir -p /usr/share/man/man1

RUN apt update && apt install -y \
    default-jre --fix-missing \
    graphviz \
    git \
    ca-certificates


USER node

WORKDIR /home/node/app

CMD ["sh", "-c", "npm install && tail -f /dev/null"]
