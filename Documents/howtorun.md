Just run this commands step by step for build and run this project:

In `src/main/Frontend Codebase`

```
npm run build
```

then in `Invoicing System`
```
mvn clean
mvn package
```

Run With HTTPS Protocol:
```
nohup java -Djavax.net.ssl.trustStore=/home/settlement/SettlementProject/dev-truststore.p12 -Djavax.net.ssl.trustStorePassword=changeit -jar InvoicingSystem-3.0.0.jar --spring.profiles.active=development --server.port=8443 --server.ssl.key-store=/home/settlement/SettlementProject/keystore.p12 --server.ssl.key-store-password=13771210 --server.ssl.key-store-type=PKCS12 --server.ssl.key-alias=invoicing > app.log 2>&1 &
```

Remember to add Keycloak cert to java trusted certs:
```
sudo keytool -importcert -alias keycloak -file server.crt -cacerts
```
