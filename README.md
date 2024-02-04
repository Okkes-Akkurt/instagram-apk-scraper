# Instagram APK Scraper

Bu dökümantasyon, Instagram APK Scraper uygulamasının nasıl kullanılacağına dair bilgileri içermektedir.

## İçindekiler

1. [Giriş](#1-giriş)
2. [Kurulum](#2-kurulum)
    - [Node.js ve MongoDB Kurulumu](#nodejs-ve-mongodb-kurulumu)
    - [Proje İndirme ve Bağımlılıkların Yüklenmesi](#proje-indirme-ve-bağımlılıkların-yüklenmesi)
3. [Uygulama Başlatma](#3-uygulama-başlatma)
    - [Node.js Uygulamasını Başlatma](#nodejs-uygulamasını-başlatma)
    - [React Uygulamasını Başlatma](#react-uygulamasını-başlatma)
4. [API Endpoint'leri](#4-api-endpointleri)
    - [Tüm Sürümleri Listeleme](#tüm-sürümleri-listeleme)
    - [Belirli Bir Sürümün Ayrıntılarını Listeleme](#belirli-bir-sürümün-ayrıntılarını-listeleme)
    - [Belirli Bir Sürümü Silme](#belirli-bir-sürümü-silme)
    - [Belirli Bir Sürümü Güncelleme](#belirli-bir-sürümü-güncelleme)
    - [Yeni Bir Sürüm Oluşturma](#yeni-bir-sürüm-oluşturma)
5. [Docker ile Uygulamayı Ayağa Kaldırma](#6-docker-ile-uygulamayı-ayağa-kaldırma)
6. [Sonuç](#7-sonuç)

## 1. Giriş

Instagram APK Scraper uygulaması, Instagram uygulamasının APK sürümlerini çekmek ve bu sürümlerle ilgili işlemleri gerçekleştirmek için kullanılır. Bu dökümantasyon, uygulamayı kurma, başlatma ve API endpoint'lerini kullanma süreçlerini detaylı bir şekilde açıklamaktadır.

## 2. Kurulum

### 2.1 Node.js ve MongoDB Kurulumu

Instagram APK Scraper uygulamasını kullanabilmek için Node.js ve MongoDB'nin bilgisayarınıza kurulu olması gerekmektedir.

-   [Node.js Kurulumu](https://nodejs.org/)
-   [MongoDB Kurulumu](https://docs.mongodb.com/manual/installation/)

### 2.2 Proje İndirme ve Bağımlılıkların Yüklenmesi

Uygulamayı indirmek ve bağımlılıkları yüklemek için aşağıdaki adımları takip edin:

```bash
git clone https://github.com/Okkes-Akkurt/instagram-apk-scraper
cd server
npm install
cd client
npm install
```

## 3. Uygulama Başlatma

### 3.1 Node.js Uygulamasını Başlatma

Node.js uygulamasını başlatmak için:

```bash
cd server
node index.js
```

## 4. API Endpoint'leri

Uygulama, aşağıdaki API endpoint'lerini sunmaktadır:

### 4.1 Tüm Sürümleri Listeleme

Endpoint: GET /versions

```bash
curl http://localhost:3001/versions
```

### 4.2 Belirli Bir Sürümün Ayrıntılarını Listeleme

Endpoint: GET /:versionId

```bash
curl http://localhost:3001/263.2.0.19.104
```

## 5. Docker ile Uygulamayı Ayağa Kaldırma

Uygulamayı Docker ile ayağa kaldırmak için:

```bash
docker-compose up
```

Uygulama ve MongoDB, Docker konteynerlerinde çalışacaktır.

## 6. Sonuç

Bu dökümantasyon, Instagram APK Scraper uygulamasının kullanımını ve yapılandırılmasını anlatmaktadır. Uygulamayı başarılı bir şekilde kurup çalıştırdıktan sonra, belirtilen API endpoint'lerini kullanarak Instagram APK sürümleri üzerinde çeşitli işlemleri gerçekleştirebilirsiniz.
