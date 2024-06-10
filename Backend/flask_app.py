import joblib
import flask
from flask import request, jsonify
from sklearn.metrics import mean_squared_error
import pandas as pd
from update_csv import is_holiday, is_weekend
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from flask_cors import CORS, cross_origin
import json
import math
from sqlalchemy.orm.attributes import flag_modified
from sqlalchemy import func

app = Flask(__name__)
cors = CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    api_key = db.Column(db.String(120), nullable=False)

class Cafe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(244))
    name = db.Column(db.String(120), nullable=False)
    pos_name = db.Column(db.String(80), nullable=True)
    cells = db.Column(db.JSON, nullable=True, default=json.dumps([
        {"number": "1", "percentage": 12.5, "cost": 30, "name": "Американо", "cost_price": 7.5},
        {"number": "2", "percentage": 12.5, "cost": 100, "name": "Американо з молоком", "cost_price": 9.65},
        {"number": "3", "percentage": 12.5, "cost": 70, "name": "Лате", "cost_price": 12.84},
        {"number": "4", "percentage": 12.5, "cost": 90, "name": "Капучіно", "cost_price": 11.92},
        {"number": "5", "percentage": 12.5, "cost": 120, "name": "Мокачіно", "cost_price": 16.86},
        {"number": "6", "percentage": 12.5, "cost": 30, "name": "Шоколад з молоком", "cost_price": 11.69},
        {"number": "7", "percentage": 12.5, "cost": 80, "name": "Шоколад", "cost_price": 15.92},
        {"number": "8", "percentage": 12.5, "cost": 35, "name": "Чай з лимоном", "cost_price": 10.84}
    ]))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    user = db.relationship('User', backref=db.backref('all_cafes', lazy=True))

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date)
    revenue = db.Column(db.Float, nullable=False)
    productQuantity = db.Column(db.Integer, nullable=False)
    cafe_id = db.Column(db.Integer, db.ForeignKey('cafe.id'), nullable=True)
    cafe = db.relationship('Cafe', backref=db.backref('all_orders', lazy=True))
    

def load_model():
    return joblib.load('XGBoost.joblib')

@app.route('/add_cafe', methods=['POST'])
def add_cafe():
    if not request.json or not all(key in request.json for key in ['company_name', 'name', 'pos_name']):
        return jsonify({'error': 'Missing data'}), 400

    company_name = request.json['company_name']
    name = request.json['name']
    pos_name = request.json['pos_name']

    new_cafe = Cafe(company_name=company_name, name=name, pos_name=pos_name)
    db.session.add(new_cafe)
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    return jsonify({'success': f'Cafe {new_cafe.name} added'}), 201

@app.route('/add_cells_prices', methods=['POST'])
@cross_origin(origins="*")
def add_coffe_prices():
    request_data = request.get_json()
    cafe_id = request_data["cafeId"]
    cafe = db.session.get(Cafe, cafe_id)
    if not cafe:
        return {'error': 'Cafe not found'}, 404
    cafe_cells = cafe.cells
    print(cafe_cells)
    for key,value in request_data.items():
        if key == "cafeId":
            continue
        elif key.startswith("cellCost"):
            cafe_cells[int(key[-1])-1]["cost"] = value
        elif key.startswith("cellName"):
            cafe_cells[int(key[-1])-1]["name"] = value
    cafe.cells = cafe_cells
    print(cafe.cells)
    flag_modified(cafe, 'cells')
    db.session.commit()
    
    return {'message': 'Cafe updated successfully'}, 200

@app.route('/get_cafes_by_username')
@cross_origin(origins="*")
def get_cafes():
    username = request.args.get("username")
    user = User.query.filter_by(name=username).first()
    if not user:
        return "User is not found"

    cafes = user.all_cafes
    res_cafes = []
    for cafe in cafes:
        res_cafes.append({"id": cafe.id,"cafeName": cafe.name, "posName": cafe.pos_name, "companyName": cafe.company_name})
    return jsonify(res_cafes)


@app.route('/get_week_predictions')
@cross_origin(origins="*")
def get_predictions():
    model = load_model()
    data = []
    date_format = "%Y-%m-%d"
    start_date = request.args.get("startDate")
    end_date = request.args.get("endDate")
    cafe_id = request.args.get("cafeId")
    username = request.args.get("username")

    cafe_name = Cafe.query.filter_by(id=cafe_id).first().name

    try:
        end_date = datetime.strptime(end_date, date_format).date()
    except:
        return jsonify({"error": "incorrect endDate"})
    
    try:
        date = datetime.strptime(start_date, date_format).date()
    except:
        return jsonify({"error": "incorrect startDate"})
    
    while date <= end_date:
        weekend = is_weekend(date) if not is_holiday(date) else True

        new_data = pd.DataFrame({
            'month': [date.month],
            'day': [date.day],
            'dayofweek': [date.weekday()],
            'weekend': [weekend],
            'cafeName': [cafe_name],
            "username":[username]
        })

        try:
            predicted_data = model.predict(new_data)
        except:
            return jsonify({"error": "incorrect cafeName"})
        
        if predicted_data[0][0] > round(predicted_data[0][1]) * 80:
            result_revenue = round(predicted_data[0][1])*40
        else:
            result_revenue = predicted_data[0][0]
        data.append({"date": date.strftime(date_format), "revenue": round(result_revenue), "productQuantity": round(predicted_data[0][1])})

        date += timedelta(days=1)

    return jsonify(data)

