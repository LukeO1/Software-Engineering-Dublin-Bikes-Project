from sqlalchemy import Column, Integer, String, Float, Boolean, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import requests

#This code here is used because, apparently, Python3 doesnt' have native MySQLdb?
#Should check if this really is the case. In the meantime, you will have to import
#the module pymysql.
try:
    import pymysql
    pymysql.install_as_MySQLdb()
except ImportError:
    pass

def base(engine):
    #This code is used to set up a database. Careful: __tablename__ is not a variable name, so
    #do not change it.
    Base = declarative_base()
    class User(Base):
        __tablename__ = 'static_information'

        number = Column(Integer, primary_key=True)
        contract_name = Column(String(255))
        name = Column(String(255))
        address = Column(String(255))
        position_lat = Column(Float)
        position_lng = Column(Float)
        banking = Column(Boolean)
        bonus = Column(Boolean)
        bike_stands = Column(Integer)

    #This code sends the command to create the table. If table is already created, it does not overwrite.
    Base.metadata.create_all(engine)
    return User

def connectAPI():
    #This code open the connection to the Dublin Bikes API.
    base_url = 'https://api.jcdecaux.com/vls/v1/stations?contract=Dublin&apiKey=8a48bea4967f8f374d1b211fc80da143d607e28a'

    #This code sets up our static data table for all the stations.
    #This code gets the data from Dublin Bikes.
    response = requests.get(base_url)
    #print(response) #This is just to show that the response connected without error (should show <Response [200]. It can be commented out.
    return response

def callAPI():
    response = connectAPI()
    results = response.json()
    return results

def main():
    #This code creates/opens the connection to the database
    engine = create_engine('mysql+pymysql://dublinbikes:dublinbikes@dublinbikes.c2xnnykekrgc.us-west-2.rds.amazonaws.com/dublinbikes')
    user = base(engine)
    #This code sets up a session. The session is like a notepad, where we take notes of all the changes
    #we want to do the database.

    Session = sessionmaker(bind=engine)
    session = Session()

    results = callAPI()
    #This code iterates over the lines in the array(or list? or tupple?, not sure...)
    #sent over by Dublin Bikes.
    for i in results:
        #This code creates a row
        ed_user = user(number=i['number'], contract_name=i['contract_name'], name=i['name']
                       , address=i['address'], position_lat=i['position']['lat'], position_lng=i['position']['lng'],
                       banking=i['banking'], bonus=i['bonus'], bike_stands=i['bike_stands'])
        #Save row in notepad. Attention: the row is only stored in the notepade at this point.
        #Its not yet in the database.
        session.add(ed_user)
    #This code makes the actual changes to the database.
    session.commit()

if __name__ == '__main__':
    main()
