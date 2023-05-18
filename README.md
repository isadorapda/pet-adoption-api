# App

Find a pet

# Functional Requirements

- [x] Should be able to register a new pet
- [x] Should be able to get a list of pets to be adopted in a city
- [x] Should be able to filter pets by its characteristics
- [x] Should be able to access a pet details
- [x] Should be able to register as an organisation
- [x] Should be able to authenticate an organisation login

# Business Requirements

- [x] Each pet should be associated with an organisation
- [x] Organisation must register city and mobile number
- [x] City must be informed to be able to list pets for adoption
- [x] Organisation should be authenticated to login as admin
- [x] All filters should be optional except for city
- [ ] User willing to adopt a pet should contact an organisation via WhatsApp

# Non-functional Requirements

- [x] Organisation's password must be encrypted
- [x] Data must be persisted in a PostgreSQL database
- [x] All datasets must be paginated with 20 items per page
- [x] Organisation must be identified by a jwt
