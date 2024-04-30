# Rick and Morty API - ListApp

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
#

Basically Rick and Morti is an application that searches using api, stores the selected item in sessionStroge and shows it in the list.
To improve performance, it waits for the write to finish and then issues an api request.
After the write is finished, it first searches the cache and if it finds a matching item, it retrieves the item from the cache instead of sending a request.
If not, the api sends the request and keeps the result in the cache.

Live Preview : https://rick-and-morty-listapp.netlify.app
