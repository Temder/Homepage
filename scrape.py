from bs4 import BeautifulSoup
from urllib.request import Request, urlopen

def bs4(url: str):
    headers = {'User-Agent': 'Mozilla/5.0'}
    r = Request(url, headers=headers)
    #try:
    conn = urlopen(r)
    data = conn.read()
    conn.close()
    soup = BeautifulSoup(data, "html.parser")
    return soup

imageLinks = {}

for i, link in enumerate(bs4("https://github.com/Temder/Homepage/tree/main/images/pano").find_all("a")):
    print(link["href"])