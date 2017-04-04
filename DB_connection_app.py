from flask import Flask, g, render_template, jsonify
from sqlalchemy import create_engine


app = Flask(__name__)  #creating the App

def get_db():
    engine = getattr(g,'engine', None)
    if engine is None: #If conenction does not exist, create the connection
        engine = create_engine('mysql+pymysql://dublinbikes:dublinbikes@dublinbikes.c2xnnykekrgc.us-west-2.rds.amazonaws.com/dublinbikes')
        g.engine = engine
    return engine

@app.route("/station")
def get_station():
    engine = get_db()
    sql = """
    select *
    from dublinbikes.static_information
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
<<<<<<< HEAD
    app.run(debug=True, port=5002)
=======
    app.run(debug=True, port=5001)
>>>>>>> aa21cdb45c50a85090f5e717fbba79ab2aa193ac


