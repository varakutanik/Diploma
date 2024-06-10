import requests
import pandas as pd
from datetime import datetime, timedelta
import holidays
import sqlite3



def is_weekend(date):
    return date.weekday() >= 5

def is_holiday(date, country='UA'):
    holiday_list = holidays.CountryHoliday(country)
    return date in holiday_list

def get_api_data(username, api_key):
    conn = sqlite3.connect('instance/db.db')
    c = conn.cursor()

    c.execute('INSERT INTO "user" (name, api_key) VALUES (?, ?)',
                (username, api_key))
    conn.commit()

    start_date = datetime(2024, 2, 9).date()
    end_date = datetime.now().date()
    current_date = start_date

    data = []

    while current_date <= end_date:
        current_date_str = current_date.strftime("%Y-%m-%d")
        print(current_date_str)
        current_date += timedelta(days=1)
        try:
            request = requests.get(f"http://dashboard.prostopay.net/api/dfsales/{api_key}?date={current_date_str}", timeout=10)  # 10 seconds timeout
        except requests.exceptions.Timeout:
            print("The request timed out")
        except requests.exceptions.RequestException as e:
            print(f"An error occurred: {e}")
        json_data = request.json()
        print(json_data)
        if len(json_data)!=0:
            d = json_data[0].get("d")
        else:
            continue
        date = datetime.strptime(d, "%Y-%m-%d")
        quantity = 0
        amount = 0
        purchase_amount = 0
        average_bill = 0
        weekend = False
        cafes = []
        for jd in json_data:
            cafe_name = jd.get("vmNumber")
            found_cafe = next((cafe for cafe in cafes if cafe.get("cafeName") == cafe_name and cafe.get("company_name") == jd.get("cName")), None)
            if not found_cafe:
                # try:
                    quantity = float(jd.get("quantity") if jd.get("amount") is not None else 0)
                    amount = float(jd.get("amount") if jd.get("amount") is not None else 0)
                    weekend = is_weekend(date) if not is_holiday(date) else True
                    cells = []
                    i=0
                    while i < quantity:
                        cells.append(jd.get("cell"))
                        i+=1
                    cafe_information = {"date": d, "pos_name": jd.get("posName"), "company_name": jd.get("cName"), "username": username, "cells": cells, "cafeName": cafe_name, "productQuantity": quantity, "revenue": amount, "weekend": weekend, "clientsNumber": 1, "averageBill": amount}
                    cafes.append(cafe_information)
                # except Exception as e:
                #     print(e)
                #     continue
            else:
                # try:
                    found_cafe["productQuantity"] += float(jd.get("quantity") if jd.get("amount") is not None else 0)
                    found_cafe["revenue"] += float(jd.get("amount") if jd.get("amount") is not None else 0)
                    found_cafe["clientsNumber"]+=1
                    found_cafe["averageBill"] = round(found_cafe["revenue"]/found_cafe["clientsNumber"], 2)
                    i=0
                    while i < float(jd.get("quantity") if jd.get("amount") is not None else 0):
                        found_cafe["cells"].append(jd.get("cell"))
                        i+=1
                # except Exception as e:
                #     print(e)
                #     continue
        for cafe in cafes:
            print(f"{cafe["date"]}: {cafe["cafeName"]}")
            data.append((cafe["date"], cafe["pos_name"], cafe["company_name"], cafe["username"], cafe["cafeName"], cafe["productQuantity"], cafe["revenue"], cafe["weekend"], cafe["clientsNumber"], cafe["averageBill"], cafe["cells"]))
    c.close()
    conn.close()
    print("end")
    return data



def add_data_to_DB(username, data):
    conn = sqlite3.connect('instance/db.db')
    c = conn.cursor()
    user_id = c.execute('SELECT id FROM user WHERE name = ?', (username,))
    user_id = user_id.fetchone()[0]
    for cafe in data:
        print(f"{cafe[0]}: {cafe[4]}, {cafe[2]}")
        cafe_id = c.execute('SELECT id FROM cafe WHERE name = ? AND company_name = ?', (cafe[4], cafe[2])).fetchone()
        if not cafe_id:
            print(f"userId = {user_id}")
            c.execute('INSERT INTO "cafe" (company_name, name, pos_name, user_id) VALUES (?, ?, ?, ?)',
                (cafe[2], cafe[4], cafe[1], user_id))
            conn.commit()

        cafe_id = c.execute('SELECT id FROM cafe WHERE name = ? AND company_name = ?', (cafe[4], cafe[2]))
        cafe_id = cafe_id.fetchone()[0]

        c.execute('INSERT INTO "order" (date, revenue, productQuantity, cafe_id) VALUES (?, ?, ?, ?)',
                (cafe[0], cafe[6], cafe[5], cafe_id))
        conn.commit()


    c.close()
    conn.close()
    return "DB success"

def add_data_to_csv(cafes):
    print("------------------------------------------------------")
    print(len(cafes))
    

    df = pd.DataFrame(cafes)


    df.to_csv("dataset.csv", index=False, encoding='utf-8')

    return "csv success"

