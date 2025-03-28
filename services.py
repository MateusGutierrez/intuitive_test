import os
import zipfile
import time
import requests
import pdfplumber
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()

SITE_URL = os.getenv("SITE_URL")
PDF_KEYWORDS = os.getenv("PDF_KEYWORDS", "").split(",")
PDF_KEYWORDS = [kw.strip().lower() for kw in PDF_KEYWORDS]
NUM_PDFS = int(os.getenv("NUM_PDFS", 2))
DOWNLOAD_DIR = "downloads"
ZIP_DIR = "zips"

os.makedirs(DOWNLOAD_DIR, exist_ok=True)
os.makedirs(ZIP_DIR, exist_ok=True)

def baixar_arquivos():
    service = Service(ChromeDriverManager().install())  
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    driver = webdriver.Chrome(service=service, options=options)
    try:
        driver.get(SITE_URL)
        time.sleep(3)
        pdf_links = driver.find_elements(By.XPATH, "//a")
        pdf_urls = []
        for link in pdf_links:
            pdf_text = link.text.strip().lower()
            pdf_url = link.get_attribute("href")
            if pdf_url and any(keyword in pdf_text for keyword in PDF_KEYWORDS) and pdf_url.endswith('.pdf'):
                pdf_urls.append(pdf_url)
    finally:
        driver.quit()
    arquivos_baixados = []
    for pdf_url in pdf_urls:
        file_name = os.path.basename(urlparse(pdf_url).path)
        response = requests.get(pdf_url)
        if response.status_code == 200:
            file_path = os.path.join(DOWNLOAD_DIR, file_name)
            with open(file_path, "wb") as f:
                f.write(response.content)
            arquivos_baixados.append(file_path)
    return arquivos_baixados

def compactar_arquivos(arquivos):
    zip_path = os.path.join(ZIP_DIR, "arquivos.zip")
    with zipfile.ZipFile(zip_path, "w") as zipf:
        for arquivo in arquivos:
            zipf.write(arquivo, os.path.basename(arquivo))
    return zip_path

ABBREVIATIONS = {
    "AMB": "Seg. Ambulatorial",
    "OD": "Seg. Odontológica",
}

def extrair_pdf(pdf_path):
    output_dir = "csv"
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(ZIP_DIR, exist_ok=True)
    csv_path = os.path.join(output_dir, "dados_extraidos.csv")
    zip_path = os.path.join(ZIP_DIR, "Teste_Mateus_Maia_Gutierrez.zip")
    with pdfplumber.open(pdf_path) as pdf:
        tables = []
        for page in pdf.pages:
            table = page.extract_table()
            if table:
                tables.extend(table)
        df = pd.DataFrame(tables[1:], columns=tables[0])
        df.replace(ABBREVIATIONS, inplace=True)
        df.to_csv(csv_path, index=False, encoding='utf-8')
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            zipf.write(csv_path, os.path.basename(csv_path))
    return zip_path


