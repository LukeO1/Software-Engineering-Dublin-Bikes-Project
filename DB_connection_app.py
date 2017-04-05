from flask import Flask, g, render_template, jsonify
from sqlalchemy import create_engine


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
    engine = get_db()
    data = []
    rows = engine.execute("SELECT address from static_information order by address")
    for row in rows:
        data.append(dict(row))
    return render_template('DBikes.html', data=data)

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



if __name__ == "__main__":
    app.run(debug=True, port=5000)


