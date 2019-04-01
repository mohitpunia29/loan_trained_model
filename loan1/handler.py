import numpy as np
import requests, json, os, sys
from sklearn.linear_model import LogisticRegressionCV
from sklearn.preprocessing import MinMaxScaler
import pickle


def handle(req):
    
    """handle a request to the function
    Args:
        req (str): request body
    """
    json_req = json.loads(req)
    json_data=json_req['Short Term']

   # file_norm = open("min_max_loan.sav")
    #norm = pickle.load(file_norm)


   # return json.dumps({'success': 200,'data': {'prediction': json_data}})
    
  #  if type(json_req['Current Loan Amount']) != int or type(json_req['Short Term']) != int or type(json_req['Long Term']) != int
   # or type(json_req['Annual Income']) != int or type(json_req['Credit Score']) != int or type(json_req['Maximum Open Credit']) != int:
     #   return 400
    sample=np.asarray([json_req['Current Loan Amount'],json_req['Short Term'],json_req['Long Term'],json_req['Annual Income'],json_req['Credit Score'],json_req['Maximum Open Credit']])
    
    file_norm = open("./min_max_loan.sav","rb")
    norm = pickle.load(file_norm)
    uq_vectorized = norm.transform(sample)
        
    #file_ml = open("logistic_regression.sav","rb")
    #model = pickle.load(file_ml)

    #pred_result=model.predict(sample)
    
       
    #if prediction == 0:
     #   pred_result = 'Full Paid'
    #else:
     #   pred_result = 'Charged Off'
    return json.dumps({'success': 200,'data': {'prediction': json_req}})
