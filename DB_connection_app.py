from flask import Flask, g, render_template, jsonify
from sqlalchemy import create_engine
import pandas as pd
import pyowm

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

@app.route("/station/static")
def get_station():
    """ Getting the static information from database"""
    engine = get_db()
    sql = """
    select *
    from dublinbikes.static_information
    limit 102;
    """
    res = engine.execute(sql).fetchall()
    return jsonify([dict(row.items()) for row in res])

@app.route("/station/dynamic")
def get_dynamic():
    """ Getting the dynamic information from database"""
    engine = get_db()
    sql = """
    select *
    from dublinbikes.station_info
    order by last_update DESC
    limit 102;
    """
    res = engine.execute(sql).fetchall()
    return jsonify([dict(row.items()) for row in res])


@app.route("/chartDailyView/<string:name>/<int:day_number>")
def getDayInfo(name, day_number):
    """ Getting daily available bikes and bike stand data from the database"""
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
    """ Getting weekly available bikes and bike stand data from the database"""
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
    """ Getting todays available bikes and bike stand data from the database"""
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

@app.route("/chartTodayView/detailedInformation/<string:name>")
def getFullStationInfo(name):
    """ Getting a more detailed data on todays available bikes and bike stand information from the database"""
    name = name.replace('%27', "'")
    engine = get_db()
    sql_static = 'select number, address, banking, bonus, bike_stands from static_information where name = "' + name + '";'
    res_static = engine.execute(sql_static).fetchall()
    sql_dynamic = 'select status, available_bike_stands, available_bikes, unix_timestamp(last_update) as last_update from station_info where name = "' + name + '" order by last_update limit 1;'
    res_dynamic = engine.execute(sql_dynamic).fetchall()
    print(res_static[0][1])
    print(res_dynamic)
    data = []
    for row in res_static:
        data.append(dict(row))
    for row2 in res_dynamic:
        data.append(dict(row2))
    print(data)
    return jsonify(data)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
