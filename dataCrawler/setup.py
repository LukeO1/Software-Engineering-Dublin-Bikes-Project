from setuptools import setup

setup(name="dataCrawler",
      version="0.1",
      description="Program that creates the table in the Amazon RDS and crawls Dublin Bikes API for data to populate table with stations information.",
      author="Team16",
      author_email="lucas.onderwater@ucdconnect.ie",
      license="GPL3",
      packages=['dataCrawler'],
      entry_points={
          'console_scripts':['dataCrawler=dataCrawler.create_table_and_rows:main']
          },
      install_requires=[
          'sqlalchemy',
          'pymysql',
          'requests',
          ],
      )
