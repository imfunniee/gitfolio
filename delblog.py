#!/usr/bin/python3.8

"""
Python script for deleting blogs
Exceptions are not handled--improvements are needed---
"""

import json
import shutil

with open('blog.json', 'r') as data_file:
    data = json.load(data_file)

if not data:
    print("There is no blog.")
    exit(0)

i = 1

for element in data:
    print("%d." % i + element['url_title'])
    i = i + 1

print("Delete: ", end='')
option = int(input())

#print(data[option-1]['url_title'])

shutil.rmtree("blog" + (data[option-1])['url_title'])

del data[option-1]

print(data)

with open('dist/blog.json', 'w') as data_file:
    data = json.dump(data, data_file)
    
