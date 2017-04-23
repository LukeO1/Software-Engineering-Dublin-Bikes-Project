import unittest
from flask import jsonify
import static_table
from sqlalchemy import create_engine

#This test suite is applicable to create_table_and_rows.py (the dynamic data crawler) as well

class MyTestCase(unittest.TestCase):
    #Ensures the connection is being made correctly
    def test_connectAPI(self):
        response = static_table.connectAPI()
        self.assertEqual(response.status_code, 200)

    #Ensures that we are getting 101 rows from DublinBikes API
    def test_callAPI(self):
        response = static_table.callAPI()
        counter = 0
        for i in response:
            counter += 1
        self.assertEqual(counter, 101)

    #After the calls have been made to insert the data into the database, test to see if data is indeed, in database
    def test_check_data(self):
        engine = create_engine('mysql+pymysql://dublinbikes:dublinbikes@dublinbikes.c2xnnykekrgc.us-west-2.rds.amazonaws.com/dublinbikes')
        number_rows = engine.execute("SELECT count(number) from static_information").fetchall()
        self.assertEqual(number_rows[0][0], 101)
        engine = create_engine('mysql+pymysql://dublinbikes:dublinbikes@dublinbikes.c2xnnykekrgc.us-west-2.rds.amazonaws.com/dublinbikes')
        number_rows = engine.execute("SELECT name from static_information where name= 'GRANTHAM STREET'").fetchall()
        self.assertEqual(number_rows[0][0], 'GRANTHAM STREET')

if __name__ == '__main__':
    unittest.main()
