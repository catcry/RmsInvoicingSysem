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

and put builded jar file in your vm and run it with java:
```
java -jar InvoicingSystem.jar --spring.profiles.active=production
```
