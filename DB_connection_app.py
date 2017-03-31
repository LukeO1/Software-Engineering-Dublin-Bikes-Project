from flask import *
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)  #creating the App

mysql = SQLAlchemy()
app.config['MYSQL_DATABASE_USER'] = 'dublinbikes'
app.config['MYSQL_DATABASE_PASSWORD'] = 'dublinbikes'
app.config['MYSQL_DATABASE_DB'] = 'dublinbikes'
app.config['MYSQL_DATABASE_HOST'] = 'dublinbikes.ce0mzpzqjeei.us-west-2.rds.amazonaws.com/dublinbikes'
mysql.init_app(app)
#app.config['SQLALCHEMY_DATABASE_URI']='mysql://dublinbikes:dublinbikes@dublinbikes.ce0mzpzqjeei.us-west-2.rds.amazonaws.com/dublinbikes'
#db =SQLAlchemy(app)

#conn = db.connect()
#cursor =conn.cursor()

#cursor.callproc('showten')

@app.route('/')  #defining a basic route

def main():
    return render_template('index.html')

if __name__ == "__main__":
    app.run()