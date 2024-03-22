# ระบบจัดการนักศึกษาฝึกงาน กรณีศึกษา วิทยาลัยการคอมพิวเตอร์ มหาวิทยาลัยขอนแก่น
- เพื่อออกแบบและพัฒนาเว็บแอปพลิเคชันระบบจัดการนักศึกษาฝึกงานกรณีศึกษา
- สร้างพื้นที่ในการแลกเปลี่ยนข้อมูลระหว่างนักศึกษาและอาจารย์ที่ปรึกษา

## :ledger: สารบัญ

- [เกี่ยวกับ](#beginner-about)
- [การใช้งาน](#zap-usage)
  - [การติดตั้ง](#electric_plug-installation)
  - [คำสั่ง](#package-commands)
- [การพัฒนา](#wrench-development)
  - [ข้อกำหนดเบื้องต้น](#notebook-pre-requisites)
  - [Developmen Environment](#nut_and_bolt-development-environment)
  - [โครงสร้างไฟล์](#file_folder-file-structure)

##  :beginner: เกี่ยวกับ
พัฒนาโดยใช้ Node.js ในการพัฒนาระบบ และใช้ฐานข้อมูลในรูปแบบ MongoDB สำหรับเก็บข้อมูล

## :zap: การใช้งาน
- ดาวน์โหลด [Node.js](https://nodejs.org/en) และติดตั้ง
- สมัคร [MongoDB](https://www.mongodb.com/)

###  :electric_plug: การติดตั้ง
- ดาวน์โหลด [ZIP File](https://github.com/jirakorn-sweet-p/node-project.git) จากนั้นให้แตกไฟล์ จะได้โฟลเดอร์ชื่อ node-project
- ให้เข้าไปที่ [MongoDB](https://www.mongodb.com/) เลือก Database(หากไม่มีให้ทำการสร้าง Database ก่อน) > connect > MongoDB for VS Code
- ให้นำ connection string ของคุณไปเพิ่มใน file .env ตัวอย่าง
```
MONGODB_URI = "mongodb+srv://<username>:<password>@cluster0.il0hreu.mongodb.net/"
```
- ให้ทำการเปิด cmd/terminal ในโฟลเดอร์ชื่อ node-project จากนั้นให้ใช้คำสั่ง

```
$ npm install
```

###  :package: คำสั่ง
- คำสั่งในการเริ่มโปรเจ็กต์
```
$ npm run dev
```

##  :wrench: การพัฒนา
หากต้องการพัฒนาหรือแก้ไขต้อง Clone GitHub Repository เพื่อแก้ไข Source Code

### :notebook: ข้อกำหนดเบื้องต้น
รายการข้อกำหนดเบื้องต้นทั้งหมดที่ระบบจำเป็นต้องใช้ในการพัฒนาโครงการนี้
- Node.js
- MongoDB
- Git

###  :nut_and_bolt: Development Environment
หากผู้ใช้ติดตั้ง Git อยู่แล้วสามารถ Clone โปรเจ็กต์นี้ไปพัฒนาหรือแก้ไขต่อไปได้
- Clone GitHub Repository
```
$ git clone https://github.com/jirakorn-sweet-p/node-project.git
```
- วิธีการติดตั้ง module ที่ใช้งาน
```
$ npm install
```


###  :file_folder: โครงสร้างไฟล์
รายละเอียดพื้นฐานเกี่ยวกับไฟล์ ดังนี้

```
.
├── node_modules
├── public
│   ├── css
│   ├── img
│   └── js
│   └── middleware
│   └── uploads
├── server
│   ├── config
│   └── middleware
│   └── models
│   └── routes
├── views
│   └── layouts
│   └── partials
├── app.js
├── .env
├── package.json
├── package-lock.json
└── README.md
```
