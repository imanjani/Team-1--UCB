import requests as req
from bs4 import BeautifulSoup
import json

def scrape():

    # Save config information
    url = 'http://api.openweathermap.org/data/2.5/weather'
    api_key = '59c2acda2c0f58da766f95ef512afdfa'
    city = 'San Francisco'

    # Build query URL
    query_url = url + '?appid=' + api_key + '&q=' + city

    # Get weather data
    weather_response = req.get(query_url)
    weather_json = weather_response.json()

    return weather_json
