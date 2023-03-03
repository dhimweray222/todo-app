# Todo App Integration Testing

## App requirement (26 April 2022)

- Login user
  - Respon sukses memberikan token
  - Password salah memberikan error
  - Email salah memberikan error
- Menambahkan data todo per user
  - Respon sukses
    - Terdapat header authorization
    - name, schedule, dan completed diisi
    - Schedule lebih besar sama dengan hari ini
  - Respon 401 (no auth)
    - Tidak terdapat header authorization
    - name, schedule, dan completed diisi
  - Respon 401 (authorization token invalid)
    - Terdapat header authorization
    - name, schedule, dan completed diisi
    - Header authorization invalid
  - Respon 400 (required field violation)
    - Terdapat header authorization
    - name/schedule/completed tidak terisi
  - Respon 400 (schedule less than today)
    - Terdapat header authorization
    - Name, schedule, dan completed terisi
    - Schedule lebih kecil dari hari ini
- List todo per user
  - Respon sukses
    - Terdapat header authorization
    - Menampilkan nama dan completed
  - Respon 401 (no auth)
    - Header authorization tidak ada
  - Respon 401 (invalid token)
    - Header authorization ada, tapi invalid

## App Requirement (10 Mei 2022)

- Get todo by ID
  - Respon sukses
    - Terdapat header authorization
    - Menampilkan nama, schedule, dan completed
  - Respon 401 (no auth)
    - Header authorization tidak ada
    - Menampilkan pesan error 'Unauthorized request'
  - Respon 401 (invalid token)
    - Header authorization ada, tapi invalid
    - Menampilkan pesan error 'Unauthorized request'
  - Respon 401 (accessed by another user)
    - Header authorization ada, tapi punya user lain
    - Menampilkan pesan error 'Unauthorized request'
  - Respon 404 (not found)
    - Header authorization ada, tapi todo tidak ditemukan

- Update Todo
 - Respon sukses
    - Terdapat header authorization
    - name, schedule, dan completed optional
    - name, schedule, dan completed jika dikirimkan, tidak bernilai null atau string kosong
    - Schedule lebih besar sama dengan hari ini
  - Respon 401 (no auth)
    - Tidak terdapat header authorization
    - name, schedule, dan completed diisi
  - Respon 401 (authorization token invalid)
    - Terdapat header authorization
    - name, schedule, dan completed diisi
    - Header authorization invalid
  - Respon 400 (required field violation)
    - Terdapat header authorization
    - name/schedule/completed tidak terisi
  - Respon 400 (schedule less than today)
    - Terdapat header authorization
    - Name, schedule, dan completed terisi
    - Schedule lebih kecil dari hari ini

- Delete Todo
  - Respon sukses
    - Ada header authorization
  - Respon no auth (401)
    - Tidak ada headers authorization
    - Mengeluarkan pesan 'Unauthorized request'
  - Respon invalid token (401)
    - Ada headers auth, tapi invalid
    - Mengeluarkan pesan 'Unauthorized request'
  - Delete by another user (401)
    - Ada headers auth, tapi punya orang lain
    - Mengeluarkan pesan 'Unauthorized request'