if __name__ == "__main__":
    conn = sqlite3.connect('instance/db.db')
    c = conn.cursor()

    c.execute("DELETE FROM [order]")
    conn.commit()
    c.execute("DELETE FROM cafe")
    conn.commit()
    c.execute("DELETE FROM user")
    conn.commit()
    c.close()
    conn.close()
   
    data = [
        {"Kavel": "60ca3327-34f2-460f-9e20-78d370e0f24c"},
        {"Kavel_Andriy": "fd00e3be-5b0e-4f65-83d9-c19cedec2b82"},
        {"Kavel_Maccoudi": "117217d0-484a-46e2-9e9e-b96a73ce534b"},
        {"Kavel_Sambir_Malyk_Vitalii": "7972a64a-f3ec-4ef6-85c4-6b9de0b0a712"},
        {"Kavel_Dnipro_Popov_Mykhailo": "3a101fd6-3da7-4dec-9f7c-0942d2e8f5c0"},
        {"Kavel_Lviv_Sofiia_Tybinka": "a4304b44-783f-4013-9c2c-1b78541c13f9"},
        {"Kavel_Anastasiia_TTs Iskra": "4c175064-1bf5-4b29-9de7-9db263a7edec"},
        {"Kavel_Shevchuk_Mlyniv": "cef104b1-6dd9-4835-a814-beb09880f40a"},
        {"Kavel_Bodnar_Horodok": "1c70df3c-faaf-43ef-a93d-f0d4447a45eb"},
        {"Kavel_Morhun_Denys": "90440088-df35-45b2-bc95-99d13221bfda"},
        {"Kavel_Honchar": "5fdd0b90-a3b2-45a3-a4d6-aa9631c832e3"},
        {"Kavel_Kachanov_Oleksandr_Aitistep Kyiv": "a698a63d-64cf-4ad3-ab26-1f11e9d4bbf0"},
        {"Kavel_Taras_Promyslova": "edee4d32-71a3-436b-aa85-592a377eb707"},
        {"Kavel_Zakhar_Shchurko": "a3e713f4-b921-4f75-bc3c-7e026f098396"},
        {"Kavel_Prokopchak_Mahnus": "d758f25f-0b29-4841-8f68-1bb62410220a"},
        {"Kavel_Siriakov_Oleksandr_Kyiv": "e32eeb3c-a0e9-4b0c-b0ea-da7e82ed43aa"},
        {"Kavil_Vladislav_Drogobych": "2b94db25-792c-41b6-a67a-edc8f159c1be"},
        {"Kavel_Nahorna_Ternopil": "29931a36-9137-462f-9516-f6fe8473b7eb"},
        {"Kavel_Boryslav_Maksym": "a6b76c2c-f4cb-4935-9f32-15ec7d829170"},
        {"Kavel_Dzemiuk Vasyl": "f4cd1f6a-c379-4a16-8dc2-ab2280ca9d56"},
        {"Kavel_Zoriana_Lviv": "118744dd-361e-4952-af85-437b4b607b9a"},
        {"Kavel_Popko": "f3ef6a28-4050-4c60-b9f4-5cbcf2d0957c"},
        {"Kavel_Furtak": "ed300964-41a2-47c5-801f-db45b52edeac"},
        {"Kavel_Tymoshenko_Dmytro": "497facc1-d4d7-4090-adc3-f07add3781ac"},
        {"Kavel_Dmytro Suiark": "c1fe75ba-1b88-44fa-aceb-5f812c8845d4"},
        {"Kavel_Dmytruk_Andrii": "706479dd-0f11-44c8-84a7-dc2a056a57fb"},
        {"Kavel_Babichevskyi_Maksym": "7d011f8f-6985-4e6f-b80a-01fb208fb750"},
        {"Kavel_Sheremet_Roman": "0826c2b7-010b-417e-b747-24f7349e03ed"},
        {"Kavel_Paustovskyi Dmytro": "5e23d8e8-b275-4491-8d78-1b9569681d62"},
        {"Kavel_Zaiats Nazar": "1b197155-94db-4a0a-a18b-3b7ae71ead00"},
        {"Kavel_Artur Osypenko": "1c1b721a-c531-4565-b2a0-020d828c3d24"},
        {"Kavel_Yatsko Andrii": "65cea02c-d11e-4354-afb6-e19893c04bc5"},
        {"Kavil_Yuri_Sich": "0704388b-4b20-4d16-ad0d-69caf4c29e10"},
        {"Kavel_Havrylenko Serhii": "a6610048-9397-4ac8-b9cb-3e5fc43404fd"},
        {"Kavel_Tymus Iryna": "f4744682-8520-4657-9eb3-693bd7753e4e"},
        {"Kavel_Andrieieva Iryna": "f560bd77-e8a6-4f4f-9f8d-d2da454c417b"},
        {"Kavel_Kryshtop Vitalii": "445443e8-07ad-4413-963a-e715c1df6132"},
        {"Kavel_Stupiak Khrystyna": "020a8c8a-1d09-4ac6-b408-c14a3ee7974a"},
        {"Kavel_Sadovskyi": "36f1886d-a3fc-4118-8711-846a5b57f464"},
        {"Kavel_Kurylo": "5313527f-7513-43f6-893c-8b09591bf22f"},
        {"Kavel_Sviridov_Dmytro": "529fbbbc-5d0a-473d-b06a-4e54f0b33319"},
        {"Kavel_Burlak Anhelina": "d1813fa4-887c-44e3-8da5-4584c5b604ba"},
        {"Kavel_Korzhenivskyi": "0c10790b-b1f3-48f5-9017-86cad76fc96f"},
        {"Kavel_Melnyk Vitalii Anatoliiovych": "2da2bfb0-5df9-4895-8dc0-912bea09975f"},
        {"Kavel_Chumak": "9cb3157a-c169-40c9-8af0-b3345e3e9d43"},
        {"Kavel_Chornobaieva": "d1ff20ea-9fcc-4a00-b755-ae0466d739d0"}
    ]
    api_data = []
    i = 0
    for item in data:
        
        for username, api_key in item.items():
            # try:
                apidata = get_api_data(username, api_key)
                api_data += apidata
                i+=1
                print("---------------------------------------")
                print(i)
                print(add_data_to_DB(username, apidata))
                print("DATA ADDED")
            # except Exception as e:
            #     print(e)
    print(api_data)
    add_data_to_csv(api_data)