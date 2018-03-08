from uber_rides.session import Session
from uber_rides.client import UberRidesClient
import json
import pymongo
import datetime
import geocoder
import requests
import json



# response = client.get_products(37.77, -122.41)
# products = response.json.get('products')

#address= input("please enter you destination")


# pip install geopy

from geopy.geocoders import Nominatim
geolocator = Nominatim()

def ride(address):
    send_url = 'http://freegeoip.net/json'
    r = requests.get(send_url)
    j = json.loads(r.text)
    latA = j['latitude']
    lonA = j['longitude']  

    session = Session(server_token='KbbiFngprHDYR6gfxsyK-7VmwAbXoT6kYk2nxrrN')
    client = UberRidesClient(session)
    
    # address=input("please enter destination?")

    location = geolocator.geocode(address)
    # print("\n")
    # print("\n")
    lat_d=location.latitude
    long_d=location.longitude
    # print(location.address)
    # print("\n")
    # print("\n")
    # # print((location.latitude, location.longitude))
    # print("\n")
    # print("\n")
    
    # print (products)
    response = client.get_products(latA, lonA) # start long lag
    products = response.json.get('products')
    response = client.get_price_estimates(
    start_latitude=latA,
    start_longitude=lonA,
    end_latitude=lat_d,
    end_longitude=long_d,
    seat_count=2
    )

    estimate = response.json.get('prices')

    response=json.dumps(estimate, indent=4, sort_keys=True)

    #print (response)
    return estimate


    # for item in estimate:
        # print ("Product: " + item["display_name"])
        # print("Price: "+item["estimate"])
        # minutes=item["duration"]/60
        # print("Duration: "+ str(minutes)+ " Minutes")
        # print("\n")
        
        
        # return item
        # return ("Product: " + item["display_name"])
        # return("Price: "+item["estimate"])
        # minutes = item["duration"]/60
        # return ("Duration: "+ str(minutes)+ " Minutes")
        # print("\n")





