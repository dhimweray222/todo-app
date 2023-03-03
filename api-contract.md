# Todo API Contract

## API Contract (26 April 2022)

### POST /login

#### Success

- Request

```json
{
  "email": "lifan@mail.com",
  "password": "Qweqwe123"
}
```

- Response 200

```json
{
  "token": "${string}"
}
```

#### Wrong Password

- Request

```json
{
  "email": "lifan@mail.com",
  "password": "Qweqwe" 
}
```

- Response (401)

```json
{
  "message": "Invalid email or password"
}
```

#### Wrong email

- Request

```json
{
  "email": "lifan@mail.co",
  "password": "Qweqwe123" 
}
```

- Response (401)

```json
{
  "message": "Invalid email or password"
}
```

### POST /todos

#### Success

- Headers

```json
{
  "authorization": "${string}"
}
```

- Body

```json
{
  "name": "Melakukan testing API",
  "schedule": "2022-06-06",
  "completed": false
}
```

- Response

```json
{
  "message": "Successfully create todo"
}
```

#### No Authorization Token

- Headers

```json
{}
```

- Body

```json
{
  "name": "Melakukan testing API",
  "schedule": "2022-06-06",
  "completed": false
}
```

- Response (401)

```json
{
  "message": "Unauthorized request"
}
```

#### Invalid auth token

- Headers

```json
{
  "authorization": "qweqwe"
}
```

- Body

```json
{
  "name": "Melakukan testing API",
  "schedule": "2022-06-06",
  "completed": false
}
```

- Response (401)

```json
{
  "message": "Unauthorized request"
}
```

#### Required Field Violation

- Headers

```json
{
  "authorization": "${string}"
}
```

- Body

```json
{}
```

- Response

```json
{
  "message": [
    "Name is required",
    "Schedule is required",
    "Completed is required"
  ]
}
```

#### Schedule violation


- Headers

```json
{
  "authorization": "${string}"
}
```

- Body

```json
{
  "name": "Melakukan testing API",
  "schedule": "2022-01-01",
  "completed": false
}
```

- Response

```json
{
  "message": [
    "Schedule should be greater than today"
  ]
}
```

### GET /todos

#### Success

- Headers

```json
{
  "authorization": "${string}"
}
```

- Response

```json
[
  {
  "name": "Melakukan testing API",
  "completed": false
  }
]
```

#### No auth token

- Headers

```json
{}
```

- Response (401)

```json
{
  "message": "Unauthorized request"
}
```

#### Invalid token

- Headers

```json
{
  "authorization": "qweqwe"
}
```

- Response (401)

```json
{
  "message": "Unauthorized request"
}
```

### GET /todos/:id

#### Success (200)

- Headers

```json
{
  "authorization": "${string}"
}
```

- Response

```json
{
  "name": "Latihan testing",
  "schedule": "2022-06-06",
  "completed": false
}
```
#### No Auth (401)

- Headers

```json
{}
```
- Response

```json
{
  "message": "Unauthorized request"
}
```
#### Invalid Token (401)

- Headers
```json
{
  "authorization": "qweqweqwe"
}
```

- Response
```json
{
  "message": "Unauthorized request"
}
```
#### Access by another user (401)
- Headers
```json
{
  "authorization": "${string}"
}
```

- Response
```json
{
  "message": "Unauthorized request"
}
```
#### Not found (404)

- Headers
```json
{
  "authorization": "${string}"
}
```
- Params
```json
{
  "id": 1000
}
```
- Response
```json
{
  "message": "Todo not found"
}
```

### Update /todos/:id

#### Success

- Headers

```json
{
  "authorization": "${string}"
}
```

- Body

```json
{
  "name": "Melakukan testing API",
  "schedule": "2022-06-06",
  "completed": false
}
```

- Response

```json
{
  "message": "Successfully update todo"
}
```

#### No auth
- Headers

```json
{}
```

- Body

```json
{
  "name": "Melakukan testing API",
  "schedule": "2022-06-06",
  "completed": false
}
```

- Response

```json
{
  "message": "Unauthorized request"
}
```

#### Invalid token
- Headers

```json
{
  "authorization": "Qweqweqwe"
}
```

- Body

```json
{
  "name": "Melakukan testing API",
  "schedule": "2022-06-06",
  "completed": false
}
```

- Response

```json
{
  "message": "Unauthorized request"
}
```
#### Not empty violdation
- Headers

```json
{
  "authorization": "${string}"
}
```

- Body

```json
{
  "name": "",
  "schedule": "",
  "completed": null
}
```

- Response

```json
{
  "message": [
    "Name is required",
    "Schedule is required",
    "Completed is required"
  ]
}
```

#### Schedule less than today

- Headers

```json
{
  "authorization": "${string}"
}
```

- Body

```json
{
  "name": "Melakukan testing API",
  "schedule": "2022-01-01",
  "completed": false
}
```

- Response

```json
{
  "message": [
    "Schedule should be greater than today"
  ]
}
```

### Delete Todo

#### Success

- Headers
```json
{
  "authorization": "${string}"
}
```

- Response
```json
{
  "message": "Successfully delete todo"
}
```

#### No auth
- Headers
```json
{}
```

- Response
```json
{
  "message": "Unauthorized request"
}
```

#### Invalid Token
- Headers
```json
{
  "authorization": "qweqwe"
}
```

- Response
```json
{
  "message": "Unauthorized request"
}
```

#### Delete by another user
- Headers
```json
{
  "authorization": "${string}2"
}
```

- Response
```json
{
  "message": "Unauthorized request"
}
```