import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import mean_squared_error, mean_absolute_error, explained_variance_score
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.neural_network import MLPRegressor
import xgboost as xgb
from sklearn.ensemble import RandomForestRegressor
import math
import joblib
from sklearn.impute import SimpleImputer


data = pd.read_csv('dataset.csv')

data['date'] = pd.to_datetime(data['date'])
data['month'] = data['date'].dt.month
data['day'] = data['date'].dt.day
data['dayofweek'] = data['date'].dt.dayofweek

categorical_features = ['cafeName', 'username']
numeric_features = ['month', 'day', 'dayofweek', 'weekend']

numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='mean')) 
])

categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
    ('onehot', OneHotEncoder(handle_unknown='ignore'))
])

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features)
    ])

xgb_model = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', xgb.XGBRegressor(objective='reg:squarederror', n_estimators=100, random_state=42))
])

X = data.drop(['revenue', 'date', 'productQuantity', 'clientsNumber', 'averageBill'], axis=1)
y = data[['revenue', 'productQuantity']]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
                                                                                                                                
xgb_model.fit(X_train, y_train)

joblib.dump(xgb_model, f'XGBoost1.joblib')
score = xgb_model.score(X_test, y_test)
y_pred = xgb_model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
evs = explained_variance_score(y_test, y_pred)
print(f'R2 Score: {xgb_model.score(X_test, y_test):.4f}, RMSE: {math.sqrt(mse):.4f}, MAE: {mae:.4f}, Explained Variance: {evs:.4f}')

new_data = pd.DataFrame({
    'month': [5],
    'day': [15],
    'dayofweek': [2],
    'weekend': [False],
    'cafeName': ['Kavel_Dmytruk_Andrii'],
    "username": ["Kavel_Dmytruk_Andrii"]
})

predicted_revenue_xgb = xgb_model.predict(new_data)
print(f"Predicted Revenue - XGBoost: {predicted_revenue_xgb[0]}")
