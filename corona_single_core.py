import time


from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.chrome.options import Options
chrome_options = Options()
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')
chrome_options.add_argument("--headless")
print("Start grabbing data... COVID-19 Stats")
start = time.time()
bot = webdriver.Chrome(chrome_options=chrome_options)
bot.set_window_size(1920, 1080)
bot.get('https://www.worldometers.info/coronavirus/')
table = bot.find_elements_by_xpath('//*[@id="main_table_countries_today"]/tbody[1]/tr/td')
data = []
for n in table:
    if n.text == '':
        data.append('N/A')
    else:
        data.append(n.text)
end = time.time()
print("Time used:", end-start,"seconds.")
bot.close()