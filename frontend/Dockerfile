# Menggunakan nginx untuk hosting static files
FROM nginx:alpine

# Menyalin semua file frontend ke direktori default nginx
COPY . /usr/share/nginx/html/

# Mengekspor port 80
EXPOSE 80

# Nginx berjalan sebagai proses utama secara default
CMD ["nginx", "-g", "daemon off;"]
