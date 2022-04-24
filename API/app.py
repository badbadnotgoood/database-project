from datetime import timedelta, datetime
import math
import re
from unittest import result
from flask import Flask, request, session
from flask_cors import CORS
import pymssql
import json

application = Flask(__name__)
application.secret_key = "3XRAhZxTzilcfvk6rX8-ShqVAc_aWKnO9yw7MuLL6e0"

CORS(application, supports_credentials=True)

server = '0.0.0.0:1433'
user = 'sa'
password = 'reallyStrongPwd123'
database = 'CateringGuide3'


def db_conn():
    conn = pymssql.connect(server=server, user=user,
                           password=password, database=database)
    cursor = conn.cursor()
    return conn, cursor


@application.before_request
def before_request():
    session.permanent = True
    application.permanent_session_lifetime = timedelta(days=30)


@application.route("/api/0.1.0/checkAuth")
def check_auth():
    conn, cursor = db_conn()
    if "AuthUser" in session:
        user_data = session["AuthUser"]
        login = user_data["login"]
        password = user_data["password"]
        query = '''select *
        from t_user
        where user_login = %s
        and user_password = %s'''
        cursor.execute(query, (login, password))
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        if len(results) == 1:
            session["AuthUser"] = {
                "login": login,
                "password": password
            }
            session.modified = True
            return {"status": 1}
    return {"status": 0}


@application.route("/api/0.1.0/authUser", methods=["POST"])
def auth_user():
    conn, cursor = db_conn()
    login = request.get_json()["login"]
    password = request.get_json()["password"]
    query = '''select *
    from t_user
    where user_login = %s
    and user_password = %s'''
    cursor.execute(query, (login, password))
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    if len(results) == 1:
        session["AuthUser"] = {
            "login": login,
            "password": password
        }
        session.modified = True
        return {"status": 1}
    return {"status": 0}


@application.route("/api/0.1.0/registerUser", methods=["POST"])
def register_user():
    conn, cursor = db_conn()
    now = datetime.now()
    login = request.get_json()["login"]
    email = request.get_json()["email"]
    password = request.get_json()["password"]
    dt = now.strftime("%Y-%m-%d %H:%M:%S")
    query = '''insert into
    t_user (user_login, user_password, user_email,
            registration_dttm, active_flg)
    values (%s, %s, %s, %s, %s)'''
    cursor.execute(query, (login, password, email, dt, "Y"))
    conn.commit()
    query = '''INSERT INTO t_author(user_ref_id, user_nm, user_score_id)
    VALUES ((SELECT t_user.id FROM t_user WHERE user_login = %s), %s, 1)'''
    cursor.execute(query, (login, login))
    conn.commit()
    cursor.close()
    conn.close()
    session["AuthUser"] = {
        "login": login,
        "password": password
    }
    session.modified = True
    return {"status": 1}


@application.route("/api/0.1.0/getRaiting")
def get_raiting():
    conn, cursor = db_conn()
    query = '''select rest.restaurant_nm
    , avg(rev.rating) as rating
    , m.metro_nm
    from t_restaurant rest
    join t_review rev on rest.id = rev.restaurant_id
    join r_metro m on rest.metro_id = m.id
    group by rest.id, rest.restaurant_nm, m.metro_nm'''
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    arr = []
    for el in results:
        arr.append({
            "name": el[0],
            "metro": el[2],
            "raiting": el[1]
        })

    return json.dumps(arr)


@application.route("/api/0.1.0/getCard", methods=["POST"])
def get_card():
    rest_name = request.get_json()["restName"]
    conn, cursor = db_conn()
    query = '''select r.restaurant_nm
    , r.id --ID
    , c.cuisine_nm --Кухня
    , p.price_range_nm --Ценовая
    , d.diet_type_nm --Тип диеты
    , m.metro_nm --Метро
    , restaurant_phone --Телефон
    from t_restaurant r
    join r_metro m on r.metro_id = m.id
    join r_cuisine c on r.cuisine_id = c.id
    join r_diet_type d on r.diet_type_id = d.id
    join r_price_range p on r.price_range_id = p.id
    where restaurant_nm = %s'''
    cursor.execute(query, (rest_name))
    results = cursor.fetchall()
    data = results[0]
    cursor.close()
    conn.close()
    return {
        "name": data[0],
        "id": data[1],
        "kitchen": data[2],
        "price": data[3],
        "diet": data[4],
        "metro": data[5],
        "phone": data[6]
    }


