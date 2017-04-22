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

# @app.route('/') #If user clicks Home button the page refreshes
# def refresh_page():
#     engine = get_db()
#     data = []
#     rows = engine.execute("SELECT name from static_information order by name")
#     for row in rows:
#         data.append(dict(row))
#     return render_template('DBikes.html', data=data)



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
    # print(res)
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
    # print(res)
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
    #print(df)
    return jsonify(df.to_dict())

@app.route("/chartDailyView/<string:name>/<int:day_number>")
def getDayInfo(name, day_number):
    engine = get_db()
    sql = 'select unix_timestamp(sec_to_time(time_to_sec(last_update)- time_to_sec(last_update)%%(60*60))) as intervals, round(avg(available_bike_stands), 0) as available_bike_stands, round(avg(available_bikes), 0) as available_bikes from station_info where DAYOFWEEK(last_update) = ' + str(day_number) + ' and name = "' + name + '" group by intervals;'
    res = engine.execute(sql).fetchall()
    data = []
    for row in res:
        data.append(dict(row))
    for i in range(0, len(data)):
        data[i]['available_bikes'] = int(data[i]['available_bikes'])
        data[i]['available_bike_stands'] = int(data[i]['available_bike_stands'])
    return jsonify(data)

@app.route("/chartWeekView/<string:name>")
def getWeekInfo(name):
    name = name.replace('%27', "'")
    engine = get_db()
    weekData = [];
    for i in range(1, 8):
        sql = 'select DAYNAME(last_update) as week_day, unix_timestamp(sec_to_time(time_to_sec(last_update)- time_to_sec(last_update)%%(360*60))) as intervals, round(avg(available_bike_stands), 0) as available_bike_stands, round(avg(available_bikes), 0) as available_bikes from station_info where DAYOFWEEK(last_update) = ' + str(i) + ' and name = "' + name + '" group by intervals;'
        res = engine.execute(sql).fetchall()
        data = []
        for row in res:
            data.append(dict(row))
        for i in range(0, len(data)):
           data[i]['available_bikes'] = int(data[i]['available_bikes'])
           data[i]['available_bike_stands'] = int(data[i]['available_bike_stands'])
        weekData.append(data)
        print(weekData)
    return jsonify(weekData)

@app.route("/chartTodayView/<string:name>")
def getTodayInfo(name):
    name = name.replace('%27', "'")
    print(name)
    engine = get_db()
    sql_week_day = 'select last_update, DAYOFWEEK(last_update) from station_info order by last_update desc limit 1;'
    res_week_day = engine.execute(sql_week_day).fetchall()
    sql = 'select unix_timestamp(sec_to_time(time_to_sec(last_update)- time_to_sec(last_update)%%(60*60))) as intervals, round(avg(available_bike_stands), 0) as available_bike_stands, round(avg(available_bikes), 0) as available_bikes from station_info where DAYOFWEEK(last_update) = ' + str(res_week_day[0][1]) + ' and name = "' + name + '" group by intervals;'
    res = engine.execute(sql).fetchall()
    data = []
    for row in res:
        data.append(dict(row))
    for i in range(0, len(data)):
        data[i]['available_bikes'] = int(data[i]['available_bikes'])
        data[i]['available_bike_stands'] = int(data[i]['available_bike_stands'])
    return jsonify(data)

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
    app.run(debug = True, port=5003)
