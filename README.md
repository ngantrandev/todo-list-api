# TODO LIST API

## 1. What does this project do?

This project is a simple API for managing todo list.

## 2. What does this project can do?

- Create a new task
- Update a task
- Delete a task
- Get all tasks
- Get a task by id
- Get all parent tasks of a task
- Create / Delete a reference between tasks
- Detect a circular dependency in tasks
- Prevent circular dependency when adding new reference

## 3. 🚀 What technologies does this project use?

- NodeJS
- ExpressJS
- MySQL
- Redis
- Nodemailer
- JWT
- Docker

## 4. How to run this project?

### 4.1. First method: with docker

- Clone this project
- Create <code>.env</code> file in the root directory with following format

```bash
  APP_PORT= 8000

  DB_HOST= localhost                     (OPTIONAL)
  DB_PORT= 3306                          (OPTIONAL)
  DB_USER= root                          (OPTIONAL)
  DB_PASS= password                      (OPTIONAL)
  DB_NAME= tododb                        (OPTIONAL)

  REDIS_HOST= localhost                  (OPTIONAL)
  REDIS_PORT= 5678                       (OPTIONAL)
  REDIS_PASSWORD= password               (OPTIONAL)

  JWT_SECRET_KEY=secret
  ACCESS_TOKEN_EXPIRES_IN=1d

  EMAIL_USER = your@gmail.com            (OPTIONAL)
  EMAIL_PASS = 'umtj jklmn mvtg wrnz'    (OPTIONAL)
  EMAIL_HOST = gmail                     (OPTIONAL)
```

- Run the following command:

```bash
  docker-compose up --build
```

### 4.2. Second method: without docker

- Clone this project
- Create <code>.env</code> file in the root directory with following format

```bash
  APP_PORT= 8000

  DB_HOST= localhost
  DB_PORT= 3306
  DB_USER= root
  DB_PASS= password
  DB_NAME= tododb

  REDIS_HOST= localhost
  REDIS_PORT= 5678
  REDIS_PASSWORD= password

  JWT_SECRET_KEY=secret
  ACCESS_TOKEN_EXPIRES_IN=1d

  EMAIL_USER = your@gmail.com
  EMAIL_PASS = 'umtj jklmn mvtg wrnz'
  EMAIL_HOST = gmail
```

- Run the following command:

Step 1: Install dependencies

```bash
  npm install
```

Step 2: Run project

Option 1:

```bash
  npm run dev    # for development
```

Option 2:

```bash
  npm run build  # for build
  npm run start  # for run bundle code
```

[✨ Made by NodeJS with ❤️](https://github.com/ngantrandev)
