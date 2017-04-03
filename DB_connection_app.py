
from flask import Flask, g, render_template, jsonify
from sqlalchemy import create_engine



app = Flask(__name__)  #creating the App

def get_db():
    engine = getattr(g,'engine', None)
    if engine is None:
        engine = create_engine('mysql+pymysql://dublinbikes:dublinbikes@dublinbikes.ce0mzpzqjeei.us-west-2.rds.amazonaws.com/dublinbikes')
        g.engine = engine
    return engine

#result = connection.execute("select * from dublinbikes.new_bike_stations_real_time limit 10")
@app.route("/station")
def get_station():
    engine = get_db()

    sql = """
    select *
    from dublinbikes.new_bike_stations_real_time
    limit 10;
    """
    res = engine.execute(sql).fetchall()
    # return "this is station {} {}".format(station_id, engine)
    print(res)
    return jsonify([dict(row.items()) for row in res])
@app.route('/')  #defining a basic route
def main():
    return render_template('DBikes.html')
    # return "Hello"

if __name__ == "__main__":
    app.run(debug=True, port=5000)


