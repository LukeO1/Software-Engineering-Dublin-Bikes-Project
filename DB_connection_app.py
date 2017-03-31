
from flask import Flask, g, render_template, jsonify
from sqlalchemy import create_engine


app = Flask(__name__)  #creating the App

def get_db():
    engine = getattr(g,'engine', None)
    if engine is None:
        engine = create_engine('mysql+mysqldb://dublinbikes:dublinbikes@dublinbikes.ce0mzpzqjeei.us-west-2.rds.amazonaws.com/dublinbikes')
        g.engine = engine
    return engine

#result = connection.execute("select * from dublinbikes.new_bike_stations_real_time limit 10")
@app.route("/station/<int:station_id>")
def get_station(station_id):
    engine = get_db()
    sql = """
    select name, number
    from dublinbikes.new_bike_stations_real_time 
    limit 10;
    """
    res = engine.execute(sql).fetchall()
    #return "this is station {} {}".format(station_id, engine)
    print(res)
    return jsonify([list(x) for x in res])
@app.route('/')  #defining a basic route
def main():
    #return render_template('index.html')
    return "Hello"

if __name__ == "__main__":
    app.run(debug=True, port=5001)


