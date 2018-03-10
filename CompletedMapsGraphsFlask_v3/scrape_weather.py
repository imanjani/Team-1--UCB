import requests as req
from bs4 import BeautifulSoup
import json
import config

def scrape():

    # Save config information
    url = 'http://api.openweathermap.org/data/2.5/weather'
    api_key = config.apikey_OWM()
    city = 'San Francisco'

    # Build query URL
    query_url = url + '?appid=' + api_key + '&q=' + city

    # Get weather data
    weather_response = req.get(query_url)
    weather_json = weather_response.json()

    return weather_json
