
import requests
from pprint import pprint

# Apps Script URL을 지정합니다. (배포 시 받은 URL을 사용하세요.)
url = 'https://script.google.com/macros/s/AKfycbzVa8Wjz-LlWbBf9AHB9OQvZUlBEdU5M1r7o-RldespnyopfLc-5egTzKQqf0uBCw2E6w/exec'

# 요청을 보내고 응답을 받아옵니다.
response = requests.get(url)

# 응답을 JSON 형태로 파싱합니다.
data = response.json()

# 데이터를 예쁘게 출력합니다.
pprint(data)
