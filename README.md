[![State-of-the-art Shitcode](https://img.shields.io/static/v1?label=State-of-the-art&message=Shitcode&color=7B5804)](https://github.com/trekhleb/state-of-the-art-shitcode)

```
 OOOOO              OOOOO      CCCCC  hh              tt    
OO   OO ww      ww OO   OO    CC    C hh        aa aa tt    
OO   OO ww      ww OO   OO    CC      hhhhhh   aa aaa tttt  
OO   OO  ww ww ww  OO   OO    CC    C hh   hh aa  aaa tt    
 OOOO0    ww  ww    OOOO0      CCCCC  hh   hh  aaa aa  tttt 
```

## Installation & Setup
### Server (websocket)
Rename `.env.example` file to `.env`

Put MongoDB URI in `MONGO_URI` environment variable


Run these commands:
```
cd ./server
npm install OR yarn
npm run start OR yarn start
```

### App (client)
Rename `.env.example` file to `.env`

Put your websocket URL in `WEBSOCKET_URL` environment variable


Run these commands:
```
cd ./app
npm install OR yarn
npm run start OR yarn start
```