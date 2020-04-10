import http.server
import socketserver

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()




# import csv
# import urllib.request
# import codecs

# url = 'https://raw.githubusercontent.com/ishaberry/Covid19Canada/master/cases.csv'
# ftpstream = urllib.request.urlopen(url)
# csvfile = csv.reader(codecs.iterdecode(ftpstream, 'utf-8'))
# for line in csvfile:
#     print(line)  # do something with line