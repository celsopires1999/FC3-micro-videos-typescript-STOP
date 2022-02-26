FROM node:14.15.4-slim

RUN mkdir -p /usr/share/man/man1

RUN apt-get update && apt-get install -y \
    default-jre --fix-missing \
    graphviz \
    git

USER node

WORKDIR /home/node/app

CMD ["sh", "-c", "npm install && tail -f /dev/null"]
