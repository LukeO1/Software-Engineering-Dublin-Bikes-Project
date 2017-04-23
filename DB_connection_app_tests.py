import DB_connection_app
import unittest
import json
from werkzeug.http import parse_cookie

class MyAppCase(unittest.TestCase):
    def setUp(self):
        DB_connection_app.app.config['TESTING'] = True
        self.app = DB_connection_app.app.test_client()


class BasicTestCase(unittest.TestCase):

    # ensures that flask was set up correctly
    def test_index(self):
        tester = DB_connection_app.app.test_client(self)
        response = tester.get('/', content_type='html/text')
        self.assertEqual(response.status_code, 200)


class DB_connection_appTestCase(unittest.TestCase):


    # assert functions
    def test_content(self):
        """Ensure database is blank"""
        rv = self.app.get('/')
        assert b'No entries here so far' not in rv.data
        assert b'Find My location' in rv.data

    def setUp(self):
        DB_connection_app.app.config['TESTING'] = True
        self.app = DB_connection_app.app.test_client()

    def test_dummy(self):
        response = self.app.get("/station/static")
        data = json.loads(response.get_data(as_text=True))

        self.assertEqual(data[0]['address'], "Chatham Street")

def response_success(response, code=200):
    if 200 <= code < 300:
        assert 200 <= response.status_code < 300
    assert code == response.status_code


def response_error(response, code=400):
    if 400 <= code < 500:
        assert 400 <= response.status_code < 500
    assert code == response.status_code


def response_redirect(response, target=None):
    assert response.status_code in [301, 302]


def json_response(response, code=200):
    # Checks that the status code is OK and returns the json
    assert response.status_code == code
    return json.loads(response.data)


def check_cookie(response, name, value):
    # Checks for existence of a cookie and verifies the value of it
    cookies = response.headers.getlist('Set-Cookie')
    for cookie in cookies:
        c_key, c_value = parse_cookie(cookie).items()[0]
        if c_key == name:
            assert c_value == value
            return
    # Cookie not found
    assert False

if __name__ == '__main__':
    unittest.main()