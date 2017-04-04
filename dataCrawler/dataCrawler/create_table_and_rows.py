from sqlalchemy import Column, Integer, String, Float, Boolean, TIMESTAMP, create_engine, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError
import requests
import time
import datetime
#This code here is used because, apparently, Python3 doesnt' have native MySQLdb?
#Should check if this really is the case. In the meantime, you will have to import
#the module pymysql.
try:
    import pymysql
    pymysql.install_as_MySQLdb()
except ImportError:
    pass

def main():
    #This code is used to set up a database. Careful: __tablename__ is not a variable name, so
    #do not change it.
    Base = declarative_base()
    class User(Base):
        __tablename__ = 'station_information'

        id = Column(Integer, primary_key=True)
        name = Column(String(255))
        status = Column(String(255))
        available_bike_stands = Column(Integer)
        available_bikes = Column(Integer)
        last_update = Column(TIMESTAMP)
        UniqueConstraint('name', 'status', 'available_bike_stands', 'available_bikes', 'last_update', name='uix_1')

    #This code creates/opens the connection to the database
    engine = create_engine('mysql+pymysql://dublinbikes:dublinbikes@dublinbikes.c2xnnykekrgc.us-west-2.rds.amazonaws.com/dublinbikes')

    #This code sends the command to create the table. I left it commented because the table is already created.
    #But guess you can drop the table in the database and try to create again, to make sure it really works.
    Base.metadata.create_all(engine)

    #This code sets up a session. The session is like a notepad, where we take notes of all the changes
    #we want to do the database.
    Session = sessionmaker(bind=engine)
    session = Session()

    #This code open the connection to the Dublin Bikes API.
    base_url = 'https://api.jcdecaux.com/vls/v1/stations?contract=Dublin&apiKey=8a48bea4967f8f374d1b211fc80da143d607e28a'

    #This code sets up our 'infinite' data collection loop.
    while True:
        try:
            #This code gets the data from Dublin Bikes.
            response = requests.get(base_url)
            #print(response) #This is just to show that the response connected without error (should show <Response [200]. It can be commented out.
            results = response.json()
            #This code iterates over the lines in the array(or list? or tupple?, not sure...)
            #sent over by Dublin Bikes.
            for i in results:
                #This code here converts the Epoch time format in Dublin bikes to normal date. American style mind, Year/Month/Day!!
                time_date = datetime.datetime.fromtimestamp(i['last_update']/1000).strftime('%Y-%m-%d %H:%M:%S.%f')
                #This code creates a row
                ed_user = User(name=i['name'], status=i['status'], available_bike_stands=i['available_bike_stands'], available_bikes=i['available_bikes'], last_update=time_date)
                #Save row in notepad. Attention: the row is only stored in the notepade at this point.
                #Its not yet in the database.
                session.add(ed_user)
            #This code makes the actual changes to the database.
            session.commit()
            #This code makes the loop wait for 5 minutes before continuing the 'infinite' loop.
            #Once the 5 minutes are over, the loop will execute again, and ask Dublin Bikes for
            #more data (which, in the meantime, has been updated).
            time.sleep(300)
        except IntegrityError:
            session.rollback()
            continue
        except Exception as e:
            print(e)
            time.sleep(360)

if __name__ == '__main__':
    main()
