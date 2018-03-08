
#Dependencies
import pandas as pd 
import numpy as np 
import sqlalchemy 
import os

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import (create_engine, func, inspect)

from flask import(
    Flask,
    render_template,
    redirect,
    url_for,
    request,
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

if not os.path.exists('uber_lyft_DB.sqlite'):
    raise FileNotFoundError("The UL-sqlite-file does not exist")
engine = create_engine("sqlite:///uber_lyft_DB.sqlite")

Base = automap_base()
Base.prepare(engine, reflect=True)

ridesharedata = Base.classes.rideshare

session = Session(engine)


##############################################################################


app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/map")
def ourmap():
    return render_template("map.html")

@app.route("/Albert")
def Albert():
    return render_template("Albert.html")

@app.route("/Iman")
def Iman():
    return render_template("Iman.html")


@app.route('/info')
def info():

    ridesharecolumns = ridesharedata.__table__.columns.keys()
    return jsonify(ridesharecolumns)

@app.route('/days/<day>')
def day_info(day):

    dow_query = (session.query(ridesharedata.trip_area, ridesharedata.latitude, ridesharedata.longitude, ridesharedata.name, 
                    ridesharedata.day_of_week, ridesharedata.hour, ridesharedata.pickups, ridesharedata.dropoffs).filter(
                            ridesharedata.day_of_week == day).all())

    dow_list = []

    for each in dow_query:
        dow_dict = {}
        dow_dict['trip_area'] = each[0]
        dow_dict['latitude'] = each[1]
        dow_dict['longitude'] = each[2]
        dow_dict['name'] = each[3]
        dow_dict['day_of_week'] = each[4]
        dow_dict['hour'] = each[5]
        dow_dict['pickups'] = each[6]
        dow_dict['dropoffs'] = each[7]
        dow_list.append(dow_dict)

    return jsonify(dow_list)

@app.route('/hours/<hour>')
def hour_info(hour):

    hour_query = (session.query(ridesharedata.trip_area, ridesharedata.latitude, ridesharedata.longitude, ridesharedata.name, 
                    ridesharedata.day_of_week, ridesharedata.hour, ridesharedata.pickups, ridesharedata.dropoffs).filter(
                            ridesharedata.hour == hour).all())

    hour_list = []

    for each in hour_query:
        hour_dict = {}
        hour_dict['trip_area'] = each[0]
        hour_dict['latitude'] = each[1]
        hour_dict['longitude'] = each[2]
        hour_dict['name'] = each[3]
        hour_dict['day_of_week'] = each[4]
        hour_dict['hour'] = each[5]
        hour_dict['pickups'] = each[6]
        hour_dict['dropoffs'] = each[7]
        hour_list.append(hour_dict)

    return jsonify(hour_list)



if __name__ =='__main__':
    app.run(debug=True)