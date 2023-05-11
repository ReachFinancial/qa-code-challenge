FROM mcr.microsoft.com/playwright:v1.33.0-jammy

COPY . /playwright
WORKDIR /playwright
RUN npm ci

ENTRYPOINT [ "npm" ]