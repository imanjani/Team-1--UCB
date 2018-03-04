# Import dependencies
from flask import Flask, render_template, jsonify

import os
import pandas as pd

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

#############################################################################
# USING PANDAS TO COLLECT DATA
#############################################################################
# _csvpath = os.path.join('DataSets', 'belly_button_biodiversity_samples.csv')
# #_csvpath = os.path.join('belly_button_biodiversity_samples.csv')
# _data = pd.read_csv(_csvpath)
# column_names = list(_data.columns)
# del column_names[0]
#############################################################################
# USING SQLALCHEMY TO FIND THE sample names -- **IMPORTANT NOTE** - if running
# queries OUTSIDE of app function, it will create a different thread, thereby
# running another query INSIDE the app function will require another connection
# to the DB.  **IMPORTANT NOTE**
##############################################################################

if not os.path.exists('uber_lyft_DB.sqlite'):
    raise FileNotFoundError("The UL-sqlite-file does not exist")
engine = create_engine("sqlite:///uber_lyft_DB.sqlite")

Base = automap_base()
Base.prepare(engine, reflect=True)

ridesharedata = Base.classes.rideshare

session = Session(engine)


##############################################################################

app = Flask(__name__)

#################################################
# Routes
#################################################

# Main route 
@app.route('/')
def home():
    return render_template('index.html', text = "Flask is rendering just fine")

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



if __name__ == "__main__":
    app.run(debug=True)
