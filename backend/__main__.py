from dataclasses import dataclass
from typing import Union
from fastapi import FastAPI, HTTPException, WebSocket
from pydantic import BaseModel
import os
from os.path import isfile
from pathlib import Path
import typer
from backend.VCFManager import VCFManager, VCFNotPhasedError, VCFSchemaValidationError
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class State(BaseModel):
    current_dir: str = os.getcwd()
    vcf_path: str | None = None
    annotation_txt_path: str | None = None
    sample_names: list[str] | None = None
global_state = State()

@dataclass
class SuccessErrorReturn(BaseModel):
    success: bool
    error: str | None

@app.get("/")
def read_root():
    return {"Hello": "World"}

#get_cwd, list_dir, change_dir will be used for traversing the filesystem to choose
#   files for choose_vcf, choose_annotation

@app.get("/fs/get_cwd", response_model=str)
def get_current_dir():
    return global_state.current_dir

@app.get("/fs/list_dir", response_model=list[dict[str,str]])
def list_dir():
    ls = os.listdir()
    #annotate which are files
    ls_w_file_info = [{"name": x,"type": "file", "abspath": os.path.abspath(os.path.join(global_state.current_dir, x))} if isfile(x) else {"name": x,"type": "directory", "abspath": os.path.abspath(os.path.join(global_state.current_dir, x))} for x in ls]
    return ls_w_file_info

@app.put("/fs/change_dir/{newdir}")
def change_dir(newdir: str):
    print(f"before:{global_state.current_dir}")
    global_state.current_dir = newdir
    print(f"after:{global_state.current_dir}")
    return {"current_dir": global_state.current_dir}

@app.put("/choose_vcf/{vcf_path}", response_model=SuccessErrorReturn)
def choose_vcf(vcf_path: str, tmp: str):
    if isfile(vcf_path):
        global_state.vcf_path = vcf_path
        try:
            vcf_manager = VCFManager(vcf_path)
            return SuccessErrorReturn(success=True, error=None)
        except VCFSchemaValidationError as e:
            return SuccessErrorReturn(success=False, error=f"VCFSchemaValidationError: {e}")
        except VCFNotPhasedError as e:
            return SuccessErrorReturn(success=False, error=f"VCFNotPhasedError error: {e}")
        except Exception as e:
            return SuccessErrorReturn(success=False, error=f"An unexpected error occurred: {e}")

    else:
        return SuccessErrorReturn(success=False, error="The specified VCF path does not exist or is not a file.")
    

@app.put("/choose_annotation_file/{annotation_path}", response_model=SuccessErrorReturn)
def choose_annotation_file(annotation_path: str, tmp: str):
    if isfile(annotation_path):
        global_state.annotation_txt_path = annotation_path
        return SuccessErrorReturn(success=True, error=None)
    else:
        return SuccessErrorReturn(success=False, error="The specified annotation file path does not exist or is not a file.")
    

def get_sample_names():
    pass

@app.websocket("/train")
async def train(websocket: WebSocket):
    """
    Return real time training info
    """
    #TODO: call for training loop
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")