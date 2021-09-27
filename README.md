# Virtual Assistant for Students (Chatbot) - Frontend

<p align="center">
<img src="static/img/icons/android-icon-256x256.png" alt="VAS Logo"/>
</p>

A chatbot for students to get info related to exam results, time table, etc.

This is the client side Single Page Application for [the chatbot server](https://github.com/shubhamnh/vas-chatbot-server/)

## Screenshots

<p align="center">
    <img style="padding:20px; height:500px;" src="screenshots/screenshot-1.png" alt="Screenshot 1"/>
    <img style="padding:20px; height:500px;" src="screenshots/screenshot-2.png" alt="Screenshot 2"/>
    <img style="padding:20px; height:500px;" src="screenshots/screenshot-3.png" alt="Screenshot 3"/>
    <img style="padding:20px; height:500px;" src="screenshots/screenshot-4.png" alt="Screenshot 4"/>
    <img style="padding:20px; height:500px;" src="screenshots/screenshot-5.png" alt="Screenshot 5"/>
</p>

## Installation

Requirements:

* `git`
* `nodejs` & `npm`

Clone this repo and install dependencies. 

```bash
git clone https://github.com/shubhamnh/vas-chatbot-client.git
cd vas-chatbot-client
npm install
```
Change configuration in `config/dev.env.js` & `config/prod.env.js.example` as per requirements and rename `prod.env.js.example` => `prod.env.js`.

Run development server:

```bash
npm run dev
```