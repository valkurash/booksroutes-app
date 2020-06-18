FROM staticfloat/nginx-certbot

# Copy config files
# *.conf files in "conf.d/" dir get included in main config
COPY ./nginx.conf /etc/nginx/conf.d/

# Expose the listening port
EXPOSE 80

CMD tail -f /dev/null