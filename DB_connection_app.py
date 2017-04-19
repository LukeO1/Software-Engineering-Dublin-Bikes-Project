from flask import Flask, g, render_template, jsonify
from sqlalchemy import create_engine
import pandas as pd
import pyowm
import os.path

app = Flask(__name__)  #creating the App

def get_db():
    engine = getattr(g,'engine', None)
    if engine is None:
        #If conenction does not exist, create the connection
        engine = create_engine('mysql+pymysql://dublinbikes:dublinbikes@dublinbikes.c2xnnykekrgc.us-west-2.rds.amazonaws.com/dublinbikes')
        g.engine = engine
    return engine

@app.route('/')  #defining a basic route
def main():
    #Getting data from database
    engine = get_db()
    data = []
    rows = engine.execute("SELECT address from static_information order by address")
    for row in rows:
        data.append(dict(row))
    dy_data = []
    dy_rows = engine.execute("SELECT name, available_bikes, available_bike_stands from station_info order by last_update limit 200")
    for row in dy_rows:
        dy_data.append(dict(row))

    #Setting up the weather dictionary
    owm = pyowm.OWM('51a2aeb31f24d602a541c80f16dd31e5')
    observation = owm.weather_at_place('Dublin,ie')
    w = observation.get_weather()
    detailed_status = w.get_detailed_status()
    temp = w.get_temperature('celsius')['temp']
    wind_speed = w.get_wind()['speed']
    weather_tupple = (detailed_status, temp, wind_speed)
    return render_template('DBikes.html', data=data, data2=dy_data, data3=weather_tupple)

@app.route('/templates/DBikes.html') #If user clicks Home button the page refreshes
def refresh_page():
    engine = get_db()
    data = []
    rows = engine.execute("SELECT name from static_information order by name")
    for row in rows:
        data.append(dict(row))
    return render_template('Dbikes.html', data=data)



@app.route("/station/static")
def get_station():
    engine = get_db()
    sql = """
    select *
    from dublinbikes.static_information
    limit 102;
    """
    res = engine.execute(sql).fetchall()
    # return "this is station {} {}".format(station_id, engine)
    print(res)
    return jsonify([dict(row.items()) for row in res])

@app.route("/station/dynamic")
def get_dynamic():
    engine = get_db()
    sql = """
    select *
    from dublinbikes.station_info
    order by last_update DESC
    limit 102;
    """
    res = engine.execute(sql).fetchall()
    # return "this is station {} {}".format(station_id, engine)
    print(res)
    return jsonify([dict(row.items()) for row in res])

@app.route("/station/<name>")
def get_dynamic2(name):
    engine = get_db()
    df = pd.read_sql_query(
        "select * from dublinbikes.station_info where name = %(name)s order by last_update desc",
        engine, params={"name": name})
    # return "this is station {} {}".format(station_id, engine)
    # df['last_update_date'] = pd.to_datetime(df.last_update, unit ='ms')
    # df.set_index('last_update_date', inplace=True)
    # res = engine.execute(sql)
    print(df)
    return jsonify(df.to_dict())

@app.route("/weather")
def get_weather():
    owm = pyowm.OWM('51a2aeb31f24d602a541c80f16dd31e5')
    observation = owm.weather_at_place('Dublin,ie')
    w = observation.get_weather()
    #This code separates the data into the appropriate fields in the table.
    # last_update1 = w.get_reference_time(timeformat='iso')
    # status1 = w.get_status()
    detailed_status1 = w.get_detailed_status()
    # temp1 = w.get_temperature('celsius')['temp']
    # wind_deg1 = w.get_wind()['deg']
    # wind_speed1 = w.get_wind()['speed']
    # clouds1 = w.get_clouds()
    # sunrise1 = w.get_sunrise_time('iso')
    # sunset1 = w.get_sunset_time('iso')
    return jsonify(detailed_status1) #jsonify(observation.to_dict())

# @app.route("/weather/icons")
# def get_icons():
#     filename = os.path.join(app.static_folder, 'icons.json')
#     with open(filename) as details:
#         data = details
#         #data = json.load(blog_file)
#         return data
if __name__ == "__main__":
    app.run(debug=True, port=5000)
