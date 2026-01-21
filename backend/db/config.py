import mysql.connector

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="kavya",
        password="kavya@0411",
        database="farmer"
    )
