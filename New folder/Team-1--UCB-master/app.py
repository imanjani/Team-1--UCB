
#Dependencies
import pandas as pd 
import numpy as np 
import sqlalchemy 

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import (create_engine, func, inspect)

from flask import(
    Flask,
    render_template,
    jsonify
)


#Setup the DB
# engine = create_engine("sqlite:///")

# DB new var
# Base = automap_base()

#Reflect tables
# Base.prepare(engine, reflect=True)

# create session
# session = Session(engine)

#create inspector for column names
# inspector = inspect(engine)

app = Flask(__name__)






@app.route("/")
def home():
    return render_template("index.html")



if __name__ =='__main__':
    app.run(debug=True)