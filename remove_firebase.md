# Overall
- I want to remove all firebase or Google Cloud Platform usage and run everything on my own VPS
- this app is my personal portfolio app and I want to make sure everything loads as fast as possible - remember that in the refactor
- after the refactor I don't want any firebase/GCP references in the project, everything is replaced by container file system or VPS

# Hosting
- remove github actions and other artifacts connected to Firebase Hosting
- create a Dockerfile that builds the app. Follow best practises for modern Vue/Nuxt/modern web app development to quickly build the project and serve it optimized for performance

# Database
- remove firestore config and connection
- all data is stored locally inside the project
- no need to use the json files as they are now - I just downloaded that data for reference, decide yourself on how to handle them. Keep in mind I might update/add/remove blogs and projects data so keep it dynamic
- I have downloaded all firestore data to `firestore_data/` directory that I want to integrate directly into the code.
- `firestore_resume.json` can be easily transitioned into `resume.vue` page, sync the data between the file and page, prioritizing the page data on conflict.
- are `firestore_projects.json` and `firestore_blogs.json` too large to be stored directly inside the docker container and can they have meaningful size and page load impact? There won't be much more data than currently so use current files as the main point of argument 

# Images storage
- remove firebase cloud storage config and logic
- keep my profile picture directly in project assets to load instantly
- for blog/projects images I have created my own cloud file storage available at `https://files.jtuta.cloud` url. I implemented sigoden/dufs solution on my VPS - you can reference that documentation using context7 to find out how to read/write files and images. Here's basic operations:
curl -u USERNAME:PASS -T ./file.pdf https://files.jtuta.cloud/portfolio/{section}/file.pdf   # upload
curl -u USERNAME:PASS https://files.jtuta.cloud/portfolio/{section}/file.pdf -o file.pdf     # download
But:
- USERNAME = FILE_STORAGE_USERNAME in .env
- PASS = FILE_STORAGE_PASSWORD in .env
- https://files.jtuta.cloud is the base path
- /portfolio/{section}/ is the directory of files (section can be 'projects' or 'blogs')