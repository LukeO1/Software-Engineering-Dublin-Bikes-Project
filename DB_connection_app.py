"""
from flask import *
from sqlalchemy import create_engine


app = Flask(__name__)  #creating the App
@app.route('/')  #defining a basic route

def main():
    return render_template('index.html')

if __name__ == "__main__":
    app.run()

"""
from sqlalchemy import create_engine

engine = create_engine('mysql://dublinbikes:dublinbikes@dublinbikes.ce0mzpzqjeei.us-west-2.rds.amazonaws.com/dublinbikes')
connection = engine.connect()
result = connection.execute("select * from dublinbikes.new_bike_stations_real_time limit 10")

for row in result:
    print(row)

connection.close()