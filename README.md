# LAPD Class Assignments and Projects

**2020/2021** - 4th Year, 2nd Semester

**Course:** Linguagens de Anotação e Processamento de Documentos ([LAPD](https://sigarra.up.pt/feup/pt/ucurr_geral.ficha_uc_view?pv_ocorrencia_id=459512)) | Markup Languages and Document Processing

**Project developed by:** Eduardo Ribeiro ([EduRibeiro00](https://github.com/EduRibeiro00)), Martim Pinto da Silva ([motapinto](https://github.com/motapinto)), Miguel Pinto ([MiguelDelPinto](https://github.com/MiguelDelPinto)) and Nuno Cardoso ([nmtc01](https://github.com/nmtc01))

**Disclaimer** - This repository was used for educational purposes and I do not take any responsibility for anything related to its content. You are free to use any code or algorithm you find, but do so at your own risk.

---

# Photon

## Description
Photon is an application capable of:
* Extracting and analyzing energy related data from various sources
* Detecting and identifying real, high growth opportunities within the energy market and industry
* Showcasing that information to the user in an easy to use graph-based visual interface

## Motivation
* Every day, we learn about emerging technologies and developments that have the potential to be groundbreaking. But how do we detect the early proof-of-concept, non-obvious opportunities with real growth potential?
* This leads us to the broad topic of Energy. It’s one of the biggest drivers for global issues like climate change, and when starting new projects and companies, it’s important to make sure the problem is relevant.
* The process of determining whether a problem is prossiming enough is not trivial. How can we gather and treat the vast amount of data revolving around energy to detect the most promising, emerging and non-obvious problems that need to be solved?

## [Data sources](https://github.com/EduRibeiro00/feup-lapd/wiki/Sources-API-Information)
### Social Media APIs
* [Reddit API](https://pushshift.io/api-parameters/)
* [Twitter API](https://developer.twitter.com/en/docs/twitter-api/api-reference-index)
### News APIs
* [Usearch API](https://usearch.com/)

## Requirements
* Docker
* NPM
* .env similar to .env.example in backend/

## Usage
### Docker Usage - Both Frontend and Backend
* `docker-compose up`
* `docker-compose exec photon-backend npm run seed`

### Backend Usage 
* `cd backend`
* `npm install`
* `npm run neo4j`
* `npm run seed`
* `npm run dev`

**Note:** If you want to use mock data, instead of real data, you can use *npm run seed* to test our application. If not, just skip that instruction.

### Frontend Usage
* `cd frontend`
* `npm install`
* `npm start`
* `npm build`
* `npm eject`

**Note:** Check the `README.md` file inside the `photon` folder to see in more detail the results from running the commands `npm start`, `npm build` and `npm eject`.

---

**Final Grade:** 18.58 / 20

**Note:** This project was done in close collaboration with the [Research Center for Assistive Information and Communication Solutions – AICOS](https://www.aicos.fraunhofer.pt/en/home.html) from [Fraunhofer Portugal](https://www.fraunhofer.pt/en/about_us.html).
