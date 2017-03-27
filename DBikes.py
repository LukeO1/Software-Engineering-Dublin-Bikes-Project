from flask import *

app = Flask(__name__)
#Flask listens to HTTP requests and processes requests and returns HTML.
@app.route('/')
def main():
    print("rendering main...")
    return render_template("DBikes.html")

@app.route('/station_(int)')
def get_station_info(station_id):
    pass


#if you type name after the IP address eg. http://127.0.0.1:5000/DBikes/name it inserts it in the page where name is called
# @app.route('/DBikes/<name>')
def DBikes():
    def __init__(self):
        pass
    def get(self):
        headers = {'Content-Type': 'text/html'}
        return make_response(render_template("DBikes.html"), 200, headers)




if __name__ == "__main__":
    app.run(debug=True)
