import requests
result = requests.post("http://172.18.116.132:5000/employeelogin",json= {
    "email":"employee1@gmail.com",
    "password":"1234"
})

print(result)
print(result.text)