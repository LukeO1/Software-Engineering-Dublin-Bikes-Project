from flask import Flask, g, jsonify, render_template
from sqlalchemy import create_engine

app = Flask(__name__, static_url_path='')

def get_db():
    engine = getattr(g,'engine', None)
    if engine is None:
        #If conenction does not exist, create the connection
        engine = create_engine('mysql+pymysql://dublinbikes:dublinbikes@dublinbikes.c2xnnykekrgc.us-west-2.rds.amazonaws.com/dublinbikes')
        g.engine = engine
    return engine

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