@app.route('/get_week_sales')
@cross_origin(origins="*")
def get_sales():
    date_format = "%Y-%m-%d"

    start_date = request.args.get("startDate")
    end_date = request.args.get("endDate")
    cafe_id = request.args.get("cafeId")

    end_date = datetime.strptime(end_date, date_format).date()
    start_date = datetime.strptime(start_date, date_format).date()
        
    orders = Order.query.filter(Order.cafe_id == cafe_id).filter(Order.date.between(start_date, end_date)).order_by(Order.date).distinct().all()
    
    result = []
    for order in orders:
        result.append({"date": order.date, "revenue": order.revenue, "productQuantity": order.productQuantity})

    return jsonify(result)


@app.route('/get_payback')
@cross_origin(origins="*")
def get_payback():
    model = load_model()
    cafe_id = request.args.get("cafeId")
    username = request.args.get("username")
    cafe = db.session.get(Cafe, cafe_id)
    cafe_cells = cafe.cells
    average_profit = 0
    all_orders = Order.query.filter(Order.cafe_id == cafe_id).order_by(Order.date).all()
    
    for cell in cafe_cells:
        average_profit += (float(cell["cost"]) - cell["cost_price"]) * (cell["percentage"]/100)
    print(f"average profit = {average_profit}")

    days_count = 0
    balance = -141000
    start_date = 0

    for order in all_orders:
        
        days_count+=1
        if days_count == 1:
            start_date = order.date
        print(days_count)

        if order.date.day == 1:
            balance -= 6000

        balance += order.productQuantity * average_profit
        print(f"{balance}\n")

        if balance >=0:
            return jsonify({"days_for_payback_0_to_100":days_count, "days_for_payback": 0, "return_on_investment": (balance/141000)*100})
        
        last_date = order.date
    
    days_gone = days_count
    date = last_date
    print("go to model")
    write = True
    payback_days_count = 0
    while date.month != start_date.month or balance < 0:
        if days_count >= 2000: 
            break
        days_count+=1
        print(days_count)
        weekend = is_weekend(date) if not is_holiday(date) else True

        if date.day == 1:
            balance -= 6000

        new_data = pd.DataFrame({
            'month': [date.month],
            'day': [date.day],
            'dayofweek': [date.weekday()],
            'weekend': [weekend],
            'cafeName': [cafe.name],
            'username':[username]
        })
        predicted_data = model.predict(new_data)

        balance += predicted_data[0][1] * average_profit
        print(f"{balance}\n")
        if balance >= 0 and write:
            payback_days_count = days_count
            write = False
        date += timedelta(days=1)

    roi = (balance/141000)*100
    return jsonify({"days_for_payback_0_to_100":payback_days_count, "days_for_payback": payback_days_count - days_gone, "return_on_investment": roi})

@app.route('/get_coffee')
@cross_origin(origins="*")
def get_coffee():
    cafe_id = request.args.get("cafeId")
    cafe = db.session.get(Cafe, cafe_id)
    cafe_cells = cafe.cells
    result = []
    for cell in cafe_cells:
        result.append({"name":cell["name"], "cost": cell["cost"]})
    return jsonify(result)

from sqlalchemy import asc

@app.route('/get_turnover')
@cross_origin(origins="*")
def get_turnover():
    model = load_model()
    average_costs = []
    average_cost_prices= []
    username = request.args.get("username")
    cafes = User.query.filter(User.name == username).first()
    print(cafes)
    cafes=cafes.all_cafes
    cafe_ids = [cafe.id for cafe in cafes]

    all_orders = []
    for cafe_id in cafe_ids:
        # Fetch the first 30 orders for each café
        orders = db.session.query(Order)\
                           .filter(Order.cafe_id == cafe_id)\
                           .order_by(asc(Order.date))\
                           .limit(30)\
                           .all()
        all_orders.extend(orders)

    for cafe in cafes:
        cafe_cells = cafe.cells
        average_cost = 0
        average_cost_price = 0

        for cell in cafe_cells:
            average_cost_price += (cell["cost_price"]) * (cell["percentage"]/100)
            average_cost += float(cell["cost"]) * (cell["percentage"]/100)

        average_costs.append(average_cost)
        average_cost_prices.append(average_cost_price)

    print(len(all_orders))
    net_income = -141000
    turnover = 0
    start_date = 0
    write = True
    for order in all_orders:
        cafe_id = cafe_ids.index(order.cafe_id)
        print(f"average cost = {average_costs[cafe_id]}")
        print(f"average cost price = {average_cost_prices[cafe_id]}")
        if write:
            start_date = order.date
            write = False

        if order.date.day == 1:
            net_income -= 6000

        net_income -= order.productQuantity * average_cost_prices[cafe_id] 
        turnover += order.productQuantity * average_costs[cafe_id]   
        last_date = order.date

    return jsonify({"annual_turnover":math.floor(turnover)*12, "annual_income": math.floor(turnover -6000)*12 - 141000, "cafesCount": len(cafes)})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port = 8000)
