from dataclasses import dataclass
from typing import Union
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from os.path import isfile

app = FastAPI()

class State(BaseModel):
    current_dir: str = os.getcwd()
    vcf_path: str | None = None
    annotation_txt_path: str | None = None
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

@app.get("/fs/get_cwd")
def get_current_dir():
    return {"current_dir": global_state.current_dir}

@app.get("/fs/list_dir")
def list_dir(path: str | None = None):
    ls = os.listdir()
    #annotate which are files
    ls = [[x,"file"] if isfile(x) else [x,"dir"] for x in ls]
    return ls

@app.put("/fs/change_dir/{newdir}")
def change_dir(newdir: str):
    global_state.current_dir = newdir
    return {"current_dir": global_state.current_dir}

@app.put("/choose_vcf/{vcf_path}", response_model=SuccessErrorReturn)
def choose_vcf(vcf_path: str, tmp: str):
    if isfile(vcf_path):
        global_state.vcf_path = vcf_path
        return SuccessErrorReturn(success=True, error=None)
    else:
        return SuccessErrorReturn(success=False, error="The specified VCF path does not exist or is not a file.")
    

@app.put("/choose_annotation_file/{annotation_path}", response_model=SuccessErrorReturn)
def choose_annotation_file(annotation_path: str, tmp: str):
    if isfile(annotation_path):
        global_state.annotation_txt_path = annotation_path
        return SuccessErrorReturn(success=True, error=None)
    else:
        return SuccessErrorReturn(success=False, error="The specified annotation file path does not exist or is not a file.")