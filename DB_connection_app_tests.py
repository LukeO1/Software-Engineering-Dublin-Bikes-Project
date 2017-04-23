import DB_connection_app
import unittest
import json
from werkzeug.http import parse_cookie

class DB_connection_appTestCase(unittest.TestCase):
    def setUp(self):
        DB_connection_app.app.config['TESTING'] = True
        self.app = DB_connection_app.app.test_client()


    def test_index(self):
        """ Ensures that flask was set up correctly """
        tester = DB_connection_app.app.test_client(self)
        response = tester.get('/', content_type='html/text')
        self.assertEqual(response.status_code, 200)

    # assert functions
    def test_content(self):
        """Ensure HTML file being rendered has the right contents """
        rv = self.app.get('/')
        assert b'Find My location' in rv.data
        assert b'Find Closest Stations' in rv.data
        assert b'Availability' in rv.data

    def test_dummy(self):
        """ Ensures that JSON file from database is being read properly """
        response = self.app.get("/station/static")
        data = json.loads(response.get_data(as_text=True))

        self.assertEqual(data[0]['address'], "Chatham Street")


if __name__ == '__main__':
    unittest.main()