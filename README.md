# Library Management Application
## Author
Yash Mishra
21f1006461@ds.study.iitm.ac.in
## Video
https://drive.google.com/file/d/1ihIMQgZEJOAEUEwdQf85yIRldis8BDKY/view?usp=sharing
## Description
The Library Management System is a modern solution for efficiently managing e-books and 
sections in a library environment. Developed using Flask for API and VueJS for the user interface, 
it offers essential functionalities for both librarians and users. Librarians can add, edit, and remove 
sections and e-books, while users can search for and request books. The system employs rolebased access control for secure user authentication and features backend jobs for exporting, 
reporting, and sending emails daily and APIs for interaction with library resources.
## Technologies used
- Python and following modules

<table>
  <tr>
    <td>
      amqp==5.2.0<br>
      aniso8601==9.0.1<br>
      async-timeout==4.0.3<br>
      bcrypt==3.2.2<br>
      billiard==4.2.0<br>
      blinker==1.5<br>
      cachelib==0.9.0<br>
      celery==5.3.5<br>
      cffi==1.16.0<br>
      chardet==5.2.0<br>
      click==8.1.3<br>
      click-didyoumean==0.3.0<br>
      click-plugins==1.1.1<br>
    </td>
    <td>
      click-repl==0.3.0<br>
      colorama==0.4.6<br>
      dnspython==2.3.0<br>
      email-validator==1.3.1<br>
      Flask==2.2.3<br>
      Flask-Caching==2.1.0<br>
      Flask-Excel==0.0.7<br>
      Flask-Login==0.6.2<br>
      Flask-Principal==0.4.0<br>
      Flask-RESTful==0.3.10<br>
      Flask-Security-Too==5.1.2<br>
      Flask-SQLAlchemy==3.0.3<br>
      Flask-WTF==1.1.1<br>
      greenlet==2.0.2<br>
    </td>
    <td>
      idna==3.4<br>
      importlib-metadata==6.0.0<br>
      itsdangerous==2.1.2<br>
      Jinja2==3.1.2<br>
      kombu==5.3.3<br>
      lml==0.1.0<br>
      MarkupSafe==2.1.2<br>
      passlib==1.7.4<br>
      prompt-toolkit==3.0.40<br>
      pycparser==2.21<br>
      pyexcel==0.7.0<br>
      pyexcel-io==0.6.6<br>
      pyexcel-webio==0.1.4<br>
    </td>
    <td>
      python-dateutil==2.8.2<br>
      pytz==2023.3.post1<br>
      redis==5.0.1<br>
      six==1.16.0<br>
      SQLAlchemy==2.0.6<br>
      texttable==1.7.0<br>
      typing_extensions==4.5.0<br>
      tzdata==2023.3<br>
      vine==5.1.0<br>
      wcwidth==0.2.9<br>
      Werkzeug==2.2.3<br>
      WTForms==3.0.1<br>
      zipp==3.15.0
    </td>
  </tr>
</table>


- Sqlite for database
- Flask for API
- Vue.js for UI
- Bootstrap for css
- Redis for caching
- Redis and Celery for batch jobs

## DB Schema Design
![image](https://github.com/user-attachments/assets/ca47f766-8091-4621-a167-1a85d9396765)

## Getting Started
### Prerequisites
- Python 3.8 or higher
- Redis server
### Installation
1. Clone the repository:

```
git clone https://github.com/the-y9/LibraryManagement.git
cd LibraryManagementSystem
```
2. Install the required packages:

```
pip install -r requirements.txt
```
### Running the Application
1. Initialize the database:

```
python upind.py
```
2. Start the Flask application:

```
python main.py
```
3. Access the application in your web browser at http://localhost:5000/.

### Starting Background Services
1. Start the Redis server:

```
redis-server
```
2. Start Celery workers:

```
celery -A app.celery worker --loglevel=info
```
3. Start Celery beat:

```
celery -A app.celery beat --loglevel=info
```
