FROM nginx:alpine
COPY ./deploy/default.conf /etc/nginx/conf.d/default.conf
COPY ./dist /usr/share/nginx/html


