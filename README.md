# aliwaseem.com

Repo for my personal website using express, gulp and semantic UI.

## Setup 

Clone the repo and the run `npm install` to install get all dependencies.

Start by editing the database config to add you mongo URL. I use mongoLabs, its amazing for a dev database (Check them out here: https://mongolab.com/).

```
module.exports = {
    "url": "YOU MONGO URI"
};
```

After thats done you need to run the gulp task `createsuperuser` to create a user for the admin page.

When the superuser is created, just run `gulp serve` and you good to go!

