from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from services import baixar_arquivos, compactar_arquivos

app = FastAPI()

@app.get("/baixar-e-compactar")

def baixar_e_compactar():
    arquivos = baixar_arquivos()
    zip_path = compactar_arquivos(arquivos)
    return FileResponse(zip_path, filename="arquivos.zip", media_type="application/zip")

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)

def home():
    with open("template/index.html", "r") as file:
        return HTMLResponse(content=file.read(), status_code=200)