@application.route("/api/0.1.0/getCardReviews", methods=["POST"])
def get_card_reviews():
    rest_name = request.get_json()["restName"]
    conn, cursor = db_conn()
    query = '''SELECT t_review.title, t_review.rating, t_review.content, t_review.publication_dttm, t_author.user_nm
    FROM t_review  INNER JOIN t_author ON author_id=t_author.id WHERE restaurant_id=(SELECT id FROM t_restaurant WHERE restaurant_nm = %s)'''
    cursor.execute(query, (rest_name))
    results = cursor.fetchall()
    response = []
    for el in results:
        response.append({
            "title": el[0],
            "raiting": el[1],
            "content": el[2],
            "dttm": str(el[3]),
            "username": el[4]
        })
    cursor.close()
    conn.close()
    return json.dumps(response)


@application.route("/api/0.1.0/getNearRests", methods=["POST"])
def get_near_rests():
    metro = request.get_json()["metro"]
    conn, cursor = db_conn()
    query = '''SELECT t_restaurant.restaurant_nm, r_metro.metro_nm FROM t_restaurant INNER JOIN r_metro ON metro_id=r_metro.id WHERE metro_id=(SELECT Metro2.id FROM r_metro Metro1, MetroToMetro, r_metro Metro2
    WHERE MATCH(Metro1-(MetroToMetro)->Metro2) and Metro1.metro_nm = %s) UNION
    SELECT t_restaurant.restaurant_nm, r_metro.metro_nm FROM t_restaurant INNER JOIN r_metro ON metro_id=r_metro.id WHERE metro_id=(SELECT Metro2.id FROM r_metro Metro1, MetroToMetro, r_metro Metro2
    WHERE MATCH(Metro1<-(MetroToMetro)-Metro2) and Metro1.metro_nm = %s)'''
    cursor.execute(query, (metro, metro))
    results = cursor.fetchall()
    response = []
    for el in results:
        response.append({
            "name": el[0],
            "metro": el[1]
        })
    cursor.close()
    conn.close()
    return json.dumps(response)


@application.route("/api/0.1.0/getUserData")
def get_user_data():
    username = session["AuthUser"]["login"]
    return {
        "username": username
    }


@application.route("/api/0.1.0/sendReview", methods=["POST"])
def send_review():
    conn, cursor = db_conn()
    author = session["AuthUser"]["login"]
    title = request.get_json()["title"]
    text = request.get_json()["text"]
    raiting = int(request.get_json()["raiting"])
    rest_name = request.get_json()["rest_name"]
    raiting_type = math.ceil(raiting / 2)
    if raiting_type == 5:
        raiting_type = str(raiting_type) + " звезд"
    else:
        if raiting_type == 1:
            raiting_type = "1 звезда"
        else:
            if raiting_type != 5 and raiting_type != 1:
                raiting_type = str(raiting_type) + " звезды"
    print({"ТИП": raiting_type})
    query_vars = (author, rest_name, raiting,
                  raiting_type, title, text)
    print(query_vars)
    query = '''INSERT INTO t_review(author_id, restaurant_id, rating, rating_type_id, title, content, publication_dttm)
    VALUES (
    (SELECT t_author.id FROM t_author WHERE user_nm = %s),
    (SELECT t_restaurant.id FROM t_restaurant WHERE restaurant_nm = %s),
    %s,
    (SELECT r_rating_type.id FROM r_rating_type WHERE r_rating_type.rating_type_nm = %s),
    %s, %s, CURRENT_TIMESTAMP)'''
    cursor.execute(query, (author, rest_name, raiting,
                           raiting_type, title, text))
    conn.commit()
    cursor.close()
    conn.close()
    return {
        "status": 1
    }


@application.route("/a")
def a():
    return "nu da"


if __name__ == "__main__":
    application.run(debug=True)
