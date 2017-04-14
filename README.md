## Instalation ##

1. Python at version `3.5`
2. Node at version `7.6.x`
3. Install virtualenv `15.1.x`
4. Create python virtual environment for project home dir by `virtualenv .`
5. Activate virtualenv by `source ./bin/activate`
6. Install python dependencies `pip install -r requirements.txt`
7. Install bower globally `npm i -g bower`
8. Install frontend packages `bower install`
9. Run databases migrations `python manage.py migrate`

## Developing ##

Start dev-server by `python manage.py runserver`. Server is available at localhost:8000.