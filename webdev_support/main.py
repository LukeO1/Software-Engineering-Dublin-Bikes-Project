from flask import Flask, g, jsonify, render_template
from sqlalchemy import create_engine
import pandas
import numpy

app = Flask(__name__, static_url_path='')

def get_db():
    engine = getattr(g,'engine', None)
    if engine is None:
        #If conenction does not exist, create the connection
        engine = create_engine('mysql+pymysql://dublinbikes:dublinbikes@dublinbikes.c2xnnykekrgc.us-west-2.rds.amazonaws.com/dublinbikes')
        g.engine = engine
    return engine

#@app.route('/detailed/<int:station_id>')
@app.route('/detailed/<string:station_name>')
def get_occupancy(station_name):
    engine = get_db()
    #number = engine.execute("SELECT number from static_information where")
    df = pandas.read_sql_query("SELECT available_bike_stands, available_bikes, last_update from station_info where name=%(name)s and status='OPEN' order by last_update DESC", engine, params={'name':station_name})
    df.set_index('last_update', inplace=True)
    #df.index.name = None
    df = df.resample('D')
    df = df.reset_index()
    df['day_of_week'] = df['last_update'].dt.weekday_name
    #df['last_update'] = df.index
    x = df.to_html(classes='station')
    return x
    #return render_template('index.html', data=data)

@app.route('/')
def main():
    engine = get_db()
    data = []
    rows = engine.execute("SELECT name from static_information order by name")
    for row in rows:
        data.append(dict(row))
    return render_template('index.html', data=data)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
