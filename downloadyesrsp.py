# -*- coding: utf-8 -*-
"""村里戶數、單一年齡人口（新增區域代碼）.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/1xoNbNQjXAX7mR1QPCrmlXIxB0o7a6_4V
"""

import pandas as pd
import json
import csv
import requests

#json_url = 'http://data.moi.gov.tw/MoiOD/System/DownloadFile.aspx?DATA=22CFBCD7-63BB-4E58-ADF3-B50BFE55ECED'
json_url = 'https://www.ris.gov.tw/rs-opendata/api/v1/datastore/ODRP014/10701'

data = requests.get(json_url)

#data.text

#data.text.split(",\n")

result = []
json_url_noy = 'https://www.ris.gov.tw/rs-opendata/api/v1/datastore/ODRP014/'
for data_years in [i for i in range(10704,10809)]:
  data = requests.get(json_url_noy+str(data_years))
  print('The ',data_years,'is downloading.')
  for page in range(1,int(''.join(i for i in data.text.split(",\n")[2].split(":")[1] if i.isdigit()))+1):
    new_url = json_url_noy+str(data_years)+'?page='+str(page)
    #print(new_url)
    data = requests.get(new_url)
    read_page = int(json.loads(data.text)['page'])
    #print(read_page)
    if page == read_page:
      if len(json.loads(data.text)['responseData']) == int(json.loads(data.text)['pageDataSize']):
        for row in json.loads(data.text)['responseData']:
          district_code = row['district_code']
          district_code = row['district_code'][:-3]
          if district_code == 6500021:
            district_code = 6502100
          totaloldf = 0
          totaoldlm = 0
          oldpeople = 0
          for years in range(65,100):
            totaloldf = int(row['people_age_'+'{:03d}'.format(years)+'_f']) + totalf
            totaloldm = int(row['people_age_'+'{:03d}'.format(years)+'_m']) + totalm
          oldpeople = totaloldf + totaoldlm
          result.append([district_code,oldpeople])
      else:
        print('Error Data no.')
    else:
      print('Error page no.')
      
res={}
for cur, val in result:
    if cur in res:
        # If the currency already exists, add the value to its total
        res[cur] += val
    else:
        # else create a new key/value pair in the dictionary.
        res[cur] = val

headers=['TOWNID', 'oldpeopletotal']
with open('oldpeopledata.csv','w') as f:
    writedCsv = csv.writer(f)
    writedCsv.writerow(headers)
    for key, value in res.items():
       writedCsv.writerow([key, value])
print('finished')


