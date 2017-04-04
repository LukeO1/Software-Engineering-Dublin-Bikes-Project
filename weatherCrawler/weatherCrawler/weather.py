from sqlalchemy import Column, Integer, String, Float, Boolean, TIMESTAMP, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import time
import pyowm
import traceback
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
        __tablename__ = 'weather'

        id = Column(Integer, primary_key=True)
        last_update = Column(String(255))
        status = Column(String(255))
        detailed_status = Column(String(255))
        temperature = Column(Float)
        wind_deg = Column(Float)
        wind_speed = Column(Float)
        #rain = Column(Float)
        clouds = Column(Float)
        sunrise = Column(String(255))
        sunset = Column(String(255))

    #This code creates/opens the connection to the database
    engine = create_engine('mysql+pymysql://dublinbikes:dublinbikes@dublinbikes.c2xnnykekrgc.us-west-2.rds.amazonaws.com/dublinbikes')

    #This code sends the command to create the table. I left it commented because the table is already created.
    #But guess you can drop the table in the database and try to create again, to make sure it really works.
    Base.metadata.create_all(engine)

    #This code sets up a session. The session is like a notepad, where we take notes of all the changes
    #we want to do the database.
    Session = sessionmaker(bind=engine)
    session = Session()

    #This code sets up our 'infinite' data collection loop.
    while True:
        try:
            #This code gets the data from Open weather API.
            owm = pyowm.OWM('51a2aeb31f24d602a541c80f16dd31e5')
            observation = owm.weather_at_place('Dublin,ie')
            w = observation.get_weather()
            #This code separates the data into the appropriate fields in the table.
            last_update1 = w.get_reference_time(timeformat='iso')
            status1 = w.get_status()
            detailed_status1 = w.get_detailed_status()
            temp1 = w.get_temperature('celsius')['temp']
            wind_deg1 = w.get_wind()['deg']
            wind_speed1 = w.get_wind()['speed']
            clouds1 = w.get_clouds()
            sunrise1 = w.get_sunrise_time('iso')
            sunset1 = w.get_sunset_time('iso')
            #print('Time:', last_update1, 'Status:', status1, 'Detailed status:', detailed_status1, 'Temperature:', temp1, 'Wind degree:', wind_deg1, 'Wind speed:', wind_speed1, 'Clouds:', clouds1, 'Sunrise:', sunrise1, 'Sunset:', sunset1)
            ed_user = User(last_update=last_update1, status=status1, detailed_status=detailed_status1
                               , temperature=temp1, wind_deg=wind_deg1, wind_speed=wind_speed1,
                               clouds=clouds1, sunrise=sunrise1, sunset=sunset1)
            #Save row in notepad. Attention: the row is only stored in the notepade at this point.
            #Its not yet in the database.
            session.add(ed_user)
            #This code makes the actual changes to the database.
            session.commit()
            #This code makes the loop wait for 30 minutes before continuing the 'infinite' loop.
            #Once the 30 minutes are over, the loop will execute again, and ask Open Weather for
            #more data (which, in the meantime, should have been updated).
            time.sleep(1800)
        except:
            print(traceback.format.exc())
            time.sleep(300)

if __name__ == '__main__':
    main()
