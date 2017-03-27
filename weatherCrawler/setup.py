from setuptools import setup

setup(name="weatherCrawler",
      version="0.1",
      description="Program that creates the table in the Amazon RDS and crawls Open Weather API for data to populate table with stations information.",
      author="Team16",
      author_email="lucas.onderwater@ucdconnect.ie",
      license="GPL3",
      packages=['weatherCrawler'],
      entry_points={
          'console_scripts':['weatherCrawler=weatherCrawler.weather:main']
          },
      install_requires=[
          'sqlalchemy',
          'pymysql',
          'pyowm',
          ],
      )
