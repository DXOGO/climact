FROM nginx:1.27.0-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY /config/nginx.conf /etc/nginx/conf.d

RUN mkdir /etc/nginx/certs

RUN cat /config/CACert.crt >> /config/cesam-climact_ua_pt.crt && \
    cat /config/CACert.crt >> /config/cesam-climact_ua_pt.key

COPY /config/cesam-climact_ua_pt* /etc/nginx/certs/